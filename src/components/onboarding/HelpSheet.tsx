"use client";

import { Dialog } from "radix-ui";
import { ContactLinks } from "@/components/ui/Credits";
import { Disclosure } from "@/components/ui/Disclosure";
import { ArrowIcon, CloseIcon, ListIcon, SceneDesk } from "@/components/ui/icons";
import { more } from "@/data/strings/more";
import { setMode } from "@/lib/mode";
import { closeHelp, openWelcome, startDeskTour, useGuide } from "@/lib/onboarding";
import { links } from "@/lib/links";

const g = more.guide;
const h = g.helpSheet;

/** Help: the tours again, the video guide, short answers to the questions new buyers ask, and how to reach us. */
export function HelpSheet() {
  const { help } = useGuide();
  return (
    <Dialog.Root open={help} onOpenChange={(o) => !o && closeHelp()}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="qf help" aria-describedby={undefined}>
          <div className="sheet-head">
            <Dialog.Title className="sheet-title">{g.helpTitle}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={g.close}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>
          <section aria-labelledby="help-tours">
            <h3 id="help-tours" className="help-h">
              {h.tours}
            </h3>
            <ul className="help-tours">
              <li>
                <button type="button" onClick={openWelcome}>
                  <span className="help-ico" aria-hidden="true">
                    <ListIcon size={22} />
                  </span>
                  <span className="door-text">
                    <b>{h.welcome}</b>
                    <span>{h.welcomeSub}</span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMode("desk");
                    // The Desk is drawn after the switch, so the tour waits a moment to find its places.
                    setTimeout(startDeskTour, 350);
                  }}
                >
                  <span className="help-ico" aria-hidden="true">
                    <SceneDesk />
                  </span>
                  <span className="door-text">
                    <b>{h.desk}</b>
                    <span>{h.deskSub}</span>
                  </span>
                </button>
              </li>
              {links.youtube && (
                <li>
                  <a href={links.youtube} target="_blank" rel="noopener noreferrer">
                    <span className="help-ico" aria-hidden="true">
                      <ArrowIcon size={22} />
                    </span>
                    <span className="door-text">
                      <b>{h.video}</b>
                      <span>{h.videoSub}</span>
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </section>
          <section aria-labelledby="help-faq">
            <h3 id="help-faq" className="help-h">
              {h.faq}
            </h3>
            {h.faqs.map((f) => (
              <Disclosure key={f.q} title={f.q}>
                <p>{f.a}</p>
              </Disclosure>
            ))}
          </section>
          <section aria-labelledby="help-contact" className="help-contact">
            <h3 id="help-contact" className="help-h">
              {h.contactTitle}
            </h3>
            <p>{h.contactBody}</p>
            <ContactLinks />
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
