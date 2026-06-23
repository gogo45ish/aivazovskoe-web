"use client";
import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function ParkHero({
  eyebrow,
  title,
  intro,
  image,
  facts = [],
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  /** Full-bleed background image. Falls back to a placeholder when absent. */
  image?: string;
  facts?: { value: string; label: string }[];
  children?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-hero-fade]", {
        autoAlpha: 0,
        y: 26,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.15,
      });
      gsap.to(media.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
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
      <div
        ref={media}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: "-12%", bottom: "-12%" }}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <PlaceholderImage className="absolute inset-0" dark label={title} />
        )}
      </div>
      <div className="scrim" />

      <div className="wrap relative z-10 pb-[clamp(48px,9vh,104px)] pt-35">
        <div data-hero-fade className="eyebrow">
          {eyebrow}
        </div>
        <h1
          data-hero-fade
          className="text-sand-100"
          style={{ fontSize: "clamp(38px, 5.6vw, 70px)", maxWidth: "760px" }}
        >
          {title}
        </h1>
        <p
          data-hero-fade
          className="text-sand-100/75"
          style={{
            fontSize: "clamp(15px, 1.7vw, 18px)",
            maxWidth: "520px",
            marginTop: "20px",
            lineHeight: 1.7,
          }}
        >
          {intro}
        </p>

        {facts.length > 0 && (
          <div
            data-hero-fade
            className="flex flex-wrap gap-x-10 gap-y-4 mt-8"
          >
            {facts.map((f) => (
              <div key={f.label}>
                <div className="font-serif text-brass text-[26px] leading-none">
                  {f.value}
                </div>
                <div className="text-sand-100/60 text-[13px] mt-1.5">{f.label}</div>
              </div>
            ))}
          </div>
        )}

        {children && (
          <div data-hero-fade className="flex flex-wrap gap-3 mt-9">
            {children}
          </div>
        )}
      </div>

      <div
        data-hero-cue
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden md:block w-px h-10 bg-linear-to-b from-brass to-transparent"
      />
    </section>
  );
}
