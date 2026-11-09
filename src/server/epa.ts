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

export async function getMpg(make: string, model: string, year: number, optionId?: number): Promise<MpgResponse> {
  const key = `mpg:${make.toLowerCase()}:${model.toLowerCase()}:${year}:${optionId ?? "first"}`;
  return cached(key, DAY, async () => {
    const menu = await fetchJson<{ menuItem?: MenuItem | MenuItem[] }>(
      `${BASE}/menu/options?year=${year}&make=${enc(make)}&model=${enc(model)}`,
    );
    const options = asArray(menu.menuItem)
      .map((m) => ({ id: Number(m.value), label: String(m.text ?? "") }))
      .filter((o) => Number.isFinite(o.id));
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
