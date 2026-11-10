import { checkVin } from "@/engine/vin";
import { cached, DAY, HOUR } from "./cache";
import { fetchJson, UpstreamError } from "./fetch-json";
import type { RatingsResponse, RecallsResponse, VinResponse } from "./schemas";

const VPIC = "https://vpic.nhtsa.dot.gov/api/vehicles";
const NHTSA = "https://api.nhtsa.gov";

const enc = encodeURIComponent;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function decodeVin(input: string): Promise<VinResponse> {
  const local = checkVin(input);
  if (!local.wellFormed) {
    return {
      vin: local.vin,
      status: "unreadable",
      localCheckDigitOk: false,
      errorCodes: [],
      message:
        local.problem === "length"
          ? "A VIN has 17 characters. Check it, or pick the year, make and model instead."
          : "A VIN uses only letters and numbers, and never I, O or Q. Check it, or pick the year, make and model instead.",
      vehicle: null,
    };
  }
  const data = await cached(`vin:${local.vin}`, DAY, () =>
    fetchJson<{ Results?: Array<Record<string, unknown>> }>(`${VPIC}/DecodeVinValues/${enc(local.vin)}?format=json`),
  );
  const row = data.Results?.[0];
  if (!row) throw new UpstreamError("The VIN service sent no result", "shape");
  const errorCodes = str(row.ErrorCode)
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const year = Number.parseInt(str(row.ModelYear), 10);
  const vehicle = {
    year: Number.isFinite(year) ? year : null,
    make: str(row.Make),
    model: str(row.Model),
    trim: str(row.Trim),
    bodyClass: str(row.BodyClass),
    driveType: str(row.DriveType),
    fuel: str(row.FuelTypePrimary),
    cylinders: str(row.EngineCylinders),
    displacementL: str(row.DisplacementL),
  };
  const hasVehicle = vehicle.make !== "" && vehicle.model !== "";
  if (errorCodes.includes("0")) {
    return { vin: local.vin, status: "clean", localCheckDigitOk: local.checkDigitOk, errorCodes, message: "VIN decoded.", vehicle };
  }
  if (errorCodes.includes("1")) {
    return {
      vin: local.vin,
      status: "check-digit",
      localCheckDigitOk: local.checkDigitOk,
      errorCodes,
      message: "Check the VIN: the 9th character does not match.",
      vehicle: hasVehicle ? vehicle : null,
    };
  }
  return {
    vin: local.vin,
    status: "unreadable",
    localCheckDigitOk: local.checkDigitOk,
    errorCodes,
    message: "We could not read this VIN. Enter it again, or pick the year, make and model.",
    vehicle: null,
  };
}

export async function listMakes(): Promise<string[]> {
  const data = await cached("makes", DAY, () =>
    fetchJson<{ Results?: Array<{ MakeName?: string }> }>(`${VPIC}/GetMakesForVehicleType/car?format=json`),
  );
  const names = (data.Results ?? []).map((r) => str(r.MakeName)).filter(Boolean);
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

export async function listModels(make: string, year: number): Promise<string[]> {
  const key = `models:${make.toLowerCase()}:${year}`;
  // The plain list also returns motorcycles, so ask for cars, trucks and SUVs/minivans separately and join them.
  const lists = await cached(key, DAY, () =>
    Promise.all(
      ["car", "truck", "mpv"].map((type) =>
        fetchJson<{ Results?: Array<{ Model_Name?: string }> }>(
          `${VPIC}/GetModelsForMakeYear/make/${enc(make)}/modelyear/${year}/vehicleType/${type}?format=json`,
        ),
      ),
    ),
  );
  const names = lists.flatMap((d) => (d.Results ?? []).map((r) => str(r.Model_Name)).filter(Boolean));
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

export async function listRecalls(make: string, model: string, year: number): Promise<RecallsResponse> {
  const key = `recalls:${make.toLowerCase()}:${model.toLowerCase()}:${year}`;
  const data = await cached(key, HOUR, () =>
    fetchJson<{ results?: Array<Record<string, unknown>> }>(
      `${NHTSA}/recalls/recallsByVehicle?make=${enc(make)}&model=${enc(model)}&modelYear=${year}`,
    ),
  );
  const recalls = (data.results ?? []).map((r) => ({
    campaign: str(r.NHTSACampaignNumber),
    component: str(r.Component),
    summary: str(r.Summary).slice(0, 400),
    reportDate: str(r.ReportReceivedDate),
  }));
  return { scope: "model-year", count: recalls.length, recalls, checkUrl: "https://www.nhtsa.gov/recalls" };
}

export async function getRatings(make: string, model: string, year: number): Promise<RatingsResponse> {
  const key = `ratings:${make.toLowerCase()}:${model.toLowerCase()}:${year}`;
  return cached(key, DAY, async () => {
    const found = await fetchJson<{ Results?: Array<{ VehicleId?: number; VehicleDescription?: string }> }>(
      `${NHTSA}/SafetyRatings/modelyear/${year}/make/${enc(make)}/model/${enc(model)}`,
    );
    const first = found.Results?.[0];
    if (!first?.VehicleId) {
      return { rated: false, vehicleId: null, description: null, overall: null, frontCrash: null, sideCrash: null, rollover: null };
    }
    const detail = await fetchJson<{ Results?: Array<Record<string, unknown>> }>(`${NHTSA}/SafetyRatings/VehicleId/${first.VehicleId}`);
    const r = detail.Results?.[0] ?? {};
    return {
      rated: str(r.OverallRating) !== "" && str(r.OverallRating) !== "Not Rated",
      vehicleId: first.VehicleId,
      description: str(first.VehicleDescription) || null,
      overall: str(r.OverallRating) || null,
      frontCrash: str(r.OverallFrontCrashRating) || null,
      sideCrash: str(r.OverallSideCrashRating) || null,
      rollover: str(r.RolloverRating) || null,
    };
  });
}
