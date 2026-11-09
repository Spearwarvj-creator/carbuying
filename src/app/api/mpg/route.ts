import type { NextRequest } from "next/server";
import { z } from "zod";
import { getMpg } from "@/server/epa";
import { fail, ok } from "@/server/respond";
import { vehicleQuery } from "@/server/schemas";

const query = vehicleQuery.extend({ option: z.coerce.number().int().positive().optional() });

export async function GET(request: NextRequest) {
  try {
    const { make, model, year, option } = query.parse(Object.fromEntries(request.nextUrl.searchParams));
    return ok(await getMpg(make, model, year, option), 86400);
  } catch (err) {
    return fail(err);
  }
}
