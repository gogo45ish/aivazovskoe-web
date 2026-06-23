import type { HomeHero } from "@/types";
import { unsplashUrl } from "./media";

export const homeHero: HomeHero = {
  eyebrow: "Южный берег Крыма · Партенит",
  heading: "Где море встречает реликтовый парк",
  sub: "25 гектаров парка между горой Аю-Даг и мысом Плака — для отдыха и оздоровления круглый год.",
  // Replace with optimised self-hosted H.264 + WebM before launch
  videoUrl:
    "https://xn--80aafbpklm8ac5a.xn--p1ai/wp-content/uploads/2025/03/2.mp4",
  // Dev poster — shows instantly + stands in on mobile / reduced-motion
  posterUrl: unsplashUrl("photo-1505228395891-9a51e7e86bf6"),
};
