"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { strapiImageUnoptimized } from "@/lib/strapi";

/** Default desktop cutoff. Change to 1024 here (or per call site) to load the
 *  video only on wider screens. */
const DESKTOP_MIN_WIDTH = 768;

interface ResponsiveVideoProps {
  /** Video URL (mp4). Fed from Strapi data — never hardcoded at call sites. */
  videoSrc: string;
  /** Poster / fallback image URL. Used three ways: shown alone on mobile and
   *  for reduced-motion, and as the <video>'s own poster on desktop so the
   *  frame paints instantly while the video buffers. */
  posterSrc: string;
  alt: string;
  /** Wrapper classes. The caller positions the box; it must establish a
   *  positioning context (e.g. "absolute inset-0") for the fill image/video. */
  className?: string;
  /** next/image `sizes` for the poster. Full-bleed by default. */
  sizes?: string;
  /** Viewport width (px) at/above which the video may load. Defaults to 768. */
  desktopMinWidth?: number;
  /** Defer mounting the <video> until the box nears the viewport and unmount it
   *  once it leaves — so at most the in-view video is ever decoding. */
  lazy?: boolean;
  /** Preload the poster as the LCP image (above-the-fold hero only). */
  preload?: boolean;
}

export default function ResponsiveVideo({
  videoSrc,
  posterSrc,
  alt,
  className,
  sizes = "100vw",
  desktopMinWidth = DESKTOP_MIN_WIDTH,
  lazy = false,
  preload = false,
}: ResponsiveVideoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  // Render the IMAGE branch on the server and on the first client paint, so the
  // SSR HTML carries no <video> tag and no video URL (mobile never fetches it,
  // and there's no hydration mismatch). The <video> is opted in only after the
  // effect below decides the viewport is desktop + motion-allowed.
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const desktopMq = window.matchMedia(`(min-width: ${desktopMinWidth}px)`);
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    // Re-run on resize/rotation and on reduced-motion changes.
    const evaluate = () => {
      observer?.disconnect();
      observer = null;

      const allowed = desktopMq.matches && !reduceMq.matches;
      if (!allowed) {
        setShowVideo(false);
        return;
      }
      if (!lazy) {
        setShowVideo(true);
        return;
      }
      // Lazy: mount only while near the viewport; unmount when it leaves.
      const el = wrap.current;
      if (!el) return;
      observer = new IntersectionObserver(
        ([entry]) => setShowVideo(entry.isIntersecting),
        { rootMargin: "200px 0px" }
      );
      observer.observe(el);
    };

    evaluate();
    desktopMq.addEventListener("change", evaluate);
    reduceMq.addEventListener("change", evaluate);
    return () => {
      observer?.disconnect();
      desktopMq.removeEventListener("change", evaluate);
      reduceMq.removeEventListener("change", evaluate);
    };
  }, [desktopMinWidth, lazy]);

  return (
    <div ref={wrap} className={className}>
      {/* Guard empty/missing sources: next/image errors on src="" and an empty
          <source> is pointless. A missing poster just shows the parent bg. */}
      {posterSrc && (
        <Image
          src={posterSrc}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          preload={preload}
          unoptimized={strapiImageUnoptimized(posterSrc)}
        />
      )}
      {showVideo && videoSrc && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc || undefined}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
