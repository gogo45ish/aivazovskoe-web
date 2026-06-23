"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import PlaceholderImage from "../ui/PlaceholderImage";
import type { SeasonalEvent } from "@/types";

const INTERVAL = 6000; // slow auto-advance

export default function SeasonsCarousel({
  seasons,
}: {
  seasons: SeasonalEvent[];
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = seasons.length;

  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(t);
  }, [reduce, paused, count]);

  if (!count) return null;
  const s = seasons[index];

  return (
    <div
      className="relative aspect-16/10 sm:aspect-16/9 md:aspect-21/9 rounded-lg overflow-hidden ring-1 ring-black/10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: "easeInOut" }}
        >
          {s.image ? (
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.04 }}
              animate={reduce ? undefined : { scale: 1.16 }}
              transition={{ duration: INTERVAL / 1000 + 2, ease: "linear" }}
            >
              <Image
                src={s.image}
                alt={`${s.season} — ${s.term}`}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 1100px"
                priority={index === 0}
              />
            </motion.div>
          ) : (
            <PlaceholderImage className="absolute inset-0" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-green-900/90 via-green-900/35 to-green-900/10" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-7 md:p-12">
            <div className="eyebrow">{s.season}</div>
            <div className="font-serif text-brass leading-none text-[clamp(38px,6vw,80px)]">
              {s.term}
            </div>
            <p className="text-sand-100/85 text-[15px] md:text-[17px] mt-4 max-w-xl leading-[1.6]">
              {s.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Предыдущий сезон"
            className="absolute top-1/2 left-4 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-green-900/60 text-sand-100 backdrop-blur-sm transition-colors hover:bg-green-900 hover:text-brass cursor-pointer"
          >
            <IconChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Следующий сезон"
            className="absolute top-1/2 right-4 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-green-900/60 text-sand-100 backdrop-blur-sm transition-colors hover:bg-green-900 hover:text-brass cursor-pointer"
          >
            <IconChevronRight size={22} />
          </button>

          <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5">
            {seasons.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Сезон ${i + 1}`}
                aria-current={i === index}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === index
                    ? "w-5 h-1.5 bg-brass"
                    : "w-1.5 h-1.5 bg-sand-100/40 hover:bg-sand-100/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
