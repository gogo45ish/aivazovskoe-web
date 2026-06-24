"use client";
import { useEffect, useState } from "react";

/** Desktop cutoff — excludes phones and tablets. Change here to adjust. */
const DESKTOP_MIN_WIDTH = 1024;

export default function Booking() {
  // The 360crimea booking widget is a heavy interactive iframe, so it's mounted
  // on desktop only — never on mobile/tablet, where it isn't rendered at all
  // (not just CSS-hidden, so it never loads). Starts false so SSR + first paint
  // render nothing → no hydration mismatch.
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!desktop) return null;

  return (
    <section id="booking">
      <iframe
        src="https://files.360crimea.ru/boofer/aivazovskoe/"
        title="Бронирование — Санаторий «Айвазовское»"
        width="100%"
        height="700"
        className="block border-0 w-full"
        loading="lazy"
      />
    </section>
  );
}
