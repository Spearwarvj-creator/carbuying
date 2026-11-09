import { z } from "zod";

const text = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .regex(/^[A-Za-z0-9 .&'/+\-]+$/, "Use letters, numbers and spaces only");

export const yearSchema = z.coerce.number().int().min(1981).max(2100);

export const vinQuery = z.object({ vin: z.string().max(40) });
export const modelsQuery = z.object({ make: text, year: yearSchema });
export const vehicleQuery = z.object({ make: text, model: text, year: yearSchema });

/** The documented shapes the routes return. The interface depends on these. */
export interface VinVehicle {
  year: number | null;
  make: string;
  model: string;
  trim: string;
  bodyClass: string;
  driveType: string;
  fuel: string;
  cylinders: string;
  displacementL: string;
}

export interface VinResponse {
  vin: string;
  /** clean: decoded and the check digit is right. check-digit: the 9th character does not match. unreadable: ask the buyer to re-enter or pick year, make and model. */
  status: "clean" | "check-digit" | "unreadable";
  localCheckDigitOk: boolean;
  errorCodes: string[];
  message: string;
  vehicle: VinVehicle | null;
}

export interface Recall {
  campaign: string;
  component: string;
  summary: string;
  reportDate: string;
}

export interface RecallsResponse {
  scope: "model-year";
  count: number;
  recalls: Recall[];
  checkUrl: string;
}

export interface RatingsResponse {
  rated: boolean;
  vehicleId: number | null;
  description: string | null;
  overall: string | null;
  frontCrash: string | null;
  sideCrash: string | null;
  rollover: string | null;
}

export interface MpgResponse {
  found: boolean;
  options: Array<{ id: number; label: string }>;
  vehicleId: number | null;
  combined: number | null;
  city: number | null;
  highway: number | null;
  annualFuelCost: number | null;
  source: "EPA estimate";
}
