/** Failure talking to an outside service. The interface falls back to manual entry. */
export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly kind: "timeout" | "status" | "network" | "shape",
    readonly status?: number,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

export const UPSTREAM_TIMEOUT_MS = 10_000;

export async function fetchJson<T = unknown>(
  url: string,
  options: { headers?: Record<string, string>; timeoutMs?: number } = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", ...options.headers },
      signal: AbortSignal.timeout(options.timeoutMs ?? UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new UpstreamError("The service took too long to answer", "timeout");
    }
    throw new UpstreamError("Could not reach the service", "network");
  }
  if (!res.ok) throw new UpstreamError(`The service answered with status ${res.status}`, "status", res.status);
  try {
    return (await res.json()) as T;
  } catch {
    throw new UpstreamError("The service sent an answer we could not read", "shape");
  }
}
