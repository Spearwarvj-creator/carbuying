import type { NextRequest } from "next/server";
import { listRecalls } from "@/server/nhtsa";
import { fail, ok } from "@/server/respond";
import { vehicleQuery } from "@/server/schemas";

export async function GET(request: NextRequest) {
  try {
    const { make, model, year } = vehicleQuery.parse(Object.fromEntries(request.nextUrl.searchParams));
    return ok(await listRecalls(make, model, year), 3600);
  } catch (err) {
    return fail(err);
  }
}
