export interface ZipPlace {
  zip: string;
  state: string;
  city: string;
}

type ZipTable = Record<string, string>;
let table: Promise<ZipTable> | null = null;

/**
 * Looks a ZIP code up in the table built by scripts/build-zip-table.mjs.
 * The table loads the first time a buyer types a ZIP, and the lookup runs on
 * the device, so the ZIP never leaves it.
 */
export async function lookupZip(zip: string): Promise<ZipPlace | null> {
  const clean = zip.trim();
  if (!/^\d{5}$/.test(clean)) return null;
  table ??= import("@/data/zip-state.json").then((m) => m.default as ZipTable);
  const row = (await table)[clean];
  if (!row) return null;
  const [state, city] = row.split("|");
  return { zip: clean, state, city };
}

export function placeLabel(p: ZipPlace): string {
  return `${p.city}, ${p.state}`;
}
