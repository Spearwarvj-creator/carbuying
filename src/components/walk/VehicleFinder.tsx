"use client";

import { Dialog } from "radix-ui";
import { useState, type ReactNode } from "react";
import { Btn } from "@/components/ui/Btn";
import { CloseIcon } from "@/components/ui/icons";
import { Segmented } from "@/components/ui/Segmented";
import { ai } from "@/data/strings/ai";
import { checkVin, normalizeVin } from "@/engine";
import { infoFor, listMakes, listModels, lookupVin, type VehicleInfo } from "@/lib/vehicle";
import { useDeal } from "@/store/deal";
import { VehicleCard } from "./VehicleCard";

const f = ai.finder;
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR + 1 - 1995 + 1 }, (_, i) => THIS_YEAR + 1 - i);

/** What is wrong with a VIN as typed, in plain words, before any lookup. Empty when nothing is wrong yet. */
export function vinProblem(input: string): string {
  const v = normalizeVin(input);
  if (v.length === 0) return "";
  if (/[IOQ]/.test(v)) return f.vinChecks.characters;
  if (v.length < 17) return `${f.vinChecks.length} ${17 - v.length} to go.`;
  if (v.length > 17) return f.vinChecks.length;
  return checkVin(v).checkDigitOk ? "" : f.vinChecks.digit;
}

/**
 * Look up a car by VIN or by year, make and model, for a buyer who has no quote yet or wants to know the car.
 * It shows crash ratings, recalls and fuel cost from the public vehicle services, with where each comes from.
 * "Use this car" keeps the car with the deal. None of it sets a price: no free source gives one reliably.
 */
export function VehicleFinder({ trigger }: { trigger: ReactNode }) {
  const setVehicle = useDeal((s) => s.setVehicle);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"vin" | "pick">("vin");
  const [vin, setVin] = useState("");
  const [year, setYear] = useState(0);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [info, setInfo] = useState<VehicleInfo | null>(null);
  const [saved, setSaved] = useState(false);

  function reset() {
    setVin("");
    setYear(0);
    setMake("");
    setModel("");
    setMakes([]);
    setModels([]);
    setNote("");
    setInfo(null);
    setSaved(false);
  }

  async function pickYear(y: number) {
    setYear(y);
    setMake("");
    setModel("");
    setModels([]);
    setMakes(y ? await listMakes(y) : []);
  }

  async function pickMake(m: string) {
    setMake(m);
    setModel("");
    setModels(m && year ? await listModels(year, m) : []);
  }

  async function search() {
    setBusy(true);
    setNote("");
    setSaved(false);
    try {
      if (tab === "vin") {
        const r = await lookupVin(normalizeVin(vin));
        if ("error" in r) setNote(r.error);
        else setInfo(r);
      } else if (year && make && model) {
        setInfo(await infoFor(year, make, model));
      }
    } finally {
      setBusy(false);
    }
  }

  const ready = tab === "vin" ? normalizeVin(vin).length === 17 : Boolean(year && make && model);

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
            <Dialog.Title className="sheet-title">{f.title}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={ai.ask.close}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>

          {!info && (
            <>
              <Segmented variant="chips" label={f.title} value={tab} onChange={(v) => { setTab(v); setNote(""); }} options={[{ value: "vin", label: f.tabs.vin }, { value: "pick", label: f.tabs.pick }]} />
              {tab === "vin" ? (
                <div className="qf-body">
                  <label htmlFor="vf-vin" className="qf-label">
                    {f.vinLabel}
                  </label>
                  <input
                    id="vf-vin"
                    className="vf-input"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase().slice(0, 20))}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    aria-describedby="vf-vin-h"
                  />
                  <p id="vf-vin-h" className="hint" role="status">
                    {vinProblem(vin) || f.vinHint}
                  </p>
                </div>
              ) : (
                <div className="qf-body">
                  <label className="vf-field">
                    <span>{f.year}</span>
                    <select value={year} onChange={(e) => void pickYear(Number(e.target.value))}>
                      <option value={0}>{f.choose}</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="vf-field">
                    <span>{f.make}</span>
                    <select value={make} onChange={(e) => void pickMake(e.target.value)} disabled={makes.length === 0}>
                      <option value="">{f.choose}</option>
                      {makes.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="vf-field">
                    <span>{f.model}</span>
                    <select value={model} onChange={(e) => setModel(e.target.value)} disabled={models.length === 0}>
                      <option value="">{f.choose}</option>
                      {models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
              <Btn variant="primary" onClick={() => void search()} aria-disabled={!ready || busy}>
                {busy ? f.working : f.lookup}
              </Btn>
              {note && (
                <p className="qf-note" role="status">
                  {note}
                </p>
              )}
            </>
          )}

          {info && (
            <>
              <VehicleCard info={info} />
              <div className="qf-row">
                <Btn variant="ghost" onClick={() => { setInfo(null); setSaved(false); }}>
                  {f.another}
                </Btn>
                <Btn
                  variant="primary"
                  aria-disabled={saved}
                  onClick={() => {
                    setVehicle({ year: info.year, make: info.make, model: info.model, trim: info.trim, annualFuelCost: info.mpg?.annualFuelCost ?? null, mpg: info.mpg?.combined ?? null });
                    setSaved(true);
                  }}
                >
                  {saved ? f.used : f.use}
                </Btn>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
