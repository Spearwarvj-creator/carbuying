import type { Metadata } from "next";
import { DocPage } from "@/components/site/SitePage";
import { Nums } from "@/components/Nums";
import { alternates } from "@/lib/site-locale";

export const metadata: Metadata = {
  title: "Accesibilidad",
  description: "Cómo está hecho Deal Desk para que todos lo puedan leer y usar, y qué hemos probado y qué no.",
  alternates: alternates("es", "/accessibility"),
};

const contents = [
  { id: "aim", label: "Lo que buscamos" },
  { id: "built", label: "Lo que ya está" },
  { id: "tested", label: "Lo que hemos probado" },
  { id: "tell", label: "Cuéntenos de un problema" },
];

/** La traducción al español de la página de accesibilidad. Si hay una diferencia con el inglés, vale el inglés. */
export default function AccesibilidadEs() {
  return (
    <DocPage
      current="accessibility"
      locale="es"
      path="/accessibility"
      title="Accesibilidad"
      lead="Esta es una traducción para su comodidad, y está en beta mientras la revisa un hablante nativo. Si hay una diferencia con la versión en inglés, vale la versión en inglés."
      updated="Texto en inglés actualizado el 14 de noviembre de 2026"
      contents={contents}
    >
      <section id="aim" aria-labelledby="aim-h">
        <h2 id="aim-h">Lo que buscamos</h2>
        <p>Deal Desk es para personas que quizá nunca han comprado un auto, y para compradores mayores, muchas veces en una sala de ventas con mucha luz, en un teléfono y bajo presión. Buscamos cumplir con <Nums text="WCAG 2.2" /> nivel AA.</p>
      </section>

      <section id="built" aria-labelledby="built-h">
        <h2 id="built-h">Lo que ya está</h2>
        <ul>
          <li>Un interruptor de letra más grande y una pantalla clara, los dos guardados en su dispositivo. La pantalla oscura es la predeterminada.</li>
          <li>
            <Nums
              text={`Pares de colores medidos en la pantalla oscura: texto principal 15.56 a 1, texto secundario 10.18 a 1, el rojo de “paga más” 7.73 a 1, el verde de “paga menos” 9.99 a 1, y el amarillo del total 10.77 a 1. WCAG pide 4.5 a 1.`}
            />
          </li>
          <li>El color nunca es la única señal. Cada cambio lleva un signo de más o de menos y una flecha dibujada.</li>
          <li>Las cifras de dinero se escriben con una tipografía de números con el cero liso. El texto corrido usa Atkinson Hyperlegible, cuyo cero lleva una raya a propósito para que nunca se confunda con la letra O.</li>
          <li>
            <Nums text="Los controles principales, las casillas de números, las teclas del teclado numérico y los botones, miden al menos 44 píxeles de alto. Los enlaces dentro del texto y en el pie de página miden al menos 24 por 24 píxeles, el mínimo de WCAG 2.2." />
          </li>
          <li>El teclado numérico también funciona con un teclado físico, y el contorno del foco es grueso y siempre visible.</li>
          <li>El movimiento se usa para mostrar qué cambió: números que cuentan, barras y bloques que se llenan, pasos que se deslizan, un pequeño auto en 3D en la página de inicio. Todo se apaga, o se dibuja como imagen fija, cuando su dispositivo pide menos movimiento. El auto en 3D es decoración y está oculto para los lectores de pantalla.</li>
          <li>Sin límites de tiempo, sin ventanas emergentes, sin sonidos.</li>
        </ul>
      </section>

      <section id="tested" aria-labelledby="tested-h">
        <h2 id="tested-h">Lo que hemos probado</h2>
        <p>
          <Nums text="Cada página y cada paso de la calculadora se revisó con una auditoría automática (axe-core 4) en las pantallas oscura y clara, en anchos de teléfono y de computadora, sin encontrar infracciones el 9 de noviembre de 2026. Las páginas se revisaron en anchos de 320 a 2560 píxeles, con letra más grande y con la pantalla clara, y no se desplazan hacia los lados. El orden de los primeros controles de la página de inicio se probó con el teclado. Las páginas en español se revisaron el 14 de noviembre de 2026 con la misma auditoría, en la pantalla oscura con ancho de computadora y sin infracciones, y no se desplazan hacia los lados con 320 píxeles. Todavía no hemos probado con un lector de pantalla ni terminado una pasada completa de la calculadora solo con teclado. Pondremos los resultados aquí cuando estén listos. La revisión del texto en español por un hablante nativo sigue pendiente." />
        </p>
        <p>Está planeado un interruptor de alto contraste.</p>
      </section>

      <section id="tell" aria-labelledby="tell-h">
        <h2 id="tell-h">Cuéntenos de un problema</h2>
        <p>Si algo es difícil de leer o de usar, avísenos por la <a href="https://v2stack.com/contact">página de contacto en v2stack.com</a>. Díganos qué intentaba hacer y qué dispositivo usó, y lo arreglaremos.</p>
      </section>
    </DocPage>
  );
}
