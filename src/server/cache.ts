/**
 * Small in-memory cache with a lifetime per entry. A serverless instance keeps
 * it only while warm, which is enough to spare the outside services repeat
 * calls. The response headers also ask browsers and the edge to cache.
 */
const store = new Map<string, { expires: number; value: unknown }>();
const MAX_ENTRIES = 500;

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;

export async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  const value = await load();
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  store.set(key, { expires: Date.now() + ttlMs, value });
  return value;
}
