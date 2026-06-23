"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

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
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Autoplay the muted background video — but not for reduced-motion users,
      // who keep the static poster frame instead.
      if (video.current && !reduce) {
        video.current.play().catch(() => {});
      }

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
          <video
            ref={video}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            poster={src}
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
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
