import type { ArtKey } from "./types";

/**
 * Six short lessons, each a two minute read with one picture, a few plain steps, a look at the reader's own deal, and one
 * question to check themselves. Not graded and nothing is stored. Written for someone who has never bought a car.
 */
export interface LessonBase {
  id: string;
  art: ArtKey;
  /** The dictionary term whose "In your deal" line closes the lesson, and the terms to read next. */
  mine: string;
  terms: string[];
}

export interface LessonText {
  title: string;
  /** One line that says what the lesson is for. */
  goal: string;
  steps: string[];
  check: { q: string; a: string };
}

export const LESSON_BASE: LessonBase[] = [
  { id: "four", art: "scale", mine: "monthly-payment", terms: ["four-square", "monthly-payment", "selling-price"] },
  { id: "payment", art: "seesaw", mine: "loan-term", terms: ["loan-term", "interest", "monthly-payment"] },
  { id: "extras", art: "gym", mine: "add-ons", terms: ["add-ons", "extended-warranty", "gap"] },
  { id: "rate", art: "friend", mine: "apr", terms: ["apr", "pre-approval", "credit-score"] },
  { id: "trade", art: "swap", mine: "negative-equity", terms: ["trade-in", "payoff", "negative-equity"] },
  { id: "sign", art: "fineprint", mine: "otd", terms: ["otd", "buyers-order", "spot-delivery"] },
];

export const LESSONS_EN: Record<string, LessonText> = {
  four: {
    title: "The four numbers a dealer juggles",
    goal: "See why talking about one number at a time protects you.",
    steps: [
      "A car deal has four moving parts: the price of the car, what they give you for your old car, how much you put down, and the monthly payment.",
      "They are linked. Change one and another moves. That is how a bigger price can hide inside a smaller payment.",
      "So settle them one at a time. Agree the price of the car first. Then the trade-in. Then how you pay.",
      "When someone asks what monthly payment you want, you can answer: first, what is the total price with every fee?",
    ],
    check: {
      q: "A dealer says: we can get you to $450 a month. Which number did they just change?",
      a: "Most likely the length of the loan or the extras, not the price. Ask for the price and the number of months.",
    },
  },
  payment: {
    title: "Why a lower payment can cost more",
    goal: "Understand the trade between the monthly payment and the total.",
    steps: [
      "Imagine a phone on a plan. A 36 month plan has a bigger bill each month than a 24 month plan, but you pay for fewer months.",
      "A car loan works the same way. Stretch the loan over more months and each payment shrinks.",
      "But interest keeps running the whole time. More months means more interest, so the total goes up.",
      "A long loan is also the easiest way to owe more than the car is worth, because the car loses value faster than the loan shrinks.",
    ],
    check: {
      q: "The payment fell by $60 a month because the loan went from 60 to 84 months. Did the deal get cheaper?",
      a: "Not necessarily. You pay 24 more months of interest. Compare the total of all payments, not only the monthly payment.",
    },
  },
  extras: {
    title: "What extras really cost",
    goal: "Know what you are agreeing to when an extra is added.",
    steps: [
      "Extras are products added to the deal: a service plan, paint protection, GAP, etching, and more. All of them are optional.",
      "If an extra is rolled into the loan, you pay tax on it and interest on it. A $1,500 extra can cost well over $2,000 by the end.",
      "Many extras can be bought later, or somewhere else, often for less. Some can be cancelled for a refund.",
      "You are allowed to say no to every one of them, and the price should simply drop.",
    ],
    check: {
      q: "The finance office says the warranty is only $30 a month. What should you work out?",
      a: "How many months you will pay it. $30 a month for 84 months is about $2,520, before any interest on it.",
    },
  },
  rate: {
    title: "What the rate means",
    goal: "Read an APR as the price of borrowing, and know how to shop for it.",
    steps: [
      "The rate is the yearly price of borrowing. Borrow $100 from a friend and give back $107 a year later, and the rate is 7 percent.",
      "Your credit score sets the rate you are offered. A higher score usually earns a lower rate.",
      "A dealer can offer you a higher rate than the lender approved and keep the difference. You can ask what the lender approved.",
      "The best protection is a pre-approved loan from your own bank or credit union. Then the dealer's rate has something to beat.",
    ],
    check: {
      q: "The dealer's rate is a point higher than your bank's pre-approval. What can you say?",
      a: "Ask them to match or beat your bank's rate. If they cannot, use the bank's loan.",
    },
  },
  trade: {
    title: "What a trade-in really does",
    goal: "Know how an old car, and what you owe on it, changes the new deal.",
    steps: [
      "A trade-in is your old car, used as part of the payment. The dealer takes its value off what you owe on the new one.",
      "But you may still owe money on the old car. That payoff comes out of the trade-in credit first.",
      "If you owe more than the car is worth, the gap is added to your new loan. You then pay interest on the old car too. That is negative equity.",
      "The trade-in value and the price of the new car are two separate negotiations. A low offer on your car costs you as much as a higher price would.",
    ],
    check: {
      q: "Your car is worth $8,000 and you owe $11,000. What happens to the $3,000?",
      a: "It is added to your new loan, and you pay interest on it. Ask exactly how much of the old loan is being rolled in.",
    },
  },
  sign: {
    title: "Before you sign",
    goal: "Know what to check so the paper matches the deal you agreed.",
    steps: [
      "Ask for the out-the-door price in writing, with every fee listed. That one number is the real total before interest.",
      "Read the buyer's order or contract line by line. The price, the rate, the months and the fees should all match what you agreed.",
      "Do not leave in the car until the financing is final and in writing. If the loan is not final, the dealer may ask you to sign a worse deal later.",
      "Do not sign anything with blank spaces, and ask for a copy of everything you sign.",
    ],
    check: {
      q: "The contract shows a rate of 8.9% but you agreed 6.9%. What do you do?",
      a: "Stop and do not sign. Ask them to explain the difference and correct it in writing before you go on.",
    },
  },
};

