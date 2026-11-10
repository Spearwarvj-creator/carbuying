/**
 * The wording of the deal checks (engine/flags.ts) and of the plain summary read aloud. The rules and thresholds stay in
 * the engine; only the sentences are here, so they can be translated. Figures arrive already formatted.
 */
export const flagText = {
  longTerm: {
    title: (months: number) => `${months} months is a long loan`,
    body: (lower: string, extra: string) => `Compared with 60 months, the payment is about ${lower} lower, but you pay about ${extra} more in total.`,
    ask: "Can you show me the payment and the total for 60 months as well?",
    source: "Experian, State of the Automotive Finance Market (2026): nearly one third of loans run longer than six years.",
  },
  highFees: {
    title: "The fees are on the high side",
    body: (fees: string) => `Fees are ${fees}. Dealer document fees often run a few hundred dollars, and some states cap them.`,
    ask: "Can you list each fee and what it is for?",
    source: "Consumer guides and state rules differ; check your state's attorney general or motor vehicle site.",
  },
  extras: {
    title: "There are extras in this deal",
    body: (addons: string, real: string, eq: string) => `The extras cost ${addons}, and about ${real} once tax and interest are counted. That is about ${eq} of your monthly payments.`,
    ask: "If I did not ask for an extra, can you take it off? Which ones can I cancel later?",
    source: "CFPB and Consumer Reports: you do not have to pay for an add-on you did not ask for.",
  },
  packing: {
    title: "The payment does not match the numbers",
    body: (pay: string, quoted: string, gap: string, less: boolean) =>
      `With these numbers the payment comes to ${pay} a month, and the dealer said ${quoted}. That is ${gap} ${less ? "less" : "more"} than the numbers give.`,
    ask: "What is in the monthly payment? Can you show it line by line?",
    source: "FTC: payment packing hides add-ons inside a monthly figure.",
  },
  underwater: {
    title: "You owe more than the trade is worth",
    body: (gap: string) => `The gap is ${gap}. It is added to the new loan, and you pay interest on it.`,
    ask: "How much of the new loan is the old loan I still owe?",
    source: "FTC, Financing or Leasing a Car: negative equity is rolled into the new loan.",
  },
  rate: {
    title: (apr: number) => `${apr}% is a higher rate`,
    body: "Rates depend on your credit and the lender. A dealer can add to the rate a lender offers, and the extra interest goes to the dealer.",
    ask: "What rate did the lender approve me for, and is any of this rate added by the dealership?",
    source: "CFPB and the Center for Responsible Lending: dealer rate markups.",
  },
  noTax: {
    title: "No sales tax is counted",
    body: "The tax rate is zero, so the out-the-door price here has no sales tax in it. Most states charge it on a car.",
    ask: "What is the sales tax in dollars on this deal?",
    source: "Enter the tax from the worksheet.",
  },
  interestShare: {
    title: "A large share is interest",
    body: (share: number) => `About ${share} of every 100 dollars you pay goes to interest.`,
    ask: "What would the interest be on a shorter loan or a bigger down payment?",
    source: "Calculated from the numbers on this page.",
  },
} as const;

/** The deal as plain sentences. Each part is added only when it applies. */
export const summaryText = {
  price: (v: string) => `Selling price ${v}.`,
  fees: (v: string) => `Fees ${v}.`,
  extras: (v: string) => `Extras ${v}.`,
  taxRate: (v: string) => `Sales tax rate ${v}%.`,
  otd: (v: string) => `Out-the-door price ${v}.`,
  down: (v: string) => `Down payment ${v}.`,
  financed: (v: string) => `Amount financed ${v}.`,
  rate: (apr: number, months: number) => `Rate ${apr}% for ${months} months.`,
  pay: (v: string) => `Monthly payment ${v}.`,
  total: (total: string, interest: string) => `Total paid ${total}, of which interest ${interest}.`,
  quoted: (v: string) => `The dealer quoted ${v} a month.`,
} as const;
