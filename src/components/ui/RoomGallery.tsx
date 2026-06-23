"use client";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import Image from "next/image";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize,
} from "@tabler/icons-react";
import LightboxWrapper from "./LightboxWrapper";
import PlaceholderImage from "./PlaceholderImage";
import type { StrapiImage } from "@/types";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function RoomGallery({
  images,
  alt,
}: {
  images: StrapiImage[];
  alt: string;
}) {
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;

  if (!count) {
    return (
      <PlaceholderImage
        label="фото номера"
        className="aspect-[3/2] w-full rounded-lg"
      />
    );
  }

  const src = (img: StrapiImage) => strapiImageUrl(img.url)!;
  const paginate = (d: number) =>
    setState([(index + d + count) % count, d]);
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

  const current = images[index];

  return (
    <div>
      {/* Main viewport */}
      <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-green-800 ring-1 ring-black/5 shadow-[0_30px_70px_-40px_rgba(30,45,36,0.5)]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { duration: 0.45, ease }, opacity: { duration: 0.3 } }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={src(current)}
              alt={current.alternativeText ?? alt}
              fill
              priority
              className="object-cover pointer-events-none select-none"
              sizes="(max-width: 900px) 100vw, 60vw"
              unoptimized={strapiImageUnoptimized(src(current))}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Expand */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Открыть на весь экран"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-green-900/70 text-sand-100 backdrop-blur-sm transition-colors hover:bg-green-900 hover:text-brass cursor-pointer"
        >
          <IconMaximize size={18} />
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Предыдущее фото"
              className="absolute top-1/2 left-4 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-green-900/70 text-sand-100 backdrop-blur-sm transition-colors hover:bg-green-900 hover:text-brass cursor-pointer"
            >
              <IconChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Следующее фото"
              className="absolute top-1/2 right-4 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-green-900/70 text-sand-100 backdrop-blur-sm transition-colors hover:bg-green-900 hover:text-brass cursor-pointer"
            >
              <IconChevronRight size={22} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 z-10 bg-green-900/70 text-sand-100 text-[12px] tracking-[0.05em] px-3 py-1 rounded-full backdrop-blur-sm">
              {index + 1} / {count}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Фото ${i + 1}`}
              aria-current={i === index}
              className={`relative aspect-[4/3] flex-1 max-w-28 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                i === index
                  ? "ring-2 ring-brass ring-offset-2 ring-offset-sand-50"
                  : "opacity-65 hover:opacity-100"
              }`}
            >
              <Image
                src={src(img)}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
                unoptimized={strapiImageUnoptimized(src(img))}
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <LightboxWrapper
          open={lightbox}
          close={() => setLightbox(false)}
          index={index}
          slides={images.map((img) => ({ src: src(img) }))}
          on={{ view: ({ index: i }) => setState([i, 0]) }}
        />
      )}
    </div>
  );
}
