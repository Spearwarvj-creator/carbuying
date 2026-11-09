/**
 * Words on the site pages (landing, how it works, about). Legal pages are written
 * as documents in their own files. Plain words, sentence case, active voice.
 * Figures are passed in from the engine, never typed here.
 */
export const site = {
  name: "Deal Desk",
  nav: {
    how: "How it works",
    about: "About",
    open: "Open the calculator",
    openShort: "Calculator",
    skip: "Skip to the content",
    main: "Main",
    footer: "Site",
  },

  home: {
    title: "Deal Desk: know what each change costs you",
    description:
      "Enter what the car dealer says. Deal Desk shows in dollars where the money moved between two offers, and what to ask for next.",
    h1: "A lower monthly payment can still cost you more.",
    lead: "Deal Desk takes the numbers from the dealer's worksheet. It shows, in dollars, where the money moved between two offers, and what to ask for next.",
    primary: "Open the calculator",
    secondary: "See how it works",
    note: "No account. Your numbers stay on your device.",

    readout: {
      label: "Example: the same car, two offers",
      offer1: "Offer 1",
      offer2: "Offer 2",
      base: "The starting point",
      moved: "Where the money moved",
      months: (n: number) => `${n} months`,
      monthly: "Monthly payment",
      total: "You would pay in total",
      pay: (amount: string) => `${amount} less a month`,
      payUp: (amount: string) => `${amount} more a month`,
      tot: (amount: string) => `${amount} more in total`,
      totDown: (amount: string) => `${amount} less in total`,
    },

    story: {
      h2: "Where the extra money went",
      p1: (months1: number, months2: number, addons: string, pay: string, total: string) =>
        `In the example, the dealer stretched the loan from ${months1} to ${months2} months and added ${addons} of add-ons. The monthly payment fell by ${pay}. Over the whole loan, you pay ${total} more.`,
      p2: "Most people compare the monthly number. The total over the loan is the price you actually pay, so Deal Desk puts it first.",
      caption: "The two offers in the example, line by line",
      colItem: "Item",
      colChange: "Change",
      rows: {
        price: "Price",
        fees: "Fees",
        addons: "Add-ons",
        tax: "Sales tax",
        otd: "Out-the-door price",
        down: "Down payment",
        apr: "Rate (APR)",
        months: "Months",
        pay: "Monthly payment",
        total: "Total paid",
      },
      same: "Same",
    },

    steps: {
      h2: "Four steps at the desk",
      items: [
        {
          title: "Type what the dealer says",
          body: "Price, fees and add-ons, trade-in and down payment, rate and months. Four boxes and one keypad, so a number takes a few taps.",
        },
        {
          title: "See where the money moved",
          body: "Enter the second offer. The change in total is split into price, fees, add-ons, trade-in, a bigger loan, the rate and the months. The pieces add up to the cent.",
        },
        {
          title: "Find what it would take",
          body: "Choose total paid, monthly payment or out-the-door price. For the offer that costs more, Deal Desk finds the exact change that would match the other one.",
        },
        {
          title: "Say it out loud",
          body: "Copy a ready sentence that holds the numbers. Read it to the dealer, or send it to them.",
        },
      ],
    },

    take: {
      h2: "Then ask for one change",
      p1: (offer: string, total: string, other: string) =>
        `To bring ${offer} down to the ${total} total of ${other}, Deal Desk works out the size of each change. Ask for any one of these:`,
      none: "Fees alone, or add-ons alone, cannot close the gap here. Deal Desk says so instead of guessing.",
      p2: "Each line comes from the same calculator that makes the totals, so you can check it on your own worksheet.",
    },

    scope: {
      h2: "What it does, and what it leaves to you",
      doesH: "What it does",
      does: [
        "Adds up price, tax, fees, add-ons, trade-in and the loan the same way every time.",
        "Shows the change in total, and where each dollar of it came from.",
        "Finds the change that would match a better offer.",
        "Writes the sentence for you to say.",
      ],
      leavesH: "What it leaves to you",
      leaves: [
        "Deciding what a fair price is. Version 1 has no market prices.",
        "Knowing your state's tax rate and fee limits. You enter the tax from your own worksheet.",
        "Leases. Version 1 covers loans only.",
        "Financial or legal advice. These are estimates from the numbers you enter.",
      ],
      privacy: "The calculator runs on your device and sends nothing.",
      privacyLink: "Read the privacy page",
    },

    close: {
      h2: "Bring the worksheet. Leave knowing what to ask.",
      cta: "Open the calculator",
    },
  },

  how: {
    title: "How Deal Desk works",
    description:
      "The four boxes, the money trail, the three ways to compare two offers, and the words a car dealer uses, in plain language.",
    h1: "How Deal Desk works",
    lead: "Every number comes from one calculator. Here is what it asks for, what it shows, and what the words mean.",
    contents: "On this page",
    sections: {
      boxes: "The four boxes",
      trail: "The money trail",
      compare: "Three ways to compare",
      take: "What it would take",
      words: "Words you will hear",
    },
    boxes: {
      intro: "A deal has four parts. Each part is one box, and each box opens one keypad.",
      items: [
        { k: "Price", v: "The selling price, and your sales tax rate. Both are on the worksheet." },
        { k: "Fees, add-ons", v: "The doc fee and other fees, then extras such as a warranty or a coating." },
        { k: "Trade, down", v: "Cash you put down, what the dealer gives for your old car, and what you still owe on it." },
        { k: "Loan", v: "The rate (APR) from the finance sheet, and the number of months." },
      ],
    },
    trail: {
      p1: "When you enter a second offer, the money trail answers one question: why is the total different? It moves through the parts of the deal in a fixed order.",
      order: "Price, fees, add-ons, trade-in, a bigger loan, the rate, the months.",
      p2: "Each step is the change in total caused by that part alone. The steps add up to the difference between the two totals, to the cent. This is checked by tests on 10,000 random deals.",
      example: (n: number) => `In the example, ${n} parts of the deal moved the total:`,
      colStep: "Part",
      colAmount: "Change in total",
      sum: "All together",
    },
    compare: {
      p1: "Two offers can be better in different ways. Deal Desk marks the lower one on each measure, and says in a sentence when they disagree.",
      items: [
        { k: "Total paid", v: "Everything you pay over the loan: the down payment plus every monthly payment. This is the price of the deal." },
        { k: "Monthly payment", v: "What leaves your account each month. A longer loan lowers it and raises the total." },
        { k: "Out-the-door price", v: "The price, tax, fees and add-ons together, before your down payment and trade-in." },
      ],
    },
    take: {
      p1: "For the offer that costs more on the measure you pick, Deal Desk finds the smallest change in one thing that would match the other offer. The things you can ask for are the price, the fees, the add-ons, the rate and the trade-in value.",
      p2: "The months and the down payment are shown as effects, not as asks, because a longer loan is not a concession.",
      p3: "If one change cannot close the gap on its own, the card says so.",
    },
    words: {
      intro: "Short meanings, in the order you meet them.",
      items: [
        { k: "Selling price", v: "The price of the car before tax, fees and add-ons." },
        { k: "Doc fee", v: "A fee for preparing the paperwork. It sits with the other fees on the worksheet." },
        { k: "Add-on", v: "An extra sold with the car, such as a warranty or a coating. Each one adds to what you pay." },
        { k: "Out-the-door price", v: "The price, sales tax, fees and add-ons together, before any down payment or trade-in." },
        { k: "Down payment", v: "Cash you pay up front. It lowers the amount you borrow." },
        { k: "Trade-in allowance", v: "What the dealer credits you for your old car." },
        { k: "Payoff amount", v: "What you still owe on the loan for your old car." },
        { k: "Negative equity", v: "When the payoff is more than the allowance. The difference is added to your new loan." },
        { k: "Amount financed", v: "The part of the out-the-door price you borrow, after your down payment and trade-in." },
        { k: "APR", v: "The yearly cost of the loan as a percentage. A lower APR means less interest." },
        { k: "Loan term", v: "The number of months you take to repay. A longer term lowers the payment and raises the total interest." },
      ],
    },
    cta: "Try it with your numbers",
  },

  about: {
    title: "About Deal Desk",
    description: "Why Deal Desk exists, who it is for, and what is built and what is planned.",
    h1: "About Deal Desk",
    lead: "A calculator and guide you keep open on your phone while you talk to a car dealer.",
    sections: {
      why: "Why it exists",
      who: "Who it is for",
      rule: "One rule: the calculator does the math",
      built: "What you can use today",
      planned: "What is planned, and not here yet",
      data: "Where vehicle facts come from",
    },
    why: [
      "A car deal changes while you sit there. The dealer moves one number, and three others move with it. It is hard to see what a change really costs.",
      "Deal Desk is built for the moment the dealer says a new number. You enter it, and you see in dollars where the money moved, what it would take to change the offer, and the words to ask.",
    ],
    who: [
      "Anyone buying a car in the United States, including first-time buyers, older buyers, buyers with no background in finance, and buyers who bring a relative to help.",
      "It uses plain words, large numbers, a larger text switch and a light screen for bright showrooms. The main controls are at least 44 pixels tall.",
    ],
    rule: [
      "Every figure on screen comes from the calculator: the same inputs always give the same answer. Planned AI features may read a document, explain a term or draft a reply. They never produce a number that the calculator did not produce first.",
    ],
    built: [
      "Compare two offers side by side, with the lower one marked on each measure.",
      "See the money trail between them, in dollars.",
      "Find what it would take to match, one lever at a time.",
      "Copy the sentence to say.",
      "Switch to a light screen or larger text. Your choice is remembered on your device.",
    ],
    planned: [
      "Vehicle and ZIP code details, with VIN checking.",
      "Reading a photo of the dealer's worksheet into editable fields, which you confirm.",
      "Checking the final contract against the offer you agreed.",
      "A practice conversation with a pretend finance manager.",
      "A one-page walk-away sheet to print.",
      "Saving a deal on your device, and a read-only link for a relative.",
    ],
    data: [
      "Vehicle details, recalls and crash ratings come from the public services of the National Highway Traffic Safety Administration. Fuel economy comes from the US Department of Energy's fueleconomy.gov. Each one is named where it is shown.",
    ],
    cta: "Open the calculator",
  },

  footer: {
    blurb: "Know what each change costs you, and what to ask for next.",
    pages: "Pages",
    legal: "Legal",
    screen: "Screen",
    project: "Deal Desk is a v2stack project.",
    note: "Estimates from the numbers you enter. Not financial or legal advice.",
    links: {
      calculator: "Calculator",
      how: "How it works",
      about: "About",
      privacy: "Privacy",
      terms: "Terms",
      accessibility: "Accessibility",
    },
  },
} as const;
