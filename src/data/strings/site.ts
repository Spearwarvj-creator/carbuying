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
    menu: "Menu",
    menuLabel: "Site menu",
  },

  home: {
    title: "Deal Desk: know what each change costs you",
    description:
      "Enter what the car dealer says. Deal Desk shows in dollars where the money moved between two offers, and what to ask for next.",
    h1: "A lower payment can still cost you more.",
    lead: "Make the loan longer. Watch the payment fall and the total climb.",
    primary: "Start the walk",
    secondary: "See how it works",
    note: "A car-deal calculator. No account, and your numbers stay on your device.",

    road: {
      label: "Loan length",
      sliderLabel: "Loan length in months",
      months: (n: number) => `${n} months`,
      perMonth: "a month",
      inTotal: "you pay in total",
      today: "Today",
      paidOff: "Paid off",
      key: { loan: "The loan", interest: "Interest" },
      monthLess: (amount: string) => `${amount} less a month`,
      monthMore: (amount: string) => `${amount} more a month`,
      totalMore: (amount: string) => `${amount} more than the 60 month loan`,
      totalLess: (amount: string) => `${amount} less than the 60 month loan`,
      hint: "Drag to change the loan length",
    },

    worksheet: {
      h2: "Dealers move four numbers at once.",
      body: "Change one box and the others move with it. Deal Desk moves one at a time, and shows what it did to the total.",
      none: "None",
      perMonth: "a month",
    },

    story: {
      h2: "Six questions. One picture each.",
      lead: "The Walk asks one thing at a time and explains each word where it appears.",
      items: [
        { title: "What did they quote first?", body: "A payment or a price. Start from either." },
        { title: "What does it cost to drive away?", body: "Price, tax and fees in one number." },
        { title: "What did they add on?", body: "See what the extras really cost you." },
        { title: "How long is the loan?", body: "One block for each month. Interest shows in red." },
        { title: "What about your trade-in?", body: "What you still owe comes off its credit." },
        { title: "Here is your deal.", body: "Every dollar on one bar. Compare a second offer." },
      ],
      phone: {
        paymentsLabel: "Monthly payments",
        yearLabel: "A year of monthly payments",
        extrasKey: { rest: "Your other payments", extras: "Paid for the extras" },
        owe: "You still owe",
        credit: "Trade-in credit",
        realCost: (n: string) => `Costs about ${n} payments`,
        otd: "Out-the-door price",
        total: "You pay in total",
        inHundred: "of every 100 dollars is interest",
      },
    },

    trust: [
      { title: "No account", body: "Open it and start." },
      { title: "Stays on your device", body: "Nothing is sent anywhere." },
      { title: "Plain words, large type", body: "Built to be read in a showroom." },
    ],
    scope: { text: "What it does, and what it leaves to you", link: "Read the details on About" },

    close: {
      h2: "Bring the worksheet. Leave knowing what to ask.",
      cta: "Open the calculator",
    },
  },

  how: {
    title: "How Deal Desk works",
    description:
      "The Walk and the Desk, the four boxes, where the money moved, three ways to compare two offers, and the words a car dealer uses.",
    h1: "How Deal Desk works",
    lead: "One calculator makes every number. Here is what you will see.",
    modes: {
      h2: "Two ways in",
      walk: { title: "The Walk", body: "One question at a time, with a picture. Best the first time." },
      desk: { title: "The Desk", body: "Every number on one screen. Best when the dealer changes things fast." },
      note: "Both use the same numbers. Switch any time.",
    },
    boxes: {
      h2: "Four boxes hold the whole deal",
      items: [
        { k: "Price", v: "The selling price and your tax rate." },
        { k: "Fees and extras", v: "The doc fee, a warranty, a coating." },
        { k: "Trade and down", v: "Cash now, and what your old car is worth." },
        { k: "Loan", v: "The rate and the number of months." },
      ],
    },
    trail: {
      h2: "Where the money moved",
      lead: "Put two offers side by side. The change in total is split by cause, and the parts add up to the cent.",
      sum: "All together",
      note: "Checked on 10,000 random deals.",
    },
    compare: {
      h2: "Three ways to compare",
      items: [
        { k: "Total paid", v: "Everything you pay. The real price." },
        { k: "Monthly payment", v: "What leaves your account each month." },
        { k: "Out-the-door", v: "Price, tax, fees and extras, before trade and down." },
      ],
      note: "The lower one is marked on each. A sentence says when they disagree.",
    },
    take: {
      h2: "What it would take",
      lead: "Pick the offer that costs more. Deal Desk finds the smallest single change that matches the other one.",
      levers: ["Price", "Fees", "Add-ons", "Rate", "Trade-in value"],
      note: "Months and down payment show as effects, not asks. If one change cannot close the gap, it says so.",
    },
    words: {
      h2: "Words you will hear",
      hint: "Tap a word to see what it means.",
      close: "Close",
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
    why: {
      h2: "Why it exists",
      line: "The dealer moves one number, and three others move with it.",
      body: "Deal Desk shows in dollars what each change really cost, and what to ask for next.",
    },
    who: {
      h2: "Who it is for",
      lead: "Anyone buying a car in the United States.",
      items: [
        { k: "First-time buyers", v: "Every word explained where it appears." },
        { k: "Older buyers", v: "Large type, and a light screen for bright showrooms." },
        { k: "No finance background", v: "Plain words, one question at a time." },
        { k: "Buying with a relative", v: "Easy to read together on one phone." },
      ],
    },
    rule: {
      h2: "One rule",
      line: "The calculator does the math.",
      calc: { title: "Calculator", body: "Every dollar figure. The same inputs always give the same answer." },
      ai: { title: "AI", body: "Reads a document, explains a word, drafts what to say. Never makes a number." },
    },
    status: {
      h2: "Built and planned",
      built: {
        title: "You can use today",
        items: [
          "Compare two offers, with the lower one marked.",
          "See the money trail between them, in dollars.",
          "Find what it would take to match.",
          "Copy the sentence to say.",
          "Fill the numbers in by voice or from pasted text, then check each one.",
          "Checks on a deal, each with a reason and a question to ask.",
          "Explain any check in your words, in English or Spanish.",
          "Reword what to say: polite, firm, short or a text message.",
          "Practise the conversation with a pretend finance manager.",
          "Hear the result read aloud, and save a deal on this device.",
          "Your state's sales tax from your ZIP code.",
          "Photos of a worksheet, lender letter, contract or VIN, read by AI and checked by you.",
          "Vehicle details, recalls, crash ratings and fuel cost from a VIN or year, make and model.",
          "Check a lease, and compare a loan with paying cash.",
          "Print the deal or share it as a link.",
          "The whole calculator in Spanish, and offline once it has loaded.",
          "A short welcome and a tour of the Desk for first-time buyers.",
          "Switch to a light screen or larger text.",
        ],
      },
      planned: {
        title: "Not here yet",
        items: [
          "A video guide.",
          "Spanish for these pages and the legal pages. The calculator's Spanish is waiting for a native speaker to review it.",
        ],
      },
    },
    data: {
      h2: "Where vehicle facts come from",
      body: "Recalls, crash ratings and vehicle details come from the National Highway Traffic Safety Administration. Fuel economy comes from fueleconomy.gov. Each one is named where it is shown.",
    },
    cta: "Open the calculator",
  },

  notFound: {
    title: "Page not found",
    h1: "That page is not here.",
    lead: "The link may be old or mistyped. The calculator and the guides are one tap away.",
    primary: "Open the calculator",
    secondary: "Go to the home page",
  },

  error: {
    title: "Something went wrong",
    h1: "Something went wrong on our side.",
    lead: "Your numbers are safe on your device. Try again, or start from the home page.",
    retry: "Try again",
    home: "Go to the home page",
  },

  footer: {
    blurb: "Know what each change costs you, and what to ask for next.",
    pages: "Pages",
    legal: "Legal",
    screen: "Screen",
    project: "Deal Desk is a v2stack project. The 3D car is a CC0 model by Kenney (kenney.nl).",
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
