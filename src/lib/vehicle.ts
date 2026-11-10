import type { MpgResponse, RatingsResponse, RecallsResponse, VinResponse } from "@/server/schemas";

/**
 * What the public vehicle services know about one car: who made it, its crash ratings (NHTSA), recalls for
 * its model year (NHTSA) and fuel economy (EPA). None of it says what the car should cost; there is no free
 * source for that, and an AI must not guess it. Each part can be missing, and the card shows what it has.
 */
export interface VehicleInfo {
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyClass?: string;
  ratings: RatingsResponse | null;
  recalls: RecallsResponse | null;
  mpg: MpgResponse | null;
}

async function get<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

const q = (year: number, make: string, model: string) => `year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;

export async function infoFor(year: number, make: string, model: string, extra: Partial<Pick<VehicleInfo, "vin" | "trim" | "bodyClass">> = {}): Promise<VehicleInfo> {
  const [ratings, recalls, mpg] = await Promise.all([
    get<RatingsResponse>(`/api/ratings?${q(year, make, model)}`),
    get<RecallsResponse>(`/api/recalls?${q(year, make, model)}`),
    get<MpgResponse>(`/api/mpg?${q(year, make, model)}`),
  ]);
  return { year, make, model, ...extra, ratings, recalls, mpg };
}

/** A VIN, looked up. The message is the service's own plain sentence when it cannot be read. */
export async function lookupVin(vin: string): Promise<VehicleInfo | { error: string }> {
  const data = await get<VinResponse>(`/api/vin?vin=${encodeURIComponent(vin)}`);
  if (!data) return { error: "The vehicle service is not answering right now. Pick the year, make and model instead." };
  if (!data.vehicle || !data.vehicle.year) return { error: data.message };
  const v = data.vehicle;
  return infoFor(v.year!, v.make, v.model, { vin: data.vin, trim: v.trim || undefined, bodyClass: v.bodyClass || undefined });
}

export async function listMakes(year: number): Promise<string[]> {
  return (await get<{ makes: string[] }>(`/api/makes?year=${year}`))?.makes ?? [];
}

export async function listModels(year: number, make: string): Promise<string[]> {
  return (await get<{ models: string[] }>(`/api/models?year=${year}&make=${encodeURIComponent(make)}`))?.models ?? [];
}
