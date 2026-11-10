import { z } from "zod";
import { OfferSchema } from "@/engine";
import { useDeal } from "@/store/deal";
import { STAGES, useWalk, type WalkView } from "@/store/walk";

/**
 * Keeps the buyer's place. Two small things, both on this device only:
 *
 *  1. The numbers and the step are kept in the tab's session storage (key dd-session), so a refresh or an accidental
 *     swipe does not lose them. Closing the tab clears them. Nothing is sent anywhere.
 *  2. Each Walk step is a history entry (/deal?step=3), so the Back button goes to the step before, as a buyer expects,
 *     instead of leaving the calculator. The address holds only the step number, never a figure.
 */
const KEY = "dd-session";

// A blank quote has a price of zero, which a finished offer may not have, so a session allows it.
const SessionOffer = OfferSchema.extend({ price: z.number().min(0).max(10_000_000) });
const Session = z.object({
  v: z.literal(1),
  offers: z.tuple([SessionOffer, SessionOffer]),
  names: z.tuple([z.string().max(40), z.string().max(40)]),
  editing: z.union([z.literal(0), z.literal(1)]),
  vehicle: z
    .object({
      year: z.number().int().min(1950).max(2100),
      make: z.string().max(40),
      model: z.string().max(60),
      trim: z.string().max(60).optional(),
      annualFuelCost: z.number().nullable().optional(),
      mpg: z.number().nullable().optional(),
    })
    .nullable(),
  walk: z.object({
    view: z.enum(["door", "check", "stage"]),
    stage: z.number().int().min(1).max(STAGES),
    startedWith: z.enum(["payment", "price"]).nullable(),
    quotedPay: z.number().min(0).max(100_000),
    checkMonths: z.number().int().min(12).max(96),
    checkDown: z.number().min(0).max(10_000_000),
    rateEntered: z.boolean(),
  }),
});
type SessionData = z.infer<typeof Session>;

function snapshot(): SessionData | null {
  const d = useDeal.getState();
  // The untouched example is not the buyer's deal, so there is nothing to keep.
  if (d.example) return null;
  const w = useWalk.getState();
  return {
    v: 1,
    offers: d.offers,
    names: d.names,
    editing: d.editing,
    vehicle: d.vehicle,
    walk: { view: w.view, stage: w.stage, startedWith: w.startedWith, quotedPay: w.quotedPay, checkMonths: w.checkMonths, checkDown: w.checkDown, rateEntered: w.rateEntered },
  };
}

function write() {
  try {
    const s = snapshot();
    if (s) sessionStorage.setItem(KEY, JSON.stringify(s));
    else sessionStorage.removeItem(KEY);
  } catch {
    /* storage blocked: the calculator works, it just cannot keep the place */
  }
}

function restore(): boolean {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return false;
    const p = Session.safeParse(JSON.parse(raw));
    if (!p.success) return false;
    const s = p.data;
    useDeal.setState({ offers: s.offers, names: s.names, editing: s.editing, vehicle: s.vehicle ? { ...s.vehicle } : null, example: false, edited: false });
    useWalk.setState({ ...s.walk });
    return true;
  } catch {
    return false;
  }
}

const urlFor = (view: WalkView, stage: number) => (view === "stage" ? `/deal?step=${stage}` : view === "check" ? "/deal?step=payment" : "/deal");
const keyFor = (view: WalkView, stage: number) => `${view}:${stage}`;

/** Restores the place, then keeps it saved and keeps the Back button working. Returns what undoes it. */
export function startPersistence(): () => void {
  restore();

  const here = () => {
    const w = useWalk.getState();
    return { view: w.view, stage: w.stage };
  };

  // A shared link carries its deal in the hash, which the page reads next, so the address is left alone for it.
  const shared = location.hash.length > 7;
  if (!shared) {
    const { view, stage } = here();
    history.replaceState({ dd: keyFor(view, stage) }, "", urlFor(view, stage));
  }

  let applying = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stopWalk = useWalk.subscribe((s, prev) => {
    if (!applying && (s.view !== prev.view || s.stage !== prev.stage) && history.state?.dd !== keyFor(s.view, s.stage)) {
      history.pushState({ dd: keyFor(s.view, s.stage) }, "", urlFor(s.view, s.stage));
    }
    queue();
  });
  const stopDeal = useDeal.subscribe(queue);

  function queue() {
    clearTimeout(timer);
    timer = setTimeout(write, 250);
  }

  function onPop(e: PopStateEvent) {
    const [view, stage] = typeof e.state?.dd === "string" ? (e.state.dd as string).split(":") : ["door", "1"];
    if (view !== "door" && view !== "check" && view !== "stage") return;
    applying = true;
    useWalk.setState({ view, stage: Math.min(Math.max(Number(stage) || 1, 1), STAGES) });
    applying = false;
  }
  window.addEventListener("popstate", onPop);
  window.addEventListener("pagehide", write);

  return () => {
    stopWalk();
    stopDeal();
    clearTimeout(timer);
    window.removeEventListener("popstate", onPop);
    window.removeEventListener("pagehide", write);
  };
}
