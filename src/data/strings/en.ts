/**
 * Every word the buyer reads lives here, so Spanish can be added in version 1.1
 * after a native reviewer signs it off. Plain words, sentence case, active voice.
 */
export const en = {
  appName: "Deal Desk",
  exampleTag: "Example deal",
  exampleEditedTag: "Example deal, changed",
  yourDealTag: "Your deal",
  largerText: "Larger text",
  deskHeading: "The Desk: your deal, side by side",
  lightScreen: "Light",
  darkScreen: "Dark",

  result: {
    totalLabel: "You would pay in total",
    monthly: "Monthly payment",
    total: "Total over the loan",
    less: "less",
    more: "more",
    aMonth: " a month",
    inTotal: " in total",
    empty: "Enter the price from the dealer's worksheet to start.",
    emptyOne: "Offer 1 is filled in. Enter the price on Offer 2 to see what changed.",
    divergent: (pay: string, total: string) => `The monthly payment went down by ${pay}, but you pay ${total} more in total.`,
    divergentShort: (pay: string, total: string) => `Payment down ${pay}. Total up ${total}.`,
    divergentShortUp: (pay: string, total: string) => `Payment up ${pay}. Total down ${total}.`,
    divergentUp: (pay: string, total: string) => `The monthly payment went up by ${pay}, and you pay ${total} less in total.`,
    changeInTotal: "Change in total",
    noChange: "No change",
    movedHeading: (name: string) => `Where the money moved since ${name}`,
    nothingMoved: "Nothing changed between the two offers.",
    other: "Other changes",
  },

  trailSteps: {
    price: "Price",
    fees: "Fees",
    addons: "Add-ons",
    trade: "Trade-in",
    rebate: "Rebates",
    loan: "Bigger loan",
    rate: "Interest rate",
    term: "Months",
  },

  editing: "Editing",
  offer1: "Offer 1",
  offer2: "Offer 2",

  boxes: {
    price: {
      label: "Price",
      title: "What price did the dealer say?",
      help: "On the worksheet, look for Selling price or Vehicle price.",
    },
    fees: {
      label: "Fees, add-ons",
      title: "What are the fees and add-ons?",
      help: "Look for the doc fee, then lines like warranty or coating.",
    },
    down: {
      label: "Trade, down",
      title: "How much are you putting in?",
      help: "Cash down, plus what the dealer gives for your trade.",
    },
    loan: {
      label: "Loan",
      title: "What are the rate and months?",
      help: "The rate is the APR on the finance sheet.",
    },
  },

  fields: {
    price: "Price",
    taxRate: "Sales tax",
    fees: "Fees",
    addons: "Add-ons",
    down: "Down payment",
    tradeAllowance: "Trade-in value",
    tradePayoff: "Trade-in payoff",
    rebate: "Rebates",
    apr: "Rate (APR)",
    months: "Months",
  },

  sheet: {
    done: "Done",
    clear: "Clear",
    back: "Back",
    fewer: "Fewer months",
    moreMonths: "More months",
    months: "months",
    point: "Decimal point",
    zeros: "Three zeros",
  },

  sections: "Sections",
  tabs: { deal: "Deal", compare: "Compare", target: "Target", ask: "Ask", checks: "Checks" },

  useMine: "Use my numbers",
  seeExample: "See the example",

  compare: {
    heading: "Offer 1 and Offer 2",
    on: "Compare on",
    measure: "Measure",
    metrics: { total: "Total paid", pay: "Monthly", otd: "Out the door" },
    rows: { pay: "Monthly payment", months: "Months", otd: "Out-the-door price", total: "Total paid" },
    lower: "Lower",
    same: "Same",
    winnersDiffer: (payWinner: string, totalWinner: string, amount: string) =>
      `${payWinner} is lower on the monthly payment. ${totalWinner} is lower on total paid, by ${amount}.`,
    sameWinner: (winner: string) => `${winner} is lower on every measure.`,
  },

  target: {
    heading: "What it would take",
    intro: (loser: string, measure: string) => `For ${loser} to match on ${measure}, ask for any one of these:`,
    cantMatch: "Cannot match with this change alone.",
    tie: "The two offers are equal on this measure.",
    levers: {
      price: "Lower the price",
      fees: "Lower the fees",
      addons: "Remove the add-ons",
      rate: "Lower the rate",
      trade: "Raise the trade-in value",
    },
    lines: {
      price: (amount: string, to: string) => `Take ${amount} off the price, to ${to}.`,
      fees: (amount: string, to: string) => `Take ${amount} off the fees, to ${to}.`,
      addons: (amount: string) => `Remove the ${amount} of add-ons.`,
      rate: (points: string, to: string) => `Lower the rate by ${points} points, to ${to}.`,
      trade: (amount: string, to: string) => `Raise the trade-in value by ${amount}, to ${to}.`,
    },
    percentOf: (pct: string, item: string) => `${pct} of the ${item}`,
    paymentNote: "A longer loan lowers the payment but raises the total you pay.",
    measure: { total: "total paid", pay: "monthly payment", otd: "out-the-door price" },
  },

  ask: {
    heading: "What to say",
    copy: "Copy this",
    copied: "Copied",
    nothing: "Both offers are equal, so there is nothing to ask for.",
    opening: (loser: string, amount: string, measure: string) =>
      `Hello, I am comparing two offers. ${loser} is ${amount} higher on ${measure}.`,
    request: (winner: string) => `To match ${winner}, could you do any one of these?`,
    fallback: "No single change is enough on its own. Could we look at the price, fees and rate together?",
    thanks: "Thank you.",
  },

  note: "Estimates from the numbers you entered. Not financial or legal advice.",
} as const;

export type Strings = typeof en;
