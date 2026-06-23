"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  IconCheck,
  IconPhone,
  IconCar,
  IconMaximize,
} from "@tabler/icons-react";
import { gsap, useGSAP } from "@/lib/gsap";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import LightboxWrapper from "@/components/ui/LightboxWrapper";
import RestaurantSchedule from "./RestaurantSchedule";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";
import type { Restaurant } from "@/types";

// Mosaic positions: a tall hero tile + two stacked tiles on the right.
const TILE_CLASS = [
  "col-span-2 md:col-span-7 md:row-span-2 aspect-4/3 md:aspect-auto",
  "col-span-1 md:col-span-5 aspect-square md:aspect-auto",
  "col-span-1 md:col-span-5 aspect-square md:aspect-auto",
];

export default function PoseidonShowcase({ r }: { r: Restaurant }) {
  const root = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState(false);
  const [index, setIndex] = useState(0);

  const images = r.images ?? [];
  const tiles = [0, 1, 2]; // always render three slots (placeholder if empty)
  const tel = r.phone ? `tel:${r.phone.replace(/[^+\d]/g, "")}` : undefined;

  const openAt = (i: number) => {
    if (!images.length) return;
    setIndex(Math.min(i, images.length - 1));
    setLightbox(true);
  };

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduce) {
        gsap.set("[data-head], [data-reveal]", {
          autoAlpha: 1,
          y: 0,
          clearProps: "filter",
        });
        gsap.set("[data-tile]", { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      // Heading + schedule reveal on their own trigger so they're never stuck
      // hidden when the section sits near the top of the viewport.
      gsap.fromTo(
        "[data-head]",
        { autoAlpha: 0, y: 26, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        }
      );

      // Per-tile parallax at varying intensity for depth.
      gsap.utils.toArray<HTMLElement>("[data-pimg]").forEach((el, i) => {
        const amt = 8 + i * 5;
        gsap.fromTo(
          el,
          { yPercent: -amt },
          {
            yPercent: amt,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      gsap.fromTo(
        "[data-tile]",
        { autoAlpha: 0, y: 40, scale: 1.04 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-gallery]", start: "top 80%" },
        }
      );

      gsap.fromTo(
        "[data-reveal]",
        { autoAlpha: 0, y: 26, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-content]", start: "top 78%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="posejdon" className="section bg-sand-50">
      <div className="wrap">
        {/* Heading */}
        <div className="max-w-160 mb-9">
          <div data-head className="eyebrow" style={{ visibility: "hidden" }}>
            Главный ресторан{r.kind ? ` · ${r.kind}` : ""}
          </div>
          <h2
            data-head
            className="text-ink font-serif leading-tight"
            style={{ fontSize: "clamp(30px, 4.2vw, 52px)", visibility: "hidden" }}
          >
            {r.name}
          </h2>
          <div data-head style={{ visibility: "hidden" }}>
            <RestaurantSchedule restaurant={r} />
          </div>
        </div>

        {/* Mosaic gallery */}
        <div
          data-gallery
          className="grid grid-cols-2 md:grid-cols-12 md:grid-rows-2 gap-3 md:gap-4 md:h-[clamp(420px,50vw,580px)]"
        >
          {tiles.map((i) => {
            const im = images[i];
            const src = strapiImageUrl(im?.url);
            return (
              <button
                key={i}
                type="button"
                data-tile
                onClick={() => openAt(i)}
                disabled={!src}
                aria-label={src ? "Открыть фото на весь экран" : undefined}
                className={`group relative overflow-hidden rounded-lg ring-1 ring-line/40 ${
                  src ? "cursor-pointer" : "cursor-default"
                } ${TILE_CLASS[i]}`}
                style={{ visibility: "hidden" }}
              >
                <div className="absolute inset-x-0 -inset-y-[10%]" data-pimg>
                  {src ? (
                    <Image
                      src={src}
                      alt={im?.alternativeText ?? r.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes={i === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 50vw, 42vw"}
                      unoptimized={strapiImageUnoptimized(src)}
                    />
                  ) : (
                    <PlaceholderImage
                      className="absolute inset-0"
                      label={`${r.name} — фото ${i + 1}`}
                    />
                  )}
                </div>
                {src ? (
                  <span className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-green-900/70 text-sand-100 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <IconMaximize size={16} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          data-content
          className="mt-12 grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16 items-start"
        >
          {/* Left — lead + transfer + CTAs */}
          <div>
            {r.paragraphs.map((p, j) => (
              <p
                key={j}
                data-reveal
                className="text-body text-[16px] leading-[1.85]"
                style={{ visibility: "hidden" }}
              >
                {p}
              </p>
            ))}

            {r.transferNote ? (
              <div
                data-reveal
                className="mt-6 flex gap-3 items-start rounded-lg bg-sand-100 p-5"
                style={{ visibility: "hidden" }}
              >
                <IconCar size={20} className="text-brass shrink-0 mt-0.5" />
                <p className="text-body text-[14px] leading-[1.7]">
                  {r.transferNote}
                </p>
              </div>
            ) : null}

            <div data-reveal className="mt-7 flex flex-wrap gap-3" style={{ visibility: "hidden" }}>
              {r.menuUrl ? (
                <a href={r.menuUrl} className="btn">
                  Посмотреть меню
                </a>
              ) : null}
              <a href="/#booking" className="btn-out">
                Забронировать отдых в санатории
              </a>
            </div>

            {(r.phone || r.bookingNote) && (
              <div
                data-reveal
                className="mt-7 pt-6 border-t border-line"
                style={{ visibility: "hidden" }}
              >
                {r.bookingNote ? (
                  <p className="text-muted text-[14px] leading-[1.7] mb-3">
                    {r.bookingNote}
                  </p>
                ) : null}
                {r.phone ? (
                  <a
                    href={tel}
                    className="inline-flex items-center gap-2 font-serif text-ink text-[22px] hover:text-brass transition-colors"
                  >
                    <IconPhone size={20} className="text-brass" />
                    {r.phone}
                  </a>
                ) : null}
              </div>
            )}
          </div>

          {/* Right — features card */}
          {r.features?.length ? (
            <div
              data-reveal
              className="card-light p-7 lg:sticky lg:top-28"
              style={{ visibility: "hidden" }}
            >
              {r.featuresIntro ? (
                <div className="font-serif text-ink text-[19px] mb-5">
                  {r.featuresIntro}
                </div>
              ) : null}
              <ul className="space-y-3.5">
                {r.features.map((f, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <IconCheck size={18} className="text-brass shrink-0 mt-0.5" />
                    <span className="text-body text-[14px] leading-[1.6]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {lightbox && images.length ? (
        <LightboxWrapper
          open={lightbox}
          close={() => setLightbox(false)}
          index={index}
          slides={images.map((im) => ({ src: strapiImageUrl(im.url)! }))}
          on={{ view: ({ index: i }) => setIndex(i) }}
        />
      ) : null}
    </section>
  );
}
