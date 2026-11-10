"use client";

import { ai } from "@/data/strings/ai";
import type { VehicleInfo } from "@/lib/vehicle";

const v = ai.finder;
const stars = (r: string | null) => (r && /^\d$/.test(r) ? `${r} of 5` : "Not rated");
const dollars = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** What is known about one car, with where each part comes from and what to ask because of it. */
export function VehicleCard({ info }: { info: VehicleInfo }) {
  const { ratings, recalls, mpg } = info;
  const rated = ratings?.rated;
  return (
    <div className="vcard">
      <p className="qf-vehicle">
        <b>
          {info.year} {info.make} {info.model}
        </b>
        {info.trim && <span> {info.trim}</span>}
      </p>
      {info.vin && <p className="hint">VIN {info.vin}</p>}

      <h3>{v.safety}</h3>
      {rated ? (
        <dl className="vcard-grid">
          <div>
            <dt>{v.overall}</dt>
            <dd className="num">{stars(ratings!.overall)}</dd>
          </div>
          <div>
            <dt>{v.front}</dt>
            <dd className="num">{stars(ratings!.frontCrash)}</dd>
          </div>
          <div>
            <dt>{v.side}</dt>
            <dd className="num">{stars(ratings!.sideCrash)}</dd>
          </div>
          <div>
            <dt>{v.rollover}</dt>
            <dd className="num">{stars(ratings!.rollover)}</dd>
          </div>
        </dl>
      ) : (
        <p className="hint">{ratings ? v.notRated : v.unavailable}</p>
      )}
      <p className="hint">{v.safetySource}</p>

      <h3>{v.recalls}</h3>
      {recalls ? (
        <>
          <p>{ai.vehicle.recalls(recalls.count)}</p>
          {recalls.recalls.slice(0, 3).map((r) => (
            <details key={r.campaign}>
              <summary>
                {r.component.toLowerCase()} ({r.campaign})
              </summary>
              <p className="hint">{r.summary}</p>
            </details>
          ))}
          <p className="hint">
            {v.recallSource} <a href={recalls.checkUrl}>nhtsa.gov/recalls</a>
          </p>
        </>
      ) : (
        <p className="hint">{v.unavailable}</p>
      )}

      <h3>{v.fuel}</h3>
      {mpg?.found && mpg.combined ? (
        <>
          <p>
            <b className="num">{mpg.combined}</b> mpg combined
            {mpg.city && mpg.highway ? (
              <span>
                {" "}
                ({mpg.city} city, {mpg.highway} highway)
              </span>
            ) : null}
            {mpg.annualFuelCost ? (
              <span>
                . About <b className="num">{dollars(mpg.annualFuelCost)}</b> a year in fuel, or <b className="num">{dollars(mpg.annualFuelCost / 12)}</b> a month.
              </span>
            ) : null}
          </p>
          <p className="hint">{v.fuelSource}</p>
        </>
      ) : (
        <p className="hint">{mpg ? v.noFuel : v.unavailable}</p>
      )}

      <h3>{v.ask}</h3>
      <ul className="vcard-ask">
        {v.questions.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <p className="hint">{v.noPrice}</p>
    </div>
  );
}
