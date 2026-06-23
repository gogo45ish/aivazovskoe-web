import type { Contact } from "@/types";

// Authoritative /contacts content (also the local fallback when Strapi is
// offline). Mirrors the Strapi seed in strapi/src/index.ts.

export const contacts: Contact[] = [
  {
    id: 1,
    order: 1,
    title: "Отдел маркетинга и бронирования",
    hours: "с 8:00 до 16:30",
    phones: [{ number: "8 (800) 777-00-97" }, { number: "+7 (978) 901-52-56" }],
    email: "market@aivazovskoe.ru",
  },
  {
    id: 2,
    order: 2,
    title: "Парк «Айвазовское»",
    hours: "с 8:00 до 16:30",
    phones: [
      { number: "8 (800) 777-00-97" },
      { number: "+7 (978) 917-89-54", label: "Заказ групповых экскурсий" },
    ],
    email: "park@aivazovskoe.ru",
  },
  {
    id: 3,
    order: 3,
    title: "Администратор водолечебницы",
    note: "Бассейн, тренажёрный зал",
    phones: [{ number: "+7 (978) 918-08-65" }, { number: "+7 (978) 918-08-93" }],
  },
  {
    id: 4,
    order: 4,
    title: "Отдел госзакупок",
    hours: "с 8:00 до 17:00",
    phones: [{ number: "+7 (978) 901-52-55" }],
    email: "zakupki@aivazovskoe.ru",
  },
  {
    id: 5,
    order: 5,
    title: "Организация свадебных церемоний",
    phones: [{ number: "+7 (980) 392-95-65" }],
  },
  {
    id: 6,
    order: 6,
    title: "Медицинский центр",
    phones: [{ number: "+7 (978) 917-94-79" }, { number: "+7 (978) 918-08-65" }],
  },
  {
    id: 7,
    order: 7,
    title: "Отдел кадров",
    hours: "с 8:00 до 17:00",
    phones: [{ number: "+7 (978) 918-12-97" }],
    email: "ok@aivazovskoe.ru",
  },
  {
    id: 8,
    order: 8,
    title: "Приёмная директора",
    hours: "с 8:00 до 17:00",
    phones: [{ number: "+7 (978) 901-52-54" }],
    email: "info@aivazovskoe.ru",
  },
];
