"use client";

import { useEffect, useState, useCallback } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import Reveal from "./ui/Reveal";
import type { StrapiImage } from "@/types";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";

const AUTOPLAY_SECS = 4;
const GAP = 16;

function calcSlideW(): number {
  if (typeof window === "undefined") return 520;
  const vw = window.innerWidth;
  if (vw < 560) return Math.round(vw * 0.82);
  if (vw < 900) return Math.round(vw * 0.52);
  return Math.min(Math.round(vw * 0.42), 560);
}

const spring = { type: "spring" as const, stiffness: 300, damping: 40 };

export default function Gallery({ images }: { images: StrapiImage[] }) {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Start at 520 to match SSR; corrected on client in first useEffect
  const [slideW, setSlideW] = useState(520);

  const x = useMotionValue(0);
  const progress = useMotionValue(0);

  const photos = images
    .filter((img) => img.url && img.width && img.height)
    .map((img) => ({
      src: strapiImageUrl(img.url)!,
      width: img.width,
      height: img.height,
      alt: img.alternativeText ?? "",
    }));

  const count = photos.length;
  const stride = slideW + GAP;

  // Measure on mount + resize. The initial set intentionally corrects the
  // SSR-deterministic 520 to the real viewport width after hydration — doing it
  // any earlier (render/lazy init) would cause a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlideW(calcSlideW());
    const onResize = () => setSlideW(calcSlideW());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Snap x immediately when slide width changes (no spring — resize should be instant)
  useEffect(() => {
    x.set(-(index * stride));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideW]);

  // Autoplay + progress bar
  useEffect(() => {
    if (paused || prefersReduced) return;

    progress.set(0);
    const ctrl = animate(progress, 1, {
      duration: AUTOPLAY_SECS,
      ease: "linear",
      onComplete() {
        progress.set(0);
        const next = (index + 1) % count;
        animate(x, -(next * stride), spring);
        setIndex(next);
      },
    });

    return () => ctrl.stop();
    // x/progress are stable MotionValue refs — omitting avoids spurious restarts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, prefersReduced, count, stride]);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(i, count - 1));
      setIndex(next);
      animate(x, -(next * stride), spring);
    },
    [count, stride, x]
  );

  const onDragEnd = useCallback(
    (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      const threshold = slideW * 0.25;
      if (info.offset.x < -threshold && index < count - 1) {
        const next = index + 1;
        setIndex(next);
        animate(x, -(next * stride), spring);
      } else if (info.offset.x > threshold && index > 0) {
        const prev = index - 1;
        setIndex(prev);
        animate(x, -(prev * stride), spring);
      } else {
        // Snap back to current — progress keeps running
        animate(x, -(index * stride), spring);
      }
    },
    [index, count, slideW, stride, x]
  );

  if (!count) return null;

  return (
    <section className="section bg-green-900" id="gallery">
      {/* Header */}
      <div className="wrap">
        <Reveal className="flex justify-between items-end gap-4 mb-12">
          <div className="max-w-130">
            <div className="eyebrow">Фотогалерея</div>
            <h2
              className="text-sand-100"
              style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}
            >
              Жизнь курорта
            </h2>
            <p className="text-green-300 text-[15px] mt-3 leading-[1.7]">
              Море, парк, бассейны и спа — пролистайте, чтобы заглянуть внутрь.
            </p>
          </div>

          <div className="flex items-center gap-4 pb-1">
            {/* Pill-dot indicators */}
            <div className="hidden sm:flex items-center gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Слайд ${i + 1}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === index
                      ? "w-4.5 h-1.5 bg-brass"
                      : "w-1.5 h-1.5 bg-green-700 hover:bg-green-500"
                  }`}
                />
              ))}
            </div>

            {/* Prev / next arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Предыдущий слайд"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-green-700 text-sand-100 transition-colors duration-200 hover:border-brass hover:text-brass disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <IconChevronLeft size={20} />
              </button>
              <button
                onClick={() => goTo(index + 1)}
                disabled={index === count - 1}
                aria-label="Следующий слайд"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-green-700 text-sand-100 transition-colors duration-200 hover:border-brass hover:text-brass disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <IconChevronRight size={20} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Carousel track — bleeds right but starts flush with .wrap left edge */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex cursor-grab active:cursor-grabbing select-none"
          style={{
            x,
            gap: GAP,
            paddingLeft: "max(28px, calc((100vw - 1200px) / 2 + 28px))",
            paddingRight: 28,
          }}
          drag="x"
          dragConstraints={{ left: -((count - 1) * stride), right: 0 }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={onDragEnd}
        >
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className="shrink-0 rounded-xl overflow-hidden"
              style={{ width: slideW, aspectRatio: "16 / 10" }}
              animate={{
                opacity: i === index ? 1 : 0.5,
                scale: i === index ? 1 : 0.95,
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-full object-cover pointer-events-none"
                unoptimized={strapiImageUnoptimized(photo.src)}
                draggable={false}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="wrap mt-5">
        <div className="h-[3px] bg-green-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brass origin-left"
            style={{ scaleX: progress }}
          />
        </div>
      </div>
    </section>
  );
}
