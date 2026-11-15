import type { Metadata } from "next";
import { DocPage } from "@/components/site/SitePage";
import { alternates } from "@/lib/site-locale";

export const metadata: Metadata = {
  title: "Términos",
  description: "Los términos para usar Deal Desk: cálculos estimados, no asesoría, y de qué sigue siendo responsable usted.",
  alternates: alternates("es", "/terms"),
};

const contents = [
  { id: "what", label: "Qué es Deal Desk" },
  { id: "advice", label: "Cálculos estimados, no asesoría" },
  { id: "yours", label: "Sus números, su decisión" },
  { id: "data", label: "Información de otros servicios" },
  { id: "use", label: "Uso del sitio" },
  { id: "liability", label: "Límites" },
  { id: "changes", label: "Cambios" },
];

/** La traducción al español de los términos. Si hay una diferencia con el inglés, vale el inglés. */
export default function TerminosEs() {
  return (
    <DocPage
      current="terms"
      locale="es"
      path="/terms"
      title="Términos"
      lead="Esta es una traducción para su comodidad, y está en beta mientras la revisa un hablante nativo. Si hay una diferencia con la versión en inglés, vale la versión en inglés."
      updated="Texto en inglés actualizado el 9 de noviembre de 2026"
      contents={contents}
    >
      <section id="what" aria-labelledby="what-h">
        <h2 id="what-h">Qué es Deal Desk</h2>
        <p>Deal Desk es una calculadora y guía para quienes compran un auto en los Estados Unidos con un préstamo. Es un proyecto de v2stack. No es un concesionario, ni un prestamista, ni un corredor, ni un asesor, y no participa en su compra.</p>
      </section>

      <section id="advice" aria-labelledby="advice-h">
        <h2 id="advice-h">Cálculos estimados, no asesoría</h2>
        <p>Todo lo que muestra Deal Desk es un cálculo estimado a partir de los números que usted escribe. No es asesoría financiera, de impuestos ni legal. El contrato del concesionario y los papeles de su prestamista deciden lo que usted paga de verdad, así que revise cada cifra contra ellos antes de firmar.</p>
        <p>Deal Desk no conoce las reglas de impuestos ni los límites de cargos de su estado, y no sabe cuál es un precio justo. Usted escribe el impuesto y los cargos de su propia hoja del trato.</p>
      </section>

      <section id="yours" aria-labelledby="yours-h">
        <h2 id="yours-h">Sus números, su decisión</h2>
        <p>Usted elige qué escribir y si actúa según lo que ve. Si un número se escribe mal, el resultado sale mal. Las frases que redacta Deal Desk son sugerencias. Usted decide qué decir y si compra.</p>
      </section>

      <section id="data" aria-labelledby="data-h">
        <h2 id="data-h">Información de otros servicios</h2>
        <p>Los datos de los vehículos, los retiros de seguridad, las calificaciones de choque y el rendimiento de combustible vienen de servicios públicos del gobierno de los Estados Unidos y se muestran con su fuente. Pueden estar desactualizados o incompletos. Para los retiros de un auto en particular, use la consulta oficial de retiros de la NHTSA con su VIN.</p>
      </section>

      <section id="use" aria-labelledby="use-h">
        <h2 id="use-h">Uso del sitio</h2>
        <p>Use Deal Desk para su propia compra de un auto. No intente dañarlo, sobrecargarlo ni usarlo para perjudicar a otros. Las funciones que usan IA tienen límites diarios para que todos puedan usarlas.</p>
      </section>

      <section id="liability" aria-labelledby="liability-h">
        <h2 id="liability-h">Límites</h2>
        <p>Deal Desk se ofrece tal como está, sin la promesa de que siempre esté disponible ni libre de errores. En la medida en que la ley lo permita, no es responsable de pérdidas que provengan de confiar en él.</p>
      </section>

      <section id="changes" aria-labelledby="changes-h">
        <h2 id="changes-h">Cambios</h2>
        <p>Si estos términos cambian, la fecha de arriba cambia con ellos.</p>
      </section>
    </DocPage>
  );
}
