import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

/**
 * Minimal page header — solid forest-green band, no full-bleed image.
 * Mirrors the Rooms page hero. Dark so the transparent fixed nav stays legible.
 * Optional facts + CTA children render below the intro.
 */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  facts = [],
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  facts?: { value: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <header className="bg-green-900 pt-[clamp(140px,18vh,180px)] pb-16">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">{eyebrow}</div>
          <h1
            className="text-sand-100"
            style={{ fontSize: "clamp(34px, 5vw, 60px)", maxWidth: "780px" }}
          >
            {title}
          </h1>
          <p className="text-green-300 text-[16px] mt-5 max-w-150 leading-[1.7]">
            {intro}
          </p>

          {facts.length > 0 && (
            <div className="flex flex-wrap gap-x-10 gap-y-4 mt-8">
              {facts.map((f) => (
                <div key={f.label}>
                  <div className="font-serif text-brass text-[26px] leading-none">
                    {f.value}
                  </div>
                  <div className="text-green-300/70 text-[13px] mt-1.5">
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {children && (
            <div className="flex flex-wrap gap-3 mt-9">{children}</div>
          )}
        </Reveal>
      </div>
    </header>
  );
}
