import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UpstreamError } from "./fetch-json";

export function ok<T>(data: T, maxAgeSeconds: number) {
  return NextResponse.json(data, {
    headers: { "Cache-Control": `public, max-age=${maxAgeSeconds}, s-maxage=${maxAgeSeconds}` },
  });
}

/**
 * Plain failure answers. The interface reads `fallback: "manual"` and lets the
 * buyer type the details instead. We never log request details.
 */
export function fail(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "bad-request", message: "Check the details you entered and try again.", fallback: "manual" },
      { status: 400 },
    );
  }
  if (err instanceof UpstreamError) {
    return NextResponse.json(
      { error: err.kind, message: "The vehicle service is not answering right now. You can enter the details yourself.", fallback: "manual" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(
    { error: "unknown", message: "Something went wrong. You can enter the details yourself.", fallback: "manual" },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}
