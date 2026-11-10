import { z } from "zod";
import { TERMS, type Term } from "@/data/strings/terms";
import { allowedFrom, numbersAreAllowed } from "@/lib/guard";
import { AiError, aiConfigured, chat } from "./ai";

/**
 * The words side of the AI: explain one line of the deal, reword the ask in a tone or another language, and
 * play a finance manager for practice. In all three the model chooses words only. Every reply passes the
 * numbers guard: a figure that is not in the deal or in the fixed text it was given means the reply is thrown
 * away and the plain template text is shown. Nothing is stored or logged.
 */
const LANG = { en: "English", es: "Spanish (Latin American, plain and polite)" } as const;
export type Lang = keyof typeof LANG;

export interface Answer {
  text: string;
  /** "ai" when a model wrote it and the guard passed; "template" when the fixed text is shown instead. */
  source: "ai" | "template";
}

export const askInput = z.object({
  topic: z.string().max(40),
  question: z.string().max(300),
  lang: z.enum(["en", "es"]).default("en"),
  /** The text of the check or term the buyer tapped, made by the app, with the deal's figures in it. */
  context: z.string().max(1200),
  figures: z.array(z.number()).max(60).default([]),
});

const EXPLAIN_SYSTEM = (lang: Lang) =>
  `You help a person buying a car in the United States understand one line of their deal. Write in ${LANG[lang]} at about a sixth-grade reading level, in at most 110 words, in short sentences.
Use only the facts and numbers in CONTEXT. Do not add any other number, price, percentage or date. If CONTEXT cannot answer the question, say what to ask the dealer instead.
Do not tell the person to buy, sign, refuse or pay anything, and do not give legal or financial advice. Finish with one question they can ask the dealer. Output only the answer.`;

function glossary(topic: string): Term | null {
  return topic in TERMS ? (TERMS as Record<string, Term>)[topic] : null;
}

export async function explain(input: z.infer<typeof askInput>, opts: { fetcher?: typeof fetch } = {}): Promise<Answer> {
  const g = glossary(input.topic);
  const fixed = g ? `${g.plain}. ${g.meaning} Ask: ${g.ask}` : input.context;
  const template: Answer = { text: fixed, source: "template" };
  if (!aiConfigured()) return template;
  const context = [g ? `${g.term}: ${g.meaning} Ask: ${g.ask}` : "", input.context].filter(Boolean).join("\n");
  try {
    const text = (
      await chat({
        job: "text",
        system: EXPLAIN_SYSTEM(input.lang),
        user: `CONTEXT:\n${context}\n\nQUESTION: ${input.question}`,
        maxTokens: 300,
        temperature: 0.2,
        fetcher: opts.fetcher,
      })
    ).trim();
    return numbersAreAllowed(text, [...input.figures, ...allowedFrom(context)]) ? { text, source: "ai" } : template;
  } catch (e) {
    if (e instanceof AiError && e.kind === "limit") throw e;
    return template;
  }
}

export const TONES = ["polite", "firm", "short", "text"] as const;
export const draftInput = z.object({
  text: z.string().min(1).max(1200),
  tone: z.enum(TONES),
  lang: z.enum(["en", "es"]).default("en"),
});

const TONE_NOTE: Record<(typeof TONES)[number], string> = {
  polite: "friendly and polite, like a thoughtful customer",
  firm: "calm and firm, clear that the buyer is prepared, never rude or threatening",
  short: "as short as possible while keeping every request",
  text: "a casual text message, two or three short lines, no greeting formalities",
};

export async function draft(input: z.infer<typeof draftInput>, opts: { fetcher?: typeof fetch } = {}): Promise<Answer> {
  const template: Answer = { text: input.text, source: "template" };
  if (!aiConfigured() || (input.tone === "polite" && input.lang === "en")) return template;
  try {
    const text = (
      await chat({
        job: "text",
        system: `You reword a message a car buyer will send or say to a dealer. Keep every request and every number exactly as written, and add no new number, name or claim. Tone: ${TONE_NOTE[input.tone]}. Write in ${LANG[input.lang]}. Output only the message.`,
        user: input.text,
        maxTokens: 400,
        temperature: 0.4,
        fetcher: opts.fetcher,
      })
    ).trim();
    const same = allowedFrom(input.text);
    const keepsAll = same.every((n) => allowedFrom(text).some((m) => Math.abs(m - n) < 0.51));
    return keepsAll && numbersAreAllowed(text, same) ? { text, source: "ai" } : template;
  } catch (e) {
    if (e instanceof AiError && e.kind === "limit") throw e;
    return template;
  }
}

export const practiceInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(400) })).min(1).max(14),
  summary: z.string().max(800),
  figures: z.array(z.number()).max(60).default([]),
  lang: z.enum(["en", "es"]).default("en"),
});

const PRACTICE_FALLBACK = "Let's look at this together. What would you like to change first?";

export async function practice(input: z.infer<typeof practiceInput>, opts: { fetcher?: typeof fetch } = {}): Promise<Answer> {
  if (!aiConfigured()) throw new AiError("AI is not switched on", "not-configured");
  const transcript = input.messages.map((m) => `${m.role === "user" ? "BUYER" : "MANAGER"}: ${m.content}`).join("\n");
  try {
    const text = (
      await chat({
        job: "text",
        system: `You play a car dealership finance manager so a buyer can practise a real conversation. Stay in character, speak in ${LANG[input.lang]}, in at most 60 words, in plain spoken sentences. Be realistic and a little persuasive: steer toward the monthly payment, offer optional products, hint at urgency. Never be abusive or threatening. Use only the numbers in DEAL; never invent a price, rate or fee. Reply as the MANAGER to the last BUYER line. Output only what the manager says.`,
        user: `DEAL: ${input.summary}\n\n${transcript}\nMANAGER:`,
        maxTokens: 200,
        temperature: 0.7,
        fetcher: opts.fetcher,
      })
    ).trim();
    return numbersAreAllowed(text, [...input.figures, ...allowedFrom(input.summary)]) ? { text, source: "ai" } : { text: PRACTICE_FALLBACK, source: "template" };
  } catch (e) {
    if (e instanceof AiError && (e.kind === "limit" || e.kind === "not-configured")) throw e;
    return { text: PRACTICE_FALLBACK, source: "template" };
  }
}
