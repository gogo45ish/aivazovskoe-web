"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import ResponsiveVideo from "./ResponsiveVideo";

interface ParallaxBandProps {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  /** Optional autoplaying background video. `src` is used as its poster. */
  videoSrc?: string;
  /** Tailwind height class, e.g. "h-[72vh]". */
  heightClass?: string;
}

export default function ParallaxBand({
  src,
  alt,
  eyebrow,
  title,
  videoSrc,
  heightClass = "h-[72vh]",
}: ParallaxBandProps) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Video autoplay / mobile + reduced-motion fallback is owned by
      // <ResponsiveVideo>; here we only drive the scroll parallax + text reveal.
      if (reduce) return;

      gsap.fromTo(
        media.current,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.from("[data-band-text]", {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={`relative overflow-hidden ${heightClass}`}>
      {/* Parallax media layer — extends past edges to absorb drift */}
      <div
        ref={media}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: "-15%", bottom: "-15%" }}
      >
        {videoSrc ? (
          // Decorative background video — lazy so only the in-view band decodes;
          // mobile / reduced-motion get the poster image instead.
          <ResponsiveVideo
            className="absolute inset-0"
            videoSrc={videoSrc}
            posterSrc={src}
            alt={alt}
            sizes="100vw"
            lazy
          />
        ) : (
          <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
        )}
      </div>
      <div className="absolute inset-0 bg-green-900/45" />

      <div className="relative z-10 h-full wrap flex flex-col justify-center">
        <div data-band-text className="eyebrow">
          {eyebrow}
        </div>
        <h2
          data-band-text
          className="text-sand-100 max-w-160"
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
        >
          {title}
        </h2>
      </div>
    </section>
  );
}
