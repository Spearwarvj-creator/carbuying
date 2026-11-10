"use client";

import { Dialog } from "radix-ui";
import { useRef, useState, type ReactNode } from "react";
import { Btn } from "@/components/ui/Btn";
import { CameraIcon, CloseIcon, MicIcon } from "@/components/ui/icons";
import { Segmented } from "@/components/ui/Segmented";
import { ai } from "@/data/strings/ai";
import { walk } from "@/data/strings/walk";
import { applyToDesk, applyToWalk } from "@/lib/extract/apply";
import { FILL_FIELDS, fit, type Detected, type FillKey } from "@/lib/extract/fields";
import { parseSpoken } from "@/lib/extract/spoken";
import { useAiOn } from "@/lib/ai-status";
import { getLang } from "@/lib/i18n";
import { useListen } from "@/lib/listen";
import { setMode } from "@/lib/mode";
import { offerName, useDeal } from "@/store/deal";
import { ContractCheck } from "./ContractCheck";
import { VehicleCard } from "./VehicleCard";
import { lookupVin, type VehicleInfo } from "@/lib/vehicle";

const q = walk.quick;
const ph = ai.photo;
type Kind = keyof typeof ph.kinds;

/** Shrinks a photo before it leaves the phone: at most 1600 px on the long side, as a JPEG. This also drops the photo's location data. */
async function shrink(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  return c.toDataURL("image/jpeg", 0.82);
}

/**
 * Quick fill: say, type, paste or photograph the dealer's numbers and have them found, so the buyer does not
 * key them in one by one in the showroom. It only finds numbers. Every one is shown with where it came from
 * and can be changed or left out, and nothing reaches the calculator until the buyer taps "Use these numbers".
 * Photos can be a worksheet, a lender letter, the contract (compared line by line with the agreed deal) or the
 * car's VIN. The loan maths is still done by the calculator alone.
 */
