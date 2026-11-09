import type { NextRequest } from "next/server";
import { getRatings } from "@/server/nhtsa";
import { fail, ok } from "@/server/respond";
import { vehicleQuery } from "@/server/schemas";

export async function GET(request: NextRequest) {
  try {
    const { make, model, year } = vehicleQuery.parse(Object.fromEntries(request.nextUrl.searchParams));
    return ok(await getRatings(make, model, year), 86400);
  } catch (err) {
    return fail(err);
  }
}
