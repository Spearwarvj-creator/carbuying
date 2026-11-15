import type { LearnCat } from "./types";

/** The words around the dictionary: headings, buttons, the lessons and the decoder. One set for each language. */
export interface LearnUi {
  title: string;
  lead: string;
  searchLabel: string;
  searchPlaceholder: string;
  all: string;
  cats: Record<LearnCat, string>;
  count: (n: number) => string;
  none: string;
  clear: string;
  daily: string;
  meaning: string;
  why: string;
  ask: string;
  mine: string;
  mineEmpty: string;
  related: string;
  explain: string;
  back: string;
  open: string;
  close: string;
  /** The deal the "In your deal" lines use. */
  usingDeal: string;
  noDeal: string;
  openCalc: string;
  lessons: {
    title: string;
    lead: string;
    minutes: string;
    start: string;
    step: (n: number, total: number) => string;
    yours: string;
    check: string;
    show: string;
    hide: string;
    next: string;
    prev: string;
    readNext: string;
    done: string;
  };
  decode: {
    title: string;
    lead: string;
    label: string;
    placeholder: string;
    button: string;
    photo: string;
    reading: string;
    found: (n: number) => string;
    none: string;
    translate: string;
    translating: string;
    plainTitle: string;
    aiNote: string;
    failed: string;
    privacy: string;
    sample: string;
    sampleText: string;
  };
  popover: { learn: string; close: string; inDeal: string };
  /** Where the words come from and when they were last checked, and a plain note that this is not advice. */
  sources: string;
  /** Shown in Spanish only, until a native reviewer has signed off (docs/ES_REVIEW_PROCESS.md). */
  beta?: string;
}

export const UI_EN: LearnUi = {
  title: "Learn the words of car buying",
  lead: "Dealers and lenders use words most people never learn. Here is each one in plain language, tied to something from everyday life, with a question to ask and, if you have a deal open, what it means for yours.",
  searchLabel: "Search the words",
  searchPlaceholder: "Try APR, doc fee, trade-in",
  all: "All",
  cats: { price: "Price and paperwork", loan: "Loans and rates", extras: "Extras and protection", trade: "Trade-in and value", lease: "Leasing", own: "Owning the car" },
  count: (n) => (n === 1 ? "1 word" : `${n} words`),
  none: "No word matches that. Try a shorter word, or clear the search.",
  clear: "Clear the search",
  daily: "In daily life",
  meaning: "What it means",
  why: "Why it matters",
  ask: "Ask the dealer",
  mine: "In your deal",
  mineEmpty: "Open a deal in the calculator and this line will show your own numbers.",
  related: "Read next",
  explain: "Explain it another way",
  back: "Back to the list",
  open: "Show more",
  close: "Show less",
  usingDeal: "Showing figures from the deal you have open.",
  noDeal: "No deal is open, so the figures are left out.",
  openCalc: "Open the calculator",
  lessons: {
    title: "Start here: six short lessons",
    lead: "Two minutes each. Each one ends with a question to check yourself, and a look at your own deal if you have one open.",
    minutes: "2 minutes",
    start: "Start the lesson",
    step: (n, total) => `Step ${n} of ${total}`,
    yours: "In your deal",
    check: "Check yourself",
    show: "Show the answer",
    hide: "Hide the answer",
    next: "Next",
    prev: "Back",
    readNext: "Words in this lesson",
    done: "Done",
  },
  decode: {
    title: "Decode what the dealer wrote",
    lead: "Paste anything from a quote, a text or a contract, or take a photo of it. We underline each car-buying word and say what it means.",
    label: "What did the dealer say or write?",
    placeholder: "Paste it here. For example: we can get you to $450 a month with our protection package and a documentation fee.",
    button: "Decode this",
    photo: "Photo instead",
    reading: "Reading the photo",
    found: (n) => (n === 1 ? "1 word explained" : `${n} words explained`),
    none: "We did not find any car-buying words in that. Try pasting a longer piece.",
    translate: "Say it in plain words",
    translating: "Writing it plainly",
    plainTitle: "In plain words",
    aiNote: "Written by an AI from your text. It does not add any numbers of its own.",
    failed: "The plain-words helper is not available right now. The word list above still works.",
    privacy: "Nothing you paste is stored. A photo is sent to read the text, then discarded. Cover names and addresses first.",
    sample: "Try an example",
    sampleText: "We can get you to $450 a month, with the protection package and the documentation fee, once your financing is approved.",
  },
  popover: { learn: "Learn more", close: "Close", inDeal: "In your deal" },
  sources: "Checked November 2026 against plain-language pages from the CFPB, the FTC and the NHTSA. This explains words. It is not legal or financial advice, and rules differ by state. Your contract is what counts.",
};

