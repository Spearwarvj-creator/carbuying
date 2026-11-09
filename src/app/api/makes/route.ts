import { listMakes } from "@/server/nhtsa";
import { fail, ok } from "@/server/respond";

export async function GET() {
  try {
    return ok({ makes: await listMakes() }, 86400);
  } catch (err) {
    return fail(err);
  }
}
