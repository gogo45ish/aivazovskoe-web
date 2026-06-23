"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { HomeHero } from "@/types";
import BookingBar from "./ui/BookingBar";

export default function Hero({ hero }: { hero: HomeHero }) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Entrance — staggered rise on load
      gsap.from("[data-hero-fade]", {
        autoAlpha: 0,
        y: 22,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        delay: 0.15,
      });

      // Scrubbed parallax — video drifts slower than the scroll
      gsap.to(media.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Scroll cue pulse
      gsap.to("[data-hero-cue]", {
        scaleY: 0.35,
        transformOrigin: "top",
        repeat: -1,
        yoyo: true,
        duration: 1.1,
        ease: "sine.inOut",
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-green-900"
    >
      {/* Parallax layer — extends above/below to absorb drift */}
      <div
        ref={media}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: "-10%", bottom: "-10%" }}
      >
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={hero.posterUrl || undefined}
        >
          <source src={hero.videoUrl} type="video/mp4" />
        </video>
        {hero.posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.posterUrl}
            alt=""
            className="hero-poster hidden absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      <div className="scrim" />

      <div className="wrap relative z-10 pb-[clamp(48px,9vh,104px)] pt-35">
        <div data-hero-fade className="eyebrow">
          {hero.eyebrow}
        </div>
        <h1
          data-hero-fade
          className="text-sand-100"
          style={{ fontSize: "clamp(38px, 5.6vw, 70px)", maxWidth: "860px" }}
        >
          {hero.heading}
        </h1>
        <p
          data-hero-fade
          className="font-serif italic text-sand-100/90"
          style={{
            fontSize: "clamp(17px, 2vw, 23px)",
            maxWidth: "560px",
            marginTop: "16px",
            lineHeight: 1.4,
          }}
        >
          Здесь начинается ваша история отдыха.
        </p>
        <p
          data-hero-fade
          className="text-sand-100/70"
          style={{
            fontSize: "clamp(15px, 1.7vw, 18px)",
            maxWidth: "480px",
            marginTop: "18px",
            lineHeight: 1.65,
          }}
        >
          {hero.sub}
        </p>
        <div data-hero-fade style={{ marginTop: "36px" }}>
          <BookingBar />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-cue
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden md:block w-px h-10 bg-linear-to-b from-brass to-transparent"
      />
    </section>
  );
}