export function QuickFill({ trigger, target }: { trigger: ReactNode; target: "walk" | "desk" }) {
  const offers = useDeal((s) => s.offers);
  const editing = useDeal((s) => s.editing);
  const names = useDeal((s) => s.names);
  const currentOffer = target === "walk" ? offers[0] : offers[editing];

  const aiOn = useAiOn();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"say" | "photo">("say");
  const [kind, setKind] = useState<Kind>("worksheet");
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [found, setFound] = useState<Detected | null>(null);
  const [contract, setContract] = useState<Detected | null>(null);
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
  const [slot, setSlot] = useState<0 | 1>(1);
  const [busy, setBusy] = useState(false);
  const base = useRef("");
  const file = useRef<HTMLInputElement>(null);
  const mic = useListen((phrase) => setText(`${base.current}${phrase}`));

  function reset() {
    setText("");
    setNote("");
    setFound(null);
    setContract(null);
    setVehicle(null);
    setBusy(false);
  }

  function listen() {
    if (!mic.listening) base.current = text ? `${text.trim()} ` : "";
    mic.toggle();
  }

  function findNumbers() {
    const d = parseSpoken(text, { price: currentOffer.price }, getLang());
    if (Object.keys(d).length === 0) return setNote(q.nothing);
    setNote("");
    setSlot(editing);
    setFound(d);
  }

  async function lookUp(vin: string) {
    const r = await lookupVin(vin);
    if ("error" in r) return setNote(r.error);
    setVehicle(r);
  }

  async function onPhotos(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setNote("");
    try {
      const images = await Promise.all(Array.from(files).slice(0, kind === "contract" ? 4 : 1).map(shrink));
      const res = await fetch("/api/extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, images }) });
      const data = (await res.json()) as { fields?: Detected; vin?: string; message?: string };
      if (!res.ok) return setNote(data.message ?? q.unavailable);
      if (kind === "vin") {
        if (!data.vin) return setNote(ph.vinNone);
        return await lookUp(data.vin);
      }
      const fields = data.fields ?? {};
      if (Object.keys(fields).length === 0) return setNote(q.nothing);
      if (kind === "contract") setContract(fields);
      else {
        setSlot(editing);
        setFound(fields);
      }
    } catch {
      setNote(q.unavailable);
    } finally {
      setBusy(false);
      if (file.current) file.current.value = "";
    }
  }

  function edit(key: FillKey, raw: string) {
    setFound((d) => {
      if (!d) return d;
      const v = fit(key, raw);
      return v === null ? d : { ...d, [key]: { ...d[key]!, value: v } };
    });
  }

  function drop(key: FillKey) {
    setFound((d) => {
      if (!d) return d;
      const { [key]: _gone, ...rest } = d;
      void _gone;
      return Object.keys(rest).length ? rest : null;
    });
  }

  function use() {
    if (!found) return;
    if (target === "walk") applyToWalk(found);
    else {
      applyToDesk(found, slot);
      setMode("desk");
    }
    setOpen(false);
    reset();
  }

  const showingResult = Boolean(found || contract || vehicle);
  const heading = found ? q.reviewTitle : contract ? ai.contract.title : vehicle ? ai.finder.title : q.title;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="qf" aria-describedby={undefined}>
          <div className="sheet-head">
            <Dialog.Title className="sheet-title">{heading}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={q.close}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>

          {!showingResult && (
            <>
              <Segmented
                variant="chips"
                label={q.title}
                value={tab}
                onChange={(v) => {
                  setTab(v);
                  setNote("");
                }}
                options={[
                  { value: "say", label: q.tabs.say, icon: <MicIcon size={20} /> },
                  ...(aiOn ? [{ value: "photo" as const, label: q.tabs.photo, icon: <CameraIcon size={20} /> }] : []),
                ]}
              />
              {tab === "say" ? (
                <div className="qf-body">
                  <label htmlFor="qf-text" className="qf-label">
                    {q.sayLabel}
                  </label>
                  <textarea id="qf-text" className="qf-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} aria-describedby="qf-hint" />
                  <p id="qf-hint" className="hint">
                    {q.sayHint}
                  </p>
                  <div className="qf-row">
                    {mic.supported && (
                      <Btn variant="ghost" icon={<MicIcon size={20} />} onClick={listen} aria-pressed={mic.listening}>
                        {mic.listening ? q.stop : q.listen}
                      </Btn>
                    )}
                    <Btn variant="primary" onClick={findNumbers} aria-disabled={!text.trim()}>
                      {q.find}
                    </Btn>
                  </div>
                  {mic.listening && (
                    <p className="hint" role="status">
                      {q.listening}
                    </p>
                  )}
                  {mic.error && (
                    <p className="qf-note" role="status">
                      {mic.error === "denied" ? q.micDenied : q.noListen}
                    </p>
                  )}
                </div>
              ) : (
                <div className="qf-body">
                  <Segmented
                    variant="chips"
                    label={ph.pick}
                    value={kind}
                    onChange={(v) => {
                      setKind(v);
                      setNote("");
                    }}
                    options={(Object.keys(ph.kinds) as Kind[]).map((k) => ({ value: k, label: ph.kinds[k] }))}
                  />
                  <p className="qf-label">{ph.hint[kind]}</p>
                  <input
                    ref={file}
                    type="file"
                    accept="image/*"
                    capture={kind === "contract" ? undefined : "environment"}
                    multiple={kind === "contract"}
                    className="sr-only"
                    id="qf-file"
                    onChange={(e) => void onPhotos(e.target.files)}
                  />
                  <Btn variant="primary" icon={<CameraIcon size={20} />} onClick={() => file.current?.click()} aria-disabled={busy}>
                    {busy ? ph.reading : kind === "contract" ? ph.pickMore : ph.pick}
                  </Btn>
                  <p className="hint">{ph.privacy}</p>
                </div>
              )}
              {note && (
                <p className="qf-note" role="status">
                  {note}
                </p>
              )}
            </>
          )}

          {found && (
            <div className="qf-body">
              <p className="hint">{q.reviewHint}</p>
              {target === "desk" && (
                <>
                  <Segmented
                    variant="chips"
                    label={ai.offerFor}
                    value={slot}
                    onChange={setSlot}
                    options={[
                      { value: 0, label: `${ai.offerFor} ${offerName(names, 0)}` },
                      { value: 1, label: `${ai.offerFor} ${offerName(names, 1)}` },
                    ]}
                  />
                  <p className="hint">{ai.mergeNote}</p>
                </>
              )}
              <ul className="qf-list">
                {FILL_FIELDS.filter((f) => found[f.key]).map((f) => {
                  const item = found[f.key]!;
                  return (
                    <li key={f.key}>
                      <label htmlFor={`qf-${f.key}`}>{ai.fieldLabels[f.key]}</label>
                      <div className="qf-val">
                        {f.unit === "$" && <span className="aff">$</span>}
                        <input id={`qf-${f.key}`} className="num" inputMode="decimal" defaultValue={item.value} onBlur={(e) => edit(f.key, e.target.value)} aria-describedby={`qf-${f.key}-from`} />
                        {f.unit === "%" && <span className="aff">%</span>}
                        {f.unit === "months" && <span className="aff">{q.monthsShort}</span>}
                      </div>
                      <button type="button" className="icon-btn" onClick={() => drop(f.key)} aria-label={`${q.remove}: ${ai.fieldLabels[f.key]}`}>
                        <CloseIcon size={18} />
                      </button>
                      <span id={`qf-${f.key}-from`} className="qf-from">
                        {q.heard}: “{item.from}”
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="qf-row">
                <Btn variant="ghost" onClick={() => setFound(null)}>
                  {q.again}
                </Btn>
                <Btn variant="primary" arrow onClick={use}>
                  {q.use}
                </Btn>
              </div>
            </div>
          )}

          {contract && (
            <>
              <ContractCheck found={contract} offer={currentOffer} />
              <Btn variant="ghost" onClick={() => setContract(null)}>
                {q.again}
              </Btn>
            </>
          )}

          {vehicle && (
            <>
              <VehicleCard info={vehicle} />
              <Btn variant="ghost" onClick={() => setVehicle(null)}>
                {q.again}
              </Btn>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
