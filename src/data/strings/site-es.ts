import type { SiteCopy } from "./site";

/**
 * The words of the site pages in Spanish: the home page, How it works, About, and the frame around every page.
 * The same shape as the English file, so a missing string is a type error. Formal "usted" throughout, a decimal
 * point for decimals, no dashes for pauses. This text is in beta until a native reviewer signs it off
 * (docs/ES_REVIEW_PROCESS.md). Figures are passed in from the engine, never typed here.
 */
export const siteEs: SiteCopy = {
  name: "Deal Desk",
  nav: {
    how: "Cómo funciona",
    learn: "Aprender",
    about: "Acerca de",
    open: "Abrir la calculadora",
    openShort: "Calculadora",
    skip: "Saltar al contenido",
    main: "Principal",
    footer: "Sitio",
    menu: "Menú",
    menuLabel: "Menú del sitio",
  },

  home: {
    title: "Deal Desk: sepa cuánto le cuesta cada cambio",
    description:
      "Escriba lo que dice el vendedor de autos. Deal Desk muestra en dólares adónde se movió el dinero entre dos ofertas, y qué pedir después.",
    h1: "Un pago más bajo todavía puede costarle más.",
    lead: "Alargue el préstamo. Vea cómo baja el pago y sube el total.",
    primary: "Empezar paso a paso",
    secondary: "Ver cómo funciona",
    note: "Una calculadora para tratos de autos. Sin cuenta, y sus números se quedan en su dispositivo.",

    road: {
      label: "Duración del préstamo",
      sliderLabel: "Duración del préstamo en meses",
      months: (n: number) => `${n} meses`,
      perMonth: "al mes",
      inTotal: "paga en total",
      today: "Hoy",
      paidOff: "Pagado",
      key: { loan: "El préstamo", interest: "Interés" },
      monthLess: (amount: string) => `${amount} menos al mes`,
      monthMore: (amount: string) => `${amount} más al mes`,
      totalMore: (amount: string) => `${amount} más que el préstamo de 60 meses`,
      totalLess: (amount: string) => `${amount} menos que el préstamo de 60 meses`,
      hint: "Arrastre para cambiar la duración del préstamo",
    },

    worksheet: {
      h2: "Los vendedores mueven cuatro números a la vez.",
      body: "Cambie una casilla y las demás se mueven con ella. Deal Desk mueve una a la vez, y muestra qué le hizo al total.",
      none: "Ninguno",
      perMonth: "al mes",
    },

    story: {
      h2: "Seis preguntas. Un dibujo para cada una.",
      lead: "El recorrido pregunta una cosa a la vez y explica cada palabra donde aparece.",
      items: [
        { title: "¿Qué le cotizaron primero?", body: "Un pago o un precio. Empiece por cualquiera." },
        { title: "¿Cuánto cuesta llevárselo?", body: "Precio, impuesto y cargos en un solo número." },
        { title: "¿Qué le agregaron?", body: "Vea lo que de verdad le cuestan los extras." },
        { title: "¿De cuánto es el préstamo?", body: "Un bloque por cada mes. El interés sale en rojo." },
        { title: "¿Y su auto de intercambio?", body: "Lo que todavía debe se resta de su crédito." },
        { title: "Aquí está su trato.", body: "Cada dólar en una barra. Compare una segunda oferta." },
      ],
      phone: {
        paymentsLabel: "Pagos mensuales",
        yearLabel: "Un año de pagos mensuales",
        extrasKey: { rest: "Sus otros pagos", extras: "Pagado por los extras" },
        owe: "Todavía debe",
        credit: "Crédito del auto de intercambio",
        realCost: (n: string) => `Cuesta unos ${n} pagos`,
        otd: "Precio final (out-the-door)",
        total: "Paga en total",
        inHundred: "de cada 100 dólares es interés",
        payPill: "Pago mensual",
        pricePill: "Precio del auto",
        payments: (n: number) => `${n} pagos`,
        next: "Siguiente",
      },
    },

    trust: [
      { title: "Sin cuenta", body: "Ábrala y empiece." },
      { title: "Se queda en su dispositivo", body: "No se envía nada a ningún lado." },
      { title: "Palabras claras, letra grande", body: "Hecha para leerse en la sala de ventas." },
    ],
    scope: { text: "Lo que hace, y lo que deja en sus manos", link: "Lea los detalles en Acerca de" },

    close: {
      h2: "Lleve la hoja del trato. Salga sabiendo qué pedir.",
      cta: "Abrir la calculadora",
    },
  },

  how: {
    title: "Cómo funciona Deal Desk",
    description:
      "El recorrido y el Escritorio, las cuatro casillas, adónde se movió el dinero, tres maneras de comparar dos ofertas y las palabras que usa un vendedor de autos.",
    h1: "Cómo funciona Deal Desk",
    lead: "Una sola calculadora hace todos los números. Esto es lo que verá.",
    modes: {
      h2: "Dos maneras de entrar",
      walk: { title: "El recorrido", body: "Una pregunta a la vez, con un dibujo. Lo mejor la primera vez." },
      desk: { title: "El Escritorio", body: "Todos los números en una pantalla. Lo mejor cuando el vendedor cambia las cosas rápido." },
      note: "Las dos usan los mismos números. Cambie cuando quiera.",
    },
    boxes: {
      h2: "Cuatro casillas contienen todo el trato",
      items: [
        { k: "Precio", v: "El precio de venta y su tasa de impuesto." },
        { k: "Cargos y extras", v: "El cargo por documentos, una garantía, un recubrimiento." },
        { k: "Intercambio y enganche", v: "Efectivo ahora, y lo que vale su auto viejo." },
        { k: "Préstamo", v: "La tasa y el número de meses." },
      ],
    },
    trail: {
      h2: "Adónde se movió el dinero",
      lead: "Ponga dos ofertas lado a lado. El cambio en el total se reparte por causa, y las partes suman al centavo.",
      sum: "Todo junto",
      note: "Comprobado con 10,000 tratos al azar.",
    },
    compare: {
      h2: "Tres maneras de comparar",
      items: [
        { k: "Total pagado", v: "Todo lo que paga. El precio real." },
        { k: "Pago mensual", v: "Lo que sale de su cuenta cada mes." },
        { k: "Precio final", v: "Precio, impuesto, cargos y extras, antes del intercambio y el enganche." },
      ],
      note: "En cada una se marca la menor. Una frase le avisa cuando no coinciden.",
    },
    take: {
      h2: "Lo que haría falta",
      lead: "Elija la oferta que cuesta más. Deal Desk encuentra el cambio más pequeño que la iguala con la otra.",
      levers: ["Precio", "Cargos", "Extras", "Tasa", "Valor del intercambio"],
      note: "Los meses y el enganche se muestran como efectos, no como peticiones. Si un solo cambio no cierra la diferencia, se lo dice.",
    },
    words: {
      h2: "Palabras que oirá",
      hint: "Toque una palabra para ver qué significa.",
      close: "Cerrar",
      items: [
        { k: "Precio de venta", v: "El precio del auto antes de impuesto, cargos y extras." },
        { k: "Cargo por documentos", v: "Un cargo por preparar el papeleo. Va con los demás cargos en la hoja del trato." },
        { k: "Extra", v: "Algo que se vende con el auto, como una garantía o un recubrimiento. Cada uno suma a lo que paga." },
        { k: "Precio final (out-the-door)", v: "El precio, el impuesto sobre la venta, los cargos y los extras juntos, antes de cualquier enganche o intercambio." },
        { k: "Enganche", v: "Efectivo que paga al principio. Baja lo que pide prestado." },
        { k: "Valor del auto de intercambio", v: "Lo que el concesionario le acredita por su auto viejo." },
        { k: "Monto para saldar el préstamo", v: "Lo que todavía debe del préstamo de su auto viejo." },
        { k: "Capital negativo", v: "Cuando lo que debe es más de lo que le acreditan. La diferencia se suma a su préstamo nuevo." },
        { k: "Monto financiado", v: "La parte del precio final que pide prestada, después de su enganche y su intercambio." },
        { k: "APR (tasa efectiva anual)", v: "El costo anual del préstamo como porcentaje. Un APR menor significa menos interés." },
        { k: "Plazo del préstamo", v: "El número de meses que toma para pagar. Un plazo más largo baja el pago y sube el interés total." },
      ],
    },
    cta: "Pruébela con sus números",
  },

  about: {
    title: "Acerca de Deal Desk",
    description: "Por qué existe Deal Desk, para quién es, y qué está hecho y qué está planeado.",
    h1: "Acerca de Deal Desk",
    lead: "Una calculadora y guía que mantiene abierta en el teléfono mientras habla con un vendedor de autos.",
    why: {
      h2: "Por qué existe",
      line: "El vendedor mueve un número, y otros tres se mueven con él.",
      body: "Deal Desk muestra en dólares lo que cada cambio costó de verdad, y qué pedir después.",
    },
    who: {
      h2: "Para quién es",
      lead: "Cualquiera que compre un auto en los Estados Unidos.",
      items: [
        { k: "Quienes compran por primera vez", v: "Cada palabra explicada donde aparece." },
        { k: "Compradores mayores", v: "Letra grande, y una pantalla clara para las salas de ventas con mucha luz." },
        { k: "Sin experiencia en finanzas", v: "Palabras sencillas, una pregunta a la vez." },
        { k: "Comprar con un familiar", v: "Fácil de leer juntos en un solo teléfono." },
      ],
    },
    free: {
      h2: "Gratis, sin anuncios",
      body: "Deal Desk es gratis. No tiene anuncios ni cuenta, y no vende ni comparte lo que usted escribe. Los asistentes de IA tienen un límite diario porque cuesta dinero hacerlos funcionar. Deal Desk es un proyecto de v2stack.",
    },
    rule: {
      h2: "Una regla",
      line: "La calculadora hace las cuentas.",
      calc: { title: "Calculadora", body: "Cada cifra en dólares. Los mismos datos siempre dan la misma respuesta." },
      ai: { title: "IA", body: "Lee un documento, explica una palabra, redacta qué decir. Nunca inventa un número." },
    },
    status: {
      h2: "Lo hecho y lo planeado",
      built: {
        title: "Puede usar hoy",
        items: [
          "Comparar dos ofertas, con la menor marcada.",
          "Ver el rastro del dinero entre ellas, en dólares.",
          "Encontrar qué haría falta para igualarlas.",
          "Copiar la frase que debe decir.",
          "Llenar los números hablando o desde un texto pegado, y revisar cada uno.",
          "Revisiones de un trato, cada una con su razón y una pregunta para hacer.",
          "Explicar cualquier revisión con sus palabras, en inglés o en español.",
          "Reescribir lo que va a decir: cortés, firme, breve o como mensaje de texto.",
          "Practicar la conversación con un gerente de finanzas de mentira.",
          "Escuchar el resultado en voz alta, y guardar un trato en este dispositivo.",
          "El impuesto sobre la venta de su estado a partir de su código postal.",
          "Fotos de una hoja del trato, una carta del prestamista, un contrato o un VIN, leídas por IA y revisadas por usted.",
          "Datos del vehículo, retiros de seguridad, calificaciones de choque y costo de combustible desde un VIN o un año, marca y modelo.",
          "Revisar un arrendamiento, y comparar un préstamo con pagar al contado.",
          "Imprimir el trato o compartirlo como enlace.",
          "Toda la calculadora en español, y sin conexión una vez cargada.",
          "Esta página de inicio, Cómo funciona, Acerca de y las páginas legales en español.",
          "Una breve bienvenida y un recorrido del Escritorio para quienes compran por primera vez.",
          "Una página Aprender con unas cien palabras de la compra de autos en lenguaje sencillo, cada una ligada a algo de la vida diaria, seis lecciones breves, y un descifrador de lo que escribió el vendedor.",
          "Una vista simple con menos números, una nota sobre lo que más importa en su trato, y preguntas que puede hacer sobre todo el trato.",
          "Cambiar a una pantalla clara o a letra más grande.",
        ],
      },
      planned: {
        title: "Todavía no está",
        items: [
          "Una guía en video.",
          "La revisión de todo el español por un hablante nativo. Hasta entonces el español está marcado como beta.",
        ],
      },
    },
    data: {
      h2: "De dónde vienen los datos de los vehículos",
      body: "Los retiros de seguridad, las calificaciones de choque y los datos de los vehículos vienen de la Administración Nacional de Seguridad del Tráfico en las Carreteras (NHTSA). El rendimiento de combustible viene de fueleconomy.gov. Cada uno se nombra donde se muestra.",
    },
    cta: "Abrir la calculadora",
  },

  notFound: {
    title: "Página no encontrada",
    h1: "Esa página no está aquí.",
    lead: "Puede que el enlace sea viejo o tenga un error. La calculadora y las guías están a un toque.",
    primary: "Abrir la calculadora",
    secondary: "Ir a la página de inicio",
  },

  error: {
    title: "Algo salió mal",
    h1: "Algo salió mal de nuestra parte.",
    lead: "Sus números están seguros en su dispositivo. Intente de nuevo, o empiece desde la página de inicio.",
    retry: "Intentar de nuevo",
    home: "Ir a la página de inicio",
  },

  footer: {
    blurb: "Sepa cuánto le cuesta cada cambio, y qué pedir después.",
    pages: "Páginas",
    legal: "Legal",
    screen: "Pantalla",
    project: "Deal Desk es un proyecto de v2stack. El auto en 3D es un modelo CC0 de Kenney (kenney.nl).",
    note: "Cálculos estimados con los números que usted escribe. No es asesoría financiera ni legal. El español está en beta mientras lo revisa un hablante nativo.",
    links: {
      calculator: "Calculadora",
      how: "Cómo funciona",
      learn: "Aprender las palabras",
      about: "Acerca de",
      privacy: "Privacidad",
      terms: "Términos",
      accessibility: "Accesibilidad",
    },
  },
};
