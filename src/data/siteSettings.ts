import type { SiteSettings } from "@/types";
import { unsplash } from "./media";

export const siteSettings: SiteSettings = {
  phone: "+7 (978) 000-00-00",
  hours: "ежедневно, 8:00–22:00",
  address: "Республика Крым, г. Алушта,\nпгт Партенит, ул. Васильченко, 1А",
  addressLine2:
    "Аэропорт Симферополь — 65 км (~1,5 ч)\nЯлта — 25 км · Алушта — 20 км",
  socials: {
    telegram: "#",
    vk: "#",
    whatsapp: "#",
  },
  aboutImage: unsplash(
    "photo-1441974231531-c6227db76b6e",
    "Реликтовый парк санатория",
    1400,
    1700
  ),
};
