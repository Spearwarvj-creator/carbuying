import { computeDeal, trail, whatItTakes } from "@/engine";
import { EXAMPLE_OFFERS } from "@/data/example";

/** The example deal worked through the engine. Every figure on the site pages comes from here. */
export function getExample() {
  const [o1, o2] = EXAMPLE_OFFERS;
  return {
    o1,
    o2,
    d1: computeDeal(o1),
    d2: computeDeal(o2),
    trail: trail(o1, o2),
    take: whatItTakes(o1, o2, "total"),
  };
}
