"use client";
import { useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import type { ReviewHighlight, ReviewAggregate } from "@/types";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import Reveal from "./ui/Reveal";

export default function Reviews({
  highlights,
  aggregate,
}: {
  highlights: ReviewHighlight[];
  aggregate: ReviewAggregate;
}) {
  const scoreRef = useRef<HTMLDivElement>(null);
  const [scoreInView, setScoreInView] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: scoreRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => setScoreInView(true),
    });
  }, { scope: scoreRef });

  return (
    <section className="section bg-sand-50" id="reviews">
      <div className="wrap">
        <Reveal className="flex justify-between items-end gap-4 mb-12">
          <div className="max-w-130">
            <div className="eyebrow">Отзывы гостей</div>
            <h2
              className="text-ink"
              style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}
            >
              Что говорят гости
            </h2>
            <p className="text-body text-[15px] mt-3 leading-[1.7]">
              Впечатления тех, кто уже провёл отпуск в «Айвазовском».
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-[0.85fr_1.7fr] gap-6 items-stretch">
          {/* Aggregate score card */}
          <Reveal className="h-full">
            <div
              ref={scoreRef}
              className="bg-green-900 rounded-lg p-8 flex flex-col justify-center h-full text-center shadow-[0_28px_55px_-30px_rgba(30,45,36,0.6)]"
            >
              <div className="font-serif text-sand-100 text-[64px] leading-none">
                <NumberFlow
                  value={scoreInView ? aggregate.score : 0}
                  locales="ru-RU"
                  format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                />
              </div>
              <div
                className="text-brass my-3"
                style={{ letterSpacing: "3px", fontSize: "18px" }}
              >
                ★★★★★
              </div>
              <div className="text-green-300 text-[12px] mb-6 leading-relaxed">
                на основе {aggregate.count} отзывов на {aggregate.source}
              </div>
              <a href="/reviews" className="btn">
                Все отзывы →
              </a>
            </div>
          </Reveal>

          {/* Quote cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {highlights.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.12} className="h-full">
                <div className="card-light relative p-7 flex flex-col h-full">
                  <span
                    className="font-serif text-brass/20 text-[72px] leading-none absolute top-4 right-5 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    &rdquo;
                  </span>
                  <div
                    className="text-brass mb-4"
                    style={{ letterSpacing: "2px", fontSize: "14px" }}
                  >
                    {"★".repeat(r.rating)}
                  </div>
                  <blockquote className="font-serif italic text-ink text-[17px] leading-[1.6] flex-1 relative z-10">
                    «{r.quote}»
                  </blockquote>
                  <cite className="text-muted text-[12px] not-italic mt-5 pt-4 border-t border-line">
                    {r.author} · {r.date}
                  </cite>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