export const UI_ES: LearnUi = {
  title: "Aprenda las palabras de comprar un auto",
  lead: "Los vendedores y prestamistas usan palabras que la mayoría nunca aprende. Aquí está cada una en lenguaje sencillo, ligada a algo de la vida diaria, con una pregunta para hacer y, si tiene un trato abierto, lo que significa para el suyo.",
  searchLabel: "Buscar palabras",
  searchPlaceholder: "Pruebe APR, cargo de documentación, auto de intercambio",
  all: "Todas",
  cats: { price: "Precio y papeleo", loan: "Préstamos y tasas", extras: "Extras y protección", trade: "Auto de intercambio y valor", lease: "Arrendamiento", own: "Tener el auto" },
  count: (n) => (n === 1 ? "1 palabra" : `${n} palabras`),
  none: "Ninguna palabra coincide. Pruebe una más corta, o borre la búsqueda.",
  clear: "Borrar la búsqueda",
  daily: "En la vida diaria",
  meaning: "Qué significa",
  why: "Por qué importa",
  ask: "Pregunte al vendedor",
  mine: "En su trato",
  mineEmpty: "Abra un trato en la calculadora y esta línea mostrará sus propios números.",
  related: "Lea después",
  explain: "Explicarlo de otra manera",
  back: "Volver a la lista",
  open: "Ver más",
  close: "Ver menos",
  usingDeal: "Se muestran las cifras del trato que tiene abierto.",
  noDeal: "No hay un trato abierto, así que no se muestran cifras.",
  openCalc: "Abrir la calculadora",
  lessons: {
    title: "Empiece aquí: seis lecciones cortas",
    lead: "Dos minutos cada una. Cada una termina con una pregunta para comprobar lo aprendido, y una mirada a su propio trato si tiene uno abierto.",
    minutes: "2 minutos",
    start: "Empezar la lección",
    step: (n, total) => `Paso ${n} de ${total}`,
    yours: "En su trato",
    check: "Compruebe lo aprendido",
    show: "Ver la respuesta",
    hide: "Ocultar la respuesta",
    next: "Siguiente",
    prev: "Atrás",
    readNext: "Palabras de esta lección",
    done: "Listo",
  },
  decode: {
    title: "Descifre lo que escribió el vendedor",
    lead: "Pegue cualquier cosa de una cotización, un mensaje o un contrato, o tome una foto. Subrayamos cada palabra de compra de autos y decimos qué significa.",
    label: "¿Qué dijo o escribió el vendedor?",
    placeholder: "Péguelo aquí. Por ejemplo: le podemos dejar en $450 al mes con el paquete de protección y el cargo de documentación.",
    button: "Descifrar",
    photo: "Mejor una foto",
    reading: "Leyendo la foto",
    found: (n) => (n === 1 ? "1 palabra explicada" : `${n} palabras explicadas`),
    none: "No encontramos palabras de compra de autos ahí. Pruebe pegar un texto más largo.",
    translate: "Decirlo con palabras sencillas",
    translating: "Escribiéndolo sencillo",
    plainTitle: "Con palabras sencillas",
    aiNote: "Escrito por una IA a partir de su texto. No agrega números propios.",
    failed: "El ayudante de palabras sencillas no está disponible ahora. La lista de palabras de arriba sigue funcionando.",
    privacy: "No se guarda nada de lo que pega. Una foto se envía para leer el texto y luego se descarta. Cubra nombres y direcciones primero.",
    sample: "Probar un ejemplo",
    sampleText: "Le podemos dejar en $450 al mes, con el paquete de protección y el cargo de documentación, una vez que se apruebe su financiamiento.",
  },
  popover: { learn: "Más información", close: "Cerrar", inDeal: "En su trato" },
  sources: "Revisado en noviembre de 2026 con páginas en lenguaje sencillo de la CFPB, la FTC y la NHTSA. Esto explica palabras. No es asesoría legal ni financiera, y las reglas cambian según el estado. Lo que vale es su contrato.",
  beta: "Versión beta: un hablante nativo de español está revisando este texto. Si algo no se entiende, díganoslo. Si hay una diferencia, vale la versión en inglés.",
};
