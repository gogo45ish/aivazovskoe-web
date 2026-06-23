"use client";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import Image from "next/image";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { CarouselBlock as CarouselBlockType } from "@/types";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

// One slide at a time with drag + arrows + dots, matching the site's other
// carousels (RoomGallery / SeasonsCarousel). Respects prefers-reduced-motion.
export default function CarouselBlock({ block }: { block: CarouselBlockType }) {
  const reduce = useReducedMotion();
  const slides = (block.slides ?? []).filter((s) =>
    strapiImageUrl(s.image?.url)
  );
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const count = slides.length;

  if (count === 0) return null;

  const paginate = (d: number) => setState([(index + d + count) % count, d]);
  const goTo = (i: number) => setState([i, i > index ? 1 : -1]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) paginate(1);
    else if (info.offset.x > 80 || info.velocity.x > 500) paginate(-1);
  };

  const variants = {
    enter: (d: number) => ({ x: reduce ? 0 : d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduce ? 0 : d > 0 ? -80 : 80, opacity: 0 }),
  };

  const current = slides[index];
  const src = strapiImageUrl(current.image?.url)!;

  return (
    <div className="wrap">
      <div className="relative aspect-16/10 sm:aspect-16/9 rounded-lg overflow-hidden bg-green-800 ring-1 ring-black/10 shadow-[0_30px_70px_-40px_rgba(30,45,36,0.5)]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.45, ease },
              opacity: { duration: 0.3 },
            }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={src}
              alt={current.image?.alternativeText ?? current.caption ?? ""}
              fill
              className="object-cover pointer-events-none select-none"
              sizes="(max-width: 1024px) 100vw, 1100px"
              unoptimized={strapiImageUnoptimized(src)}
              draggable={false}
            />
            {current.caption && (
              <>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-green-900/85 to-transparent pointer-events-none" />
                <p className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8 text-sand-100 text-[15px] md:text-[17px] max-w-2xl leading-[1.5]">
                  {current.caption}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Предыдущий слайд"
              className="absolute top-1/2 left-4 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-green-900/60 text-sand-100 backdrop-blur-sm transition-colors hover:bg-green-900 hover:text-brass cursor-pointer"
            >
              <IconChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Следующий слайд"
              className="absolute top-1/2 right-4 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-green-900/60 text-sand-100 backdrop-blur-sm transition-colors hover:bg-green-900 hover:text-brass cursor-pointer"
            >
              <IconChevronRight size={22} />
            </button>

            {/* Dot indicators */}
            <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Слайд ${i + 1}`}
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
    </div>
  );
}
