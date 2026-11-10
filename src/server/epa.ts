import { cached, DAY } from "./cache";
import { fetchJson, UpstreamError } from "./fetch-json";
import type { MpgResponse } from "./schemas";

const BASE = "https://www.fueleconomy.gov/ws/rest/vehicle";
const enc = encodeURIComponent;
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

interface MenuItem {
  text?: string;
  value?: string;
}

/** fueleconomy.gov sends one item as an object and several as an array. */
const asArray = <T>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/** The options menu for one EPA model name. The service answers with a bare `null` when the name is not one it knows. */
async function optionsFor(year: number, make: string, model: string) {
  const menu = await fetchJson<{ menuItem?: MenuItem | MenuItem[] } | null>(
    `${BASE}/menu/options?year=${year}&make=${enc(make)}&model=${enc(model)}`,
  );
  return asArray(menu?.menuItem)
    .map((m) => ({ id: Number(m.value), label: String(m.text ?? "") }))
    .filter((o) => Number.isFinite(o.id));
}

/**
 * The EPA names models its own way: the safety agency's "Civic" is the EPA's "Civic 4Dr" and "Civic 2Dr".
 * When the plain name finds nothing, take the EPA models that start with it and gather their options.
 */
async function optionsByPrefix(year: number, make: string, model: string) {
  const menu = await fetchJson<{ menuItem?: MenuItem | MenuItem[] } | null>(`${BASE}/menu/model?year=${year}&make=${enc(make)}`);
  const wanted = model.toLowerCase();
  const names = asArray(menu?.menuItem)
    .map((m) => String(m.value ?? m.text ?? ""))
    .filter((n) => n.toLowerCase().startsWith(`${wanted} `))
    .slice(0, 4);
  const found: { id: number; label: string }[] = [];
  for (const name of names) {
    for (const o of await optionsFor(year, make, name)) {
      if (!found.some((f) => f.id === o.id)) found.push({ id: o.id, label: `${name}: ${o.label}` });
    }
  }
  return found;
}

export async function getMpg(make: string, model: string, year: number, optionId?: number): Promise<MpgResponse> {
  const key = `mpg:${make.toLowerCase()}:${model.toLowerCase()}:${year}:${optionId ?? "first"}`;
  return cached(key, DAY, async () => {
    let options = await optionsFor(year, make, model);
    if (options.length === 0) options = await optionsByPrefix(year, make, model);
    const id = optionId ?? options[0]?.id;
    if (!id) {
      return { found: false, options, vehicleId: null, combined: null, city: null, highway: null, annualFuelCost: null, source: "EPA estimate" };
    }
    const v = await fetchJson<Record<string, unknown>>(`${BASE}/${id}`);
    if (v.comb08 === undefined) throw new UpstreamError("The fuel economy service sent an unexpected answer", "shape");
    return {
      found: true,
      options,
      vehicleId: id,
      combined: num(v.comb08),
      city: num(v.city08),
      highway: num(v.highway08),
      annualFuelCost: num(v.fuelCost08),
      source: "EPA estimate",
    };
  });
}
