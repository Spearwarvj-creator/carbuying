/**
 * Terms on tap. Each term has the plain words first, the word the paperwork uses second,
 * a two-sentence meaning, and one thing to ask. Definitions follow the FTC's "Financing or
 * Leasing a Car" page and the CFPB's auto loan pages. A statement about law or rights is
 * left out unless a primary source supports it.
 */
export interface Term {
  /** The word on the dealer's paperwork. */
  term: string;
  /** What it means in plain words, used as the card's heading. */
  plain: string;
  meaning: string;
  ask: string;
}

export const TERMS = {
  fourSquare: {
    term: "Four-square",
    plain: "The dealer's four-box worksheet",
    meaning:
      "Some dealers use a worksheet with four boxes: the price, your trade-in, your down payment, and the monthly payment. They can move one box against another, so it is hard to see what any single change costs.",
    ask: "Can we agree on the out-the-door price first, and talk about the payment after?",
  },
  outTheDoor: {
    term: "Out-the-door price",
    plain: "The full price to drive away",
    meaning:
      "The price of the car plus sales tax, fees, and any extras you accept, before your down payment and trade-in. The FTC says to get this number in writing before you talk about financing.",
    ask: "Can you put the out-the-door price in writing?",
  },
  docFee: {
    term: "Doc fee",
    plain: "A paperwork fee",
    meaning: "A fee the dealer charges for preparing the paperwork. It sits with the other fees on the worksheet, apart from the price.",
    ask: "Which of these fees are required, and which can I say no to?",
  },
  addOn: {
    term: "Add-on",
    plain: "An extra sold with the car",
    meaning:
      "A product bought and financed with the car, such as a service contract, GAP coverage or window etching. It is fine to ask what each one costs and to say no.",
    ask: "What does each extra cost over the whole loan, and can I leave it off?",
  },
  apr: {
    term: "APR",
    plain: "The yearly cost of the loan",
    meaning:
      "The yearly cost of borrowing, as a percentage. A lower APR means less interest. The rate a dealer offers can include an amount that pays the dealer for arranging the loan.",
    ask: "Is this rate final and approved by the lender, and what rate did the lender approve?",
  },
  loanTerm: {
    term: "Loan term",
    plain: "How many months you pay",
    meaning: "The number of months you take to repay. A longer term makes each payment smaller, and it raises the total interest you pay.",
    ask: "What would the total be at a shorter term?",
  },
  interest: {
    term: "Interest",
    plain: "What borrowing costs",
    meaning: "The cost of borrowing, added to the amount you borrow over the life of the loan. The finance charge on your contract is this amount.",
    ask: "How much interest do I pay over the whole loan?",
  },
  downPayment: {
    term: "Down payment",
    plain: "Cash you pay up front",
    meaning: "Money you pay at the start. It lowers the amount you borrow, so it lowers the interest too.",
    ask: "Is my down payment taken off the amount I borrow, or off something else?",
  },
  tradeIn: {
    term: "Trade-in allowance",
    plain: "What they give for your old car",
    meaning: "The credit the dealer gives you for your old car. It is the dealer's figure, so it is worth asking how they got it.",
    ask: "How did you arrive at this value for my car?",
  },
  payoff: {
    term: "Payoff amount",
    plain: "What you still owe on your old car",
    meaning: "The amount you still owe on the loan for your old car. It comes out of the trade-in allowance.",
    ask: "Can you show me the payoff figure you are using?",
  },
  negativeEquity: {
    term: "Negative equity",
    plain: "Owing more than the car is worth",
    meaning: "When the payoff is more than the trade-in allowance. The difference is added to your new loan, so you pay interest on it.",
    ask: "How much of my old loan is being added to this one?",
  },
  amountFinanced: {
    term: "Amount financed",
    plain: "The loan you borrow",
    meaning: "The part of the out-the-door price that you borrow, after your down payment and trade-in. Interest is charged on this amount.",
    ask: "What is the total amount financed, and what is in it?",
  },
} satisfies Record<string, Term>;

export type TermKey = keyof typeof TERMS;
