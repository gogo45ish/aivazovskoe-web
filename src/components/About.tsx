"use client";
import { useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import {
  Waves,
  Dumbbell,
  Clapperboard,
  Library,
  Compass,
  HeartHandshake,
  Camera,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import PlaceholderImage from "./ui/PlaceholderImage";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";
import type { StrapiImage } from "@/types";

const stats = [
  { value: 50, suffix: "+", lab: "комфортных номеров" },
  { value: 7, suffix: "", lab: "ресторанов и кафе" },
  { value: 24, suffix: " га", lab: "площадь парка" },
  { value: 900, suffix: " м", lab: "протяжённость пляжа" },
];

const facilities = [
  { Icon: Waves, label: "Бассейн" },
  { Icon: Dumbbell, label: "Спортивный комплекс" },
  { Icon: Clapperboard, label: "Кинотеатр" },
  { Icon: Library, label: "Библиотека" },
  { Icon: Compass, label: "Экскурсии" },
  { Icon: HeartHandshake, label: "Свадьбы и церемонии" },
  { Icon: Camera, label: "Фото-туры" },
  { Icon: Sparkles, label: "Анимация" },
];

export default function About({ aboutImage }: { aboutImage?: StrapiImage }) {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const [countStart, setCountStart] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!reduce) {
        // Text + block reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 20,
            filter: "blur(5px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        // Facility tiles — staggered
        gsap.from("[data-facility]", {
          autoAlpha: 0,
          y: 18,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-facilities]", start: "top 80%" },
        });

        // Park photo parallax
        gsap.fromTo(
          photo.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: photo.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Count-up trigger (NumberFlow handles the number animation)
      ScrollTrigger.create({
        trigger: "[data-stats]",
        start: "top 80%",
        once: true,
        onEnter: () => setCountStart(true),
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section bg-sand-50" id="about">
      <div className="wrap max-w-350 grid md:grid-cols-[1.1fr_1fr] gap-14 items-stretch">
        <div>
          <div data-reveal>
            <div className="eyebrow">О месте</div>
            <h2
              className="text-ink"
              style={{ fontSize: "clamp(28px, 3.6vw, 40px)", maxWidth: "440px" }}
            >
              Море, парк и тишина — в одном месте
            </h2>
            <p className="text-body text-[15px] mt-4 mb-9 max-w-110 leading-[1.7]">
              25 гектаров парка-памятника между горой Аю-Даг и мысом Плака.
              Реликтовые растения, старинная масличная роща и берег Чёрного моря
              — для отдыха круглый год.
            </p>
          </div>

          {/* Animated stats — separated by hairline dividers */}
          <div
            data-stats
            data-reveal
            className="grid grid-cols-2 md:grid-cols-4 gap-y-7 mb-9 border-y border-line py-7"
          >
            {stats.map((s) => (
              <div
                key={s.lab}
                className="md:px-5 md:not-last:border-r md:border-line md:first:pl-0"
              >
                <div className="font-serif text-brass text-[clamp(32px,3.4vw,42px)] leading-none">
                  <NumberFlow
                    value={countStart ? s.value : 0}
                    locales="ru-RU"
                    suffix={s.suffix}
                  />
                </div>
                <div className="text-[13px] text-muted mt-2.5 leading-snug">
                  {s.lab}
                </div>
              </div>
            ))}
          </div>

          {/* Facility icons */}
          <div
            data-facilities
            className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mb-8"
          >
            {facilities.map(({ Icon, label }) => (
              <div
                key={label}
                data-facility
                className="group flex flex-col items-center text-center"
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full border border-line text-green-700 transition-colors duration-300 group-hover:border-brass group-hover:text-brass">
                  <Icon size={26} strokeWidth={1.5} />
                </span>
                <span className="block text-[13px] text-body mt-3 leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div data-reveal>
            <a href="#" className="link-arrow">
              Подробнее →
            </a>
          </div>
        </div>

        {/* Park photo with subtle parallax */}
        <div className="relative rounded-lg overflow-hidden min-h-110 ring-1 ring-black/5 shadow-[0_30px_70px_-40px_rgba(30,45,36,0.5)]">
          {aboutImage ? (
            <div
              ref={photo}
              className="absolute inset-x-0 will-change-transform"
              style={{ top: "-10%", bottom: "-10%" }}
            >
              <Image
                src={strapiImageUrl(aboutImage.url)!}
                alt={aboutImage.alternativeText ?? "фото парка"}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 42vw"
                unoptimized={strapiImageUnoptimized(strapiImageUrl(aboutImage.url))}
              />
            </div>
          ) : (
            <PlaceholderImage
              label="фото парка"
              className="absolute inset-0 rounded-lg"
            />
          )}

          {/* Caption overlay */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-green-900/80 to-transparent p-6 pt-16">
            <div className="rule w-10 mb-3" />
            <div className="font-serif text-sand-100 text-[18px] leading-tight">
              Парк-памятник садово-паркового искусства
            </div>
            <div className="text-sand-100/70 text-[13px] mt-1">
              Партенит, Южный берег Крыма
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
