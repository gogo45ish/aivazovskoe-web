"use client";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

// Routes that opt out of Lenis. The TravelLine booking widget runs its own
// position watcher for its calendar/popovers; Lenis's transform-based virtual
// scroll desyncs from window.scrollY and trips TL's "Position watcher mismatch".
const NO_SMOOTH_SCROLL = ["/booking"];

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<LenisRef>(null);
  const disabled =
    prefersReduced || NO_SMOOTH_SCROLL.some((p) => pathname?.startsWith(p));

  // Lenis self-drives its RAF (autoRaf default). We only keep ScrollTrigger in
  // sync with the smoothed scroll position so scrubbed/triggered animations
  // track Lenis instead of the native scrollbar.
  useGSAP(
    () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return; // disabled path (reduced-motion / opt-out route) renders no Lenis
      lenis.on("scroll", ScrollTrigger.update);
      return () => lenis.off("scroll", ScrollTrigger.update);
    },
    { dependencies: [disabled] }
  );

  if (disabled) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2 }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
