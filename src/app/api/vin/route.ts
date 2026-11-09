import type { NextRequest } from "next/server";
import { decodeVin } from "@/server/nhtsa";
import { fail, ok } from "@/server/respond";
import { vinQuery } from "@/server/schemas";

export async function GET(request: NextRequest) {
  try {
    const { vin } = vinQuery.parse(Object.fromEntries(request.nextUrl.searchParams));
    return ok(await decodeVin(vin), 86400);
  } catch (err) {
    return fail(err);
  }
}