export const LESSONS_ES: Record<string, LessonText> = {
  four: {
    title: "Los cuatro números que el vendedor maneja",
    goal: "Ver por qué hablar de un número a la vez le protege.",
    steps: [
      "Un trato de auto tiene cuatro partes que se mueven: el precio del auto, lo que le dan por su auto viejo, cuánto da de enganche y el pago mensual.",
      "Están ligadas. Si cambia una, otra se mueve. Así es como un precio mayor puede esconderse dentro de un pago menor.",
      "Por eso acuérdelas una por una. Primero el precio del auto. Luego el auto de intercambio. Luego cómo paga.",
      "Cuando le pregunten qué pago mensual quiere, puede responder: primero, ¿cuál es el precio total con todos los cargos?",
    ],
    check: {
      q: "Un vendedor dice: le podemos dejar en $450 al mes. ¿Qué número acaba de cambiar?",
      a: "Lo más probable es el plazo del préstamo o los extras, no el precio. Pida el precio y el número de meses.",
    },
  },
  payment: {
    title: "Por qué un pago menor puede costar más",
    goal: "Entender el intercambio entre el pago mensual y el total.",
    steps: [
      "Imagine un teléfono con plan. Un plan de 36 meses tiene una cuenta mensual mayor que uno de 24 meses, pero paga menos meses.",
      "Un préstamo de auto funciona igual. Si estira el préstamo en más meses, cada pago se hace más pequeño.",
      "Pero el interés sigue corriendo todo ese tiempo. Más meses significa más interés, así que el total sube.",
      "Un préstamo largo también es la forma más fácil de deber más de lo que vale el auto, porque el auto pierde valor más rápido de lo que baja el préstamo.",
    ],
    check: {
      q: "El pago bajó $60 al mes porque el préstamo pasó de 60 a 84 meses. ¿Se hizo más barato el trato?",
      a: "No necesariamente. Paga 24 meses más de interés. Compare el total de todos los pagos, no solo el pago mensual.",
    },
  },
  extras: {
    title: "Lo que de verdad cuestan los extras",
    goal: "Saber a qué se compromete cuando se agrega un extra.",
    steps: [
      "Los extras son productos que se agregan al trato: un plan de servicio, protección de pintura, GAP, grabado y más. Todos son opcionales.",
      "Si un extra se suma al préstamo, paga impuesto por él e interés por él. Un extra de $1,500 puede costar bastante más de $2,000 al final.",
      "Muchos extras se pueden comprar después, o en otro lado, a menudo por menos. Algunos se pueden cancelar con reembolso.",
      "Puede decir que no a todos, y el precio simplemente debe bajar.",
    ],
    check: {
      q: "La oficina de finanzas dice que la garantía son solo $30 al mes. ¿Qué debe calcular?",
      a: "Cuántos meses la pagará. $30 al mes durante 84 meses son unos $2,520, antes de cualquier interés sobre ella.",
    },
  },
  rate: {
    title: "Qué significa la tasa",
    goal: "Leer un APR como el precio de pedir prestado, y saber cómo buscar uno mejor.",
    steps: [
      "La tasa es el precio anual de pedir prestado. Si pide $100 a un amigo y devuelve $107 un año después, la tasa es del 7 por ciento.",
      "Su puntaje de crédito fija la tasa que le ofrecen. Un puntaje más alto suele ganar una tasa menor.",
      "Un vendedor puede ofrecerle una tasa más alta que la aprobada por el prestamista y quedarse con la diferencia. Puede preguntar qué aprobó el prestamista.",
      "La mejor protección es un préstamo preaprobado de su propio banco o cooperativa de crédito. Así la tasa del vendedor tiene algo que superar.",
    ],
    check: {
      q: "La tasa del vendedor es un punto mayor que la preaprobación de su banco. ¿Qué puede decir?",
      a: "Pídale que iguale o mejore la tasa de su banco. Si no puede, use el préstamo del banco.",
    },
  },
  trade: {
    title: "Lo que de verdad hace un auto de intercambio",
    goal: "Saber cómo un auto viejo, y lo que debe por él, cambia el trato nuevo.",
    steps: [
      "Un auto de intercambio es su auto viejo, usado como parte del pago. El vendedor descuenta su valor de lo que debe por el nuevo.",
      "Pero quizá todavía deba dinero por el auto viejo. Esa liquidación sale primero del crédito del auto de intercambio.",
      "Si debe más de lo que vale el auto, la diferencia se suma a su préstamo nuevo. Entonces paga interés también por el auto viejo. Eso es capital negativo.",
      "El valor del auto de intercambio y el precio del auto nuevo son dos negociaciones distintas. Una oferta baja por su auto le cuesta tanto como un precio más alto.",
    ],
    check: {
      q: "Su auto vale $8,000 y usted debe $11,000. ¿Qué pasa con los $3,000?",
      a: "Se suman a su préstamo nuevo, y paga interés por ellos. Pregunte exactamente cuánto del préstamo anterior se está sumando.",
    },
  },
  sign: {
    title: "Antes de firmar",
    goal: "Saber qué revisar para que el papel coincida con el trato que acordó.",
    steps: [
      "Pida por escrito el precio final a pagar, con todos los cargos enumerados. Ese número es el total real antes del interés.",
      "Lea la orden del comprador o el contrato línea por línea. El precio, la tasa, los meses y los cargos deben coincidir con lo que acordó.",
      "No se vaya con el auto hasta que el financiamiento sea definitivo y esté por escrito. Si el préstamo no es definitivo, el vendedor puede pedirle firmar un trato peor después.",
      "No firme nada con espacios en blanco, y pida una copia de todo lo que firme.",
    ],
    check: {
      q: "El contrato muestra una tasa de 8.9% pero usted acordó 6.9%. ¿Qué hace?",
      a: "Deténgase y no firme. Pídales que expliquen la diferencia y la corrijan por escrito antes de seguir.",
    },
  },
};
