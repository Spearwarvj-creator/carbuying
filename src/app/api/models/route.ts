import type { NextRequest } from "next/server";
import { listModels } from "@/server/nhtsa";
import { fail, ok } from "@/server/respond";
import { modelsQuery } from "@/server/schemas";

export async function GET(request: NextRequest) {
  try {
    const { make, year } = modelsQuery.parse(Object.fromEntries(request.nextUrl.searchParams));
    return ok({ models: await listModels(make, year) }, 86400);
  } catch (err) {
    return fail(err);
  }
}
