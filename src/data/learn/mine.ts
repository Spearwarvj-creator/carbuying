/**
 * "In your deal": one sentence for a term, written with the buyer's own figures. The figures come from the calculator
 * and are passed in already formatted, so these are only words. A term with nothing to say about this deal returns null.
 */
export interface MineVals {
  price: string;
  otd: string;
  rest: string;
  fees: string;
  tax: string;
  rate: string;
  apr: number;
  months: number;
  interest: string;
  share: number;
  financed: string;
  pay: string;
  perDay: string;
  down: string;
  addons: string;
  addonsReal: string;
  allowance: string;
  payoff: string;
  gap: string;
  rebate: string;
  /** What a 60 month loan would change in the total, when the loan is not already 60. */
  alt: { months: number; pay: string; diff: string; more: boolean } | null;
  raw: { fees: number; addons: number; down: number; allowance: number; payoff: number; rebate: number; equity: number };
}

type Mine = Record<string, (v: MineVals) => string | null>;

export const MINE_EN: Mine = {
  "finance-charge": (v) => `The interest in your deal is about ${v.interest}. The loan box on the contract can show a little more if it counts other charges.`,
  principal: (v) => `Your loan would start with ${v.financed} of principal.`,
  "selling-price": (v) => `The selling price in your deal is ${v.price}.`,
  otd: (v) => `Your out-the-door price is ${v.otd}: ${v.price} for the car, and ${v.rest} for tax, fees and extras.`,
  "doc-fee": (v) => (v.raw.fees > 0 ? `The fees in your deal add up to ${v.fees}.` : null),
  "sales-tax": (v) => `Your sales tax is ${v.tax}, at a rate of ${v.rate}.`,
  apr: (v) => `Your APR is ${v.apr}%. Over ${v.months} months that is about ${v.interest} in interest.`,
  interest: (v) => `You would pay about ${v.interest} in interest. That is ${v.share} of every 100 dollars you pay.`,
  "amount-financed": (v) => `You would borrow ${v.financed}.`,
  "loan-term": (v) =>
    v.alt
      ? `Your loan is ${v.months} months. At ${v.alt.months} months the payment would be about ${v.alt.pay}, and you would pay about ${v.alt.diff} ${v.alt.more ? "more" : "less"} in total.`
      : `Your loan is ${v.months} months.`,
  "monthly-payment": (v) => `Your monthly payment is ${v.pay}. That is about ${v.perDay} a day.`,
  "down-payment": (v) => (v.raw.down > 0 ? `You are putting ${v.down} down.` : "You are putting nothing down in this deal."),
  "add-ons": (v) => (v.raw.addons > 0 ? `The extras in your deal cost ${v.addons}, and about ${v.addonsReal} once tax and interest are counted.` : "There are no extras in your deal."),
  "trade-in": (v) => (v.raw.allowance > 0 || v.raw.payoff > 0 ? `Your trade is worth ${v.allowance} in this deal, and you still owe ${v.payoff}.` : null),
  payoff: (v) => (v.raw.payoff > 0 ? `You told us you still owe ${v.payoff} on your old car.` : null),
  "negative-equity": (v) => (v.raw.equity < 0 ? `You owe ${v.gap} more than your trade is worth. That is added to your new loan.` : "You do not owe more than your trade is worth in this deal."),
  equity: (v) => (v.raw.equity > 0 ? `Your trade is worth ${v.gap} more than you owe, so it lowers your loan.` : null),
  rebate: (v) => (v.raw.rebate > 0 ? `Your deal has ${v.rebate} in rebates.` : null),
};

export const MINE_ES: Mine = {
  "finance-charge": (v) => `El interés de su trato es de unos ${v.interest}. El cuadro del préstamo en el contrato puede mostrar un poco más si cuenta otros cargos.`,
  principal: (v) => `Su préstamo empezaría con ${v.financed} de capital.`,
  "selling-price": (v) => `El precio de venta en su trato es ${v.price}.`,
  otd: (v) => `Su precio final a pagar es ${v.otd}: ${v.price} por el auto, y ${v.rest} en impuestos, cargos y extras.`,
  "doc-fee": (v) => (v.raw.fees > 0 ? `Los cargos de su trato suman ${v.fees}.` : null),
  "sales-tax": (v) => `Su impuesto sobre la venta es ${v.tax}, a una tasa de ${v.rate}.`,
  apr: (v) => `Su APR es ${v.apr}%. En ${v.months} meses son unos ${v.interest} de interés.`,
  interest: (v) => `Pagaría unos ${v.interest} de interés. Son ${v.share} de cada 100 dólares que paga.`,
  "amount-financed": (v) => `Pediría prestados ${v.financed}.`,
  "loan-term": (v) =>
    v.alt
      ? `Su préstamo es de ${v.months} meses. A ${v.alt.months} meses el pago sería de unos ${v.alt.pay}, y pagaría unos ${v.alt.diff} ${v.alt.more ? "más" : "menos"} en total.`
      : `Su préstamo es de ${v.months} meses.`,
  "monthly-payment": (v) => `Su pago mensual es ${v.pay}. Son unos ${v.perDay} al día.`,
  "down-payment": (v) => (v.raw.down > 0 ? `Está dando ${v.down} de enganche.` : "No está dando enganche en este trato."),
  "add-ons": (v) => (v.raw.addons > 0 ? `Los extras de su trato cuestan ${v.addons}, y unos ${v.addonsReal} al contar impuesto e interés.` : "No hay extras en su trato."),
  "trade-in": (v) => (v.raw.allowance > 0 || v.raw.payoff > 0 ? `Su auto de intercambio vale ${v.allowance} en este trato, y todavía debe ${v.payoff}.` : null),
  payoff: (v) => (v.raw.payoff > 0 ? `Nos dijo que todavía debe ${v.payoff} de su auto viejo.` : null),
  "negative-equity": (v) => (v.raw.equity < 0 ? `Debe ${v.gap} más de lo que vale su auto de intercambio. Eso se suma a su préstamo nuevo.` : "En este trato no debe más de lo que vale su auto de intercambio."),
  equity: (v) => (v.raw.equity > 0 ? `Su auto de intercambio vale ${v.gap} más de lo que debe, así que baja su préstamo.` : null),
  rebate: (v) => (v.raw.rebate > 0 ? `Su trato tiene ${v.rebate} en reembolsos.` : null),
};
