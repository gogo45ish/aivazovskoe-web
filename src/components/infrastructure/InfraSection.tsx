"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";
import type { InfrastructureItem } from "@/types";

interface Props {
  item: InfrastructureItem;
  index: number;
  total: number;
  /** Dark section gets forest-green background + light text. */
  dark?: boolean;
}

export default function InfraSection({ item, index, total, dark }: Props) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const src = strapiImageUrl(item.image?.url);
  const flip = index % 2 === 1; // alternate image side

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduce) {
        gsap.set("[data-reveal]", { autoAlpha: 1, y: 0, clearProps: "filter" });
        return;
      }

      // Parallax drift on the image as the section scrolls through the viewport.
      if (media.current) {
        gsap.fromTo(
          media.current,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Staggered reveal of the text column.
      gsap.fromTo(
        "[data-reveal]",
        { autoAlpha: 0, y: 28, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        }
      );

      // Image frame slides/scales in.
      gsap.fromTo(
        "[data-frame]",
        { autoAlpha: 0, scale: 1.06, xPercent: flip ? 4 : -4 },
        {
          autoAlpha: 1,
          scale: 1,
          xPercent: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className={`section ${dark ? "bg-green-900" : "bg-sand-50"}`}
    >
      <div className="wrap">
        <div
          className={`grid items-center gap-10 lg:gap-16 md:grid-cols-2 ${
            flip ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Media */}
          <div
            data-frame
            className="relative aspect-4/3 overflow-hidden rounded-lg ring-1 ring-line/40 shadow-[0_30px_60px_-35px_rgba(30,45,36,0.5)] will-change-transform"
          >
            <div ref={media} className="absolute inset-x-0 -inset-y-[12%]">
              {src ? (
                <Image
                  src={src}
                  alt={item.image?.alternativeText ?? item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={strapiImageUnoptimized(src)}
                />
              ) : (
                <PlaceholderImage
                  className="absolute inset-0"
                  label={item.title}
                  dark={dark}
                />
              )}
            </div>
          </div>

          {/* Text */}
          <div>
            <div
              data-reveal
              className="eyebrow flex items-center gap-3"
              style={{ visibility: "hidden" }}
            >
              <span className="text-brass">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-brass/50" />
              <span className={dark ? "text-green-300" : "text-muted"}>
                {String(total).padStart(2, "0")}
              </span>
            </div>

            <h2
              data-reveal
              className={`mt-4 font-serif leading-tight ${
                dark ? "text-sand-100" : "text-ink"
              }`}
              style={{ fontSize: "clamp(26px, 3.4vw, 40px)", visibility: "hidden" }}
            >
              {item.title}
            </h2>

            <div className="mt-5 space-y-3.5">
              {item.paragraphs.map((p, j) => (
                <p
                  key={j}
                  data-reveal
                  className={`text-[15px] leading-[1.85] ${
                    dark ? "text-green-300" : "text-body"
                  }`}
                  style={{ visibility: "hidden" }}
                >
                  {p}
                </p>
              ))}
            </div>

            {item.href ? (
              <a
                data-reveal
                href={item.href}
                className={`${dark ? "btn" : "btn-out"} mt-7 self-start`}
                style={{ visibility: "hidden" }}
              >
                Подробнее
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
