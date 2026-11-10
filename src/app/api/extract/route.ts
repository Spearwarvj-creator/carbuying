import type { NextRequest } from "next/server";
import { z } from "zod";
import { MAX_IMAGE_CHARS, readDocument } from "@/server/extract";
import { aiRoute } from "../_ai-route";

const body = z.object({
  kind: z.enum(["worksheet", "lender", "contract", "vin"]).default("worksheet"),
  images: z.array(z.string().max(MAX_IMAGE_CHARS + 100)).min(1).max(4),
});

/** Photos of car-deal paperwork in, numbers out. Nothing is stored or logged. Each photo counts as one read. */
export const POST = (request: NextRequest) =>
  aiRoute(request, body, "photo", ({ kind, images }) => readDocument(kind, images), { needsKey: true, units: (i) => i.images.length });
