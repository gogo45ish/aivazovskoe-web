"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { strapiImageUnoptimized } from "@/lib/strapi";

interface Props {
  paragraphs: string[];
  label?: string;
  /** Optional scan/photo. Vertical 3:4. Falls back to a placeholder frame. */
  image?: string;
  alt?: string;
  /** Flip puts the image on the right. */
  flip?: boolean;
}

export default function CredentialRow({
  paragraphs,
  label,
  image,
  alt,
  flip,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduce) {
        gsap.set("[data-reveal]", { autoAlpha: 1, y: 0, clearProps: "filter" });
        return;
      }

      if (media.current) {
        gsap.fromTo(
          media.current,
          { yPercent: -10 },
          {
            yPercent: 10,
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
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        }
      );

      gsap.fromTo(
        "[data-frame]",
        { autoAlpha: 0, scale: 1.05, xPercent: flip ? 4 : -4 },
        {
          autoAlpha: 1,
          scale: 1,
          xPercent: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className={`grid items-center gap-10 md:gap-16 md:grid-cols-2 ${
        flip ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Media — vertical 3:4 */}
      <div className={flip ? "md:flex md:justify-end" : ""}>
        <div
          data-frame
          className="relative aspect-3/4 w-full max-w-[360px] overflow-hidden rounded-lg ring-1 ring-line/50 shadow-[0_30px_60px_-35px_rgba(30,45,36,0.5)] will-change-transform"
        >
          <div ref={media} className="absolute inset-x-0 -inset-y-[10%]">
            {image ? (
              <Image
                src={image}
                alt={alt ?? label ?? "Документ"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 360px"
                unoptimized={strapiImageUnoptimized(image)}
              />
            ) : (
              <PlaceholderImage
                className="absolute inset-0"
                label={label ?? "Скан документа"}
              />
            )}
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            data-reveal
            className="text-[15px] leading-[1.85] text-body"
            style={{ visibility: "hidden" }}
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
