/**
 * General state sales tax rates, in percent, used only to SUGGEST a starting point once a ZIP code is
 * known. They are the state's own base rate and are approximate: a city or county can add to them, and
 * some states tax vehicles at a different rate or with a separate fee. The buyer always confirms the rate
 * from their worksheet, and the page says so. Rates here should be rechecked each year.
 * Rechecked 9 November 2026 against the Tax Foundation's "State and Local Sales Tax Rates, Midyear 2026" (rates as of
 * 1 July 2026). Every state and DC matches its general state rate, allowing for rounding (MN 6.875, MO 4.225, NJ 6.625,
 * NM 4.875), with one exception kept on purpose: VA is 4.15, which is believed to be Virginia's separate motor vehicle
 * sales and use tax rate, where the general table shows 5.30 (4.3 state plus 1 regional). That reading is not confirmed
 * against Virginia's DMV, so it is the first line to check. CA includes the statewide 1.25 local add-on, as the source does.
 * Several other states tax vehicles at their own rate or with a separate fee, so the buyer's worksheet always wins.
 */
export const STATE_SALES_TAX: Record<string, number> = {
  AL: 4, AK: 0, AZ: 5.6, AR: 6.5, CA: 7.25, CO: 2.9, CT: 6.35, DE: 0, DC: 6, FL: 6, GA: 4, HI: 4, ID: 6, IL: 6.25,
  IN: 7, IA: 6, KS: 6.5, KY: 6, LA: 5, ME: 5.5, MD: 6, MA: 6.25, MI: 6, MN: 6.875, MS: 7, MO: 4.225, MT: 0, NE: 5.5,
  NV: 6.85, NH: 0, NJ: 6.625, NM: 4.875, NY: 4, NC: 4.75, ND: 5, OH: 5.75, OK: 4.5, OR: 0, PA: 6, RI: 7, SC: 6,
  SD: 4.2, TN: 7, TX: 6.25, UT: 6.1, VT: 6, VA: 4.15, WA: 6.5, WV: 6, WI: 5, WY: 4,
};
