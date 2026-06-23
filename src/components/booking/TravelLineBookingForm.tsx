"use client";

import { useEffect, useRef } from "react";

const TL_INTEGRATION_ID = "TL-INT-ajvazovskoe-rf_2025-02-06";

// Host-fallback chain — kept verbatim from the TravelLine snippet.
const TL_HOSTS = [
  "ru-ibe.tlintegration.ru",
  "ibe.tlintegration.ru",
  "ibe.tlintegration.com",
];

type TlCommand = unknown[];

interface TlIntegration {
  __cq?: TlCommand[];
  __loader?: boolean;
}

interface TlWindow extends Window {
  TL?: unknown;
  travelline?: { integration?: TlIntegration };
}

/**
 * Mounts the TravelLine booking-form widget. The widget reads its booking
 * parameters straight from `window.location.search`, so a hard load of
 * `/booking?…` pre-fills dates/occupancy/room with no React state involved.
 *
 * Ports the vanilla TL head snippet: a single `booking-form` embed (the
 * original `search-form` embed is omitted — there is no `tl-search-form`
 * container on this page) plus the recursive multi-host loader injector,
 * guarded so it injects once per session.
 */
export default function TravelLineBookingForm() {
  // Guard against React Strict-Mode double-invocation in dev so the embed
  // command isn't pushed onto the queue twice.
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    const w = window as TlWindow;

    const q: TlCommand[] = [
      ["setContext", TL_INTEGRATION_ID, "ru"],
      ["embed", "booking-form", { container: "tl-booking-form" }],
    ];

    const t = (w.travelline = w.travelline || {});
    const ti = (t.integration = t.integration || {});
    ti.__cq = ti.__cq ? ti.__cq.concat(q) : q;

    if (ti.__loader) return;
    ti.__loader = true;

    const d = w.document;
    const c =
      d.getElementsByTagName("head")[0] || d.getElementsByTagName("body")[0];

    function onSettled(s: HTMLScriptElement, next: () => void) {
      return function () {
        if (!w.TL) {
          c.removeChild(s);
          next();
        }
      };
    }

    (function load(hosts: string[]) {
      if (hosts.length === 0) return;
      const s = d.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://" + hosts[0] + "/integration/loader.js";
      s.onerror = s.onload = onSettled(s, function () {
        load(hosts.slice(1));
      });
      c.appendChild(s);
    })(TL_HOSTS);
  }, []);

  // Always rendered (empty, server-renderable) — never gated on client-only
  // state, so there's no hydration mismatch. Sizing per the TL spec via
  // Tailwind utilities (full width, max 1200px, centered, z-index 0).
  return <div id="tl-booking-form" className="w-full max-w-[1200px] mx-auto relative z-0" />;
}
