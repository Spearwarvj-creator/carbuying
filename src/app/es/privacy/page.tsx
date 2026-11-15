import type { Metadata } from "next";
import { DocPage } from "@/components/site/SitePage";
import { alternates } from "@/lib/site-locale";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Qué guarda Deal Desk en su dispositivo, qué sale de él y qué no guarda nunca.",
  alternates: alternates("es", "/privacy"),
};

const contents = [
  { id: "short", label: "La versión corta" },
  { id: "device", label: "Lo que se queda en su dispositivo" },
  { id: "leaves", label: "Lo que sale de su dispositivo" },
  { id: "ai", label: "Usos gratis de IA y sus límites" },
  { id: "cookies", label: "Cookies y almacenamiento" },
  { id: "changes", label: "Cambios y preguntas" },
];

/** La traducción al español de la página de privacidad. Si hay una diferencia con el inglés, vale el inglés. */
export default function PrivacidadEs() {
  return (
    <DocPage
      current="privacy"
      locale="es"
      path="/privacy"
      title="Privacidad"
      lead="Esta es una traducción para su comodidad, y está en beta mientras la revisa un hablante nativo. Si hay una diferencia con la versión en inglés, vale la versión en inglés."
      updated="Texto en inglés actualizado el 9 de noviembre de 2026"
      contents={contents}
    >
      <section id="short" aria-labelledby="short-h">
        <h2 id="short-h">La versión corta</h2>
        <p>La calculadora se ejecuta en su navegador y no envía nada. No hay cuentas, ni base de datos de tratos, ni anuncios, ni programas de rastreo.</p>
        <p>Los números que escribe no se guardan ni se envían a ningún lado. Cuando cierra la página, desaparecen.</p>
      </section>

      <section id="device" aria-labelledby="device-h">
        <h2 id="device-h">Lo que se queda en su dispositivo</h2>
        <ul>
          <li>Los números que escribe. Se mantienen en la página mientras está abierta y nunca se nos envían.</li>
          <li>Su elección de pantalla clara, de letra más grande, de idioma y de si usó por última vez el recorrido o el Escritorio. Estos ajustes se guardan en su navegador para que la página se vea igual la próxima vez.</li>
          <li>Un trato que usted decide guardar. El botón dice &ldquo;Guardar en este dispositivo&rdquo;; se guarda solo en su navegador, nunca se envía a ningún lado, y usted lo puede borrar. No se guarda nada a menos que lo oprima.</li>
          <li>Su código postal, si lo escribe para ver el impuesto sobre la venta de su estado. La tabla que convierte un código postal en una ciudad y un estado es parte de la página, así que el código postal nunca se envía a un servidor.</li>
        </ul>
      </section>

      <section id="leaves" aria-labelledby="leaves-h">
        <h2 id="leaves-h">Lo que sale de su dispositivo</h2>
        <p>Nada de la calculadora sale. Dos ayudas opcionales sí, y solo cuando usted las usa:</p>
        <ul>
          <li>
            <b>Fotos de papeles.</b> Una hoja del trato, una carta del prestamista, las páginas de un contrato (hasta cuatro) o la etiqueta del VIN del auto. Cada foto se reduce en su teléfono, luego se envía a nuestro servidor y de ahí a un lector de IA que devuelve los números que alcanza a ver. No se guarda, y la solicitud no se registra. Tape primero su nombre, su dirección y su firma. Usted revisa cada número antes de usarlo.
          </li>
          <li>
            <b>Explicar esto, reescribir lo que va a decir, y practicar.</b> Cuando usa estas funciones, el texto de la revisión que tocó, su pregunta y las cifras del trato van a nuestro servidor y de ahí a un modelo de IA, por medio de OpenRouter, para escribir la respuesta. El modelo escribe solo palabras: cada número que puede usar viene de la calculadora, y una respuesta que trae un número propio se descarta. No se guarda nada y las solicitudes no se registran. Todo lo que escribió una IA está marcado como escrito por IA. Si la ayuda no está activada, se muestra el texto estándar.
          </li>
          <li>
            <b>Hablar.</b> El botón del micrófono usa el servicio de voz del propio navegador. En Chrome y Safari, ese servicio puede enviar su voz al fabricante del navegador (Google o Apple) para convertirla en texto; Deal Desk no recibe el audio. Si prefiere no hacerlo, escriba los números, o use la tecla del micrófono de su teclado.
          </li>
        </ul>
        <p>
          Cuando usa la consulta de vehículos, un VIN, o un año, marca y modelo, van a nuestro servidor. El servidor consulta los servicios públicos de vehículos del
          gobierno de los Estados Unidos (la NHTSA para datos del vehículo, retiros de seguridad y calificaciones de choque, y el Departamento de Energía para el rendimiento de combustible) y devuelve la respuesta.
          Las respuestas se guardan por poco tiempo, hasta un día, para no hacer la misma pregunta dos veces. Se archivan por vehículo, no por persona.
        </p>
        <p>
          Como cualquier sitio web, el servicio que entrega estas páginas puede registrar datos técnicos habituales de cada solicitud, como la hora, la
          página y la dirección de red. No los usamos para identificarlo a usted.
        </p>
      </section>

      <section id="ai" aria-labelledby="ai-h">
        <h2 id="ai-h">Usos gratis de IA y sus límites</h2>
        <p>
          Las ayudas de IA cuestan dinero, así que cada visitante recibe una cantidad de usos gratis por día. Una pregunta, una reescritura o un turno de práctica usa uno, y una foto usa dos.
          La calculadora, las revisiones y escribir o decir sus números nunca usan ninguno. La cuenta vuelve a cero cada día a la medianoche UTC.
        </p>
        <ul>
          <li>Para llevar la cuenta usamos un código irreversible (hash) de la dirección de red, mezclado con la fecha, de modo que cambia cada día y no se puede convertir de nuevo en la dirección. La cuenta se borra después de dos días.</li>
          <li>Para frenar una ráfaga de solicitudes, la dirección se mantiene en la memoria del servidor hasta un minuto. No se escribe en ningún lado.</li>
          <li>No se guarda nada de lo que envía, y el contenido de las solicitudes no se escribe en nuestros registros.</li>
          <li>La IA nunca produce un número por su cuenta. Cada cifra viene de la calculadora.</li>
          <li>Si se le acaban y nos pide más, podemos darle un código. Se guarda en su navegador (nombre: dd-boost) y se envía con sus solicitudes de IA para que el servidor suba su límite diario.</li>
        </ul>
      </section>

      <section id="cookies" aria-labelledby="cookies-h">
        <h2 id="cookies-h">Cookies y almacenamiento</h2>
        <p>Deal Desk no usa cookies. Usa el almacenamiento de su navegador para sus ajustes (nombres: dd-theme, dd-text, dd-mode, dd-lang), una nota de qué pantallas de bienvenida ya vio (dd-seen), un código para más usos de IA si se lo dimos (dd-boost) y, solo si oprime Guardar, un trato guardado (dd-saved). Borrar los datos del sitio en su navegador los elimina.</p>
        <p>Mientras trabaja, los números que ha escrito y el paso en que va también se guardan en el almacenamiento de sesión de esta pestaña (nombre: dd-session), para que actualizar la página no los pierda. Se queda en su dispositivo, nunca se envía a ningún lado y se borra al cerrar la pestaña. La dirección de un paso del recorrido solo lleva el número del paso.</p>
        <p>Para funcionar con una señal débil, Deal Desk guarda sus propias páginas, imágenes y programas en su dispositivo con un service worker (los nombres del caché empiezan con dd-v1). No guarda nada de lo que usted escribe, ni consultas de autos ni respuestas de IA.</p>
      </section>

      <section id="changes" aria-labelledby="changes-h">
        <h2 id="changes-h">Cambios y preguntas</h2>
        <p>Si esta página cambia, la fecha de arriba cambia con ella. Para preguntas, use la <a href="https://v2stack.com/contact">página de contacto en v2stack.com</a>.</p>
      </section>
    </DocPage>
  );
}
