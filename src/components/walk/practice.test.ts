import { describe, expect, it } from "vitest";
import { RUBRIC, unaccent } from "./PracticeSheet";

const hit = (id: string, said: string) => RUBRIC.find((r) => r.id === id)!.test.test(unaccent(said));

describe("practice rubric", () => {
  it("sees each of the six things when they are said", () => {
    expect(hit("writing", "Can you put the out-the-door price in writing?")).toBe(true);
    expect(hit("without", "What is the price without the extras?")).toBe(true);
    expect(hit("no", "No, thank you. I did not ask for that.")).toBe(true);
    expect(hit("final", "What happens if the financing falls through?")).toBe(true);
    expect(hit("rate", "What rate did the lender approve?")).toBe(true);
    expect(hit("time", "I would like time to read the contract first.")).toBe(true);
  });
  it("does not give credit for unrelated talk", () => {
    for (const r of RUBRIC) expect(r.test.test("Hello, nice to meet you. The weather is warm today."), r.id).toBe(false);
  });
});

describe("practice rubric in Spanish", () => {
  it("sees each of the six things in plain Spanish", () => {
    expect(hit("writing", "¿Puede poner el precio final por escrito?")).toBe(true);
    expect(hit("without", "¿Cuál es el precio sin los extras?")).toBe(true);
    expect(hit("no", "No, gracias. Yo no pedí eso.")).toBe(true);
    expect(hit("final", "¿Qué pasa si el financiamiento no se aprueba?")).toBe(true);
    expect(hit("rate", "¿Qué tasa aprobó el prestamista?")).toBe(true);
    expect(hit("time", "Quisiera tiempo para leer el contrato.")).toBe(true);
  });
  it("finds nothing in small talk", () => {
    for (const r of RUBRIC) expect(r.test.test(unaccent("Hola, mucho gusto. Hoy hace calor.")), r.id).toBe(false);
  });
});
