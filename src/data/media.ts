import type { StrapiImage } from "@/types";

// Dev-only placeholder imagery sourced from Unsplash.
// Replace `url`s with self-hosted / Timeweb S3 assets before launch — the shape
// already matches StrapiImage so swapping the source needs no component changes.
const BASE = "https://images.unsplash.com/";

let autoId = 1000;

/** Build a placeholder StrapiImage from an Unsplash photo id. */
export function unsplash(
  photoId: string,
  alt: string,
  w = 1600,
  h = 1067
): StrapiImage {
  return {
    id: autoId++,
    url: `${BASE}${photoId}?auto=format&fit=crop&w=${w}&q=80`,
    width: w,
    height: h,
    alternativeText: alt,
  };
}

/** Full-bleed source URL for parallax bands / posters (plain <img>/Image). */
export function unsplashUrl(photoId: string, w = 2000, h = 1200): string {
  return `${BASE}${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}
