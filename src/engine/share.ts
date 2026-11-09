import { z } from "zod";
import { OfferSchema } from "./offer";

/**
 * The deal, packed into the part of the web address after the # sign.
 * Browsers do not send that part to servers, so a relative can open the link
 * and the deal never reaches us. Deflate, then base64url.
 */
export const SharedDealSchema = z.object({
  v: z.literal(1),
  offers: z.array(OfferSchema).min(1).max(6),
  labels: z.array(z.string().max(40)).max(6).default([]),
  vehicle: z
    .object({
      year: z.number().int().min(1950).max(2100),
      make: z.string().max(40),
      model: z.string().max(60),
      trim: z.string().max(60).optional(),
    })
    .optional(),
});

export type SharedDeal = z.infer<typeof SharedDealSchema>;

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (text.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function run(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const source = new Blob([bytes as BlobPart]).stream().pipeThrough(stream as unknown as TransformStream<Uint8Array, Uint8Array>);
  return new Uint8Array(await new Response(source).arrayBuffer());
}

export async function encodeDeal(state: SharedDeal): Promise<string> {
  const json = JSON.stringify(SharedDealSchema.parse(state));
  const packed = await run(new TextEncoder().encode(json), new CompressionStream("deflate-raw"));
  return toBase64Url(packed);
}

/** Returns null when the fragment is damaged, too large or fails validation. */
export async function decodeDeal(fragment: string): Promise<SharedDeal | null> {
  try {
    const text = fragment.replace(/^#/, "");
    if (text.length === 0 || text.length > 20_000) return null;
    const bytes = await run(fromBase64Url(text), new DecompressionStream("deflate-raw"));
    if (bytes.length > 100_000) return null;
    const parsed = SharedDealSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
