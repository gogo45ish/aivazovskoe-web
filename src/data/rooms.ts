import type { Room } from "@/types";

// Real accommodation types from the sanatorium's site (varianty-razmeshheniya).
// No prices are published on the source, so priceFrom is intentionally omitted
// (the UI shows "Цена по запросу"). Images deliberately not added yet.
// `amenities` reference keys in @/data/amenities. The base in-room set
// (wifi/ac/tv/fridge/safe/phone/bath) is standard across rooms; per-room extras
// (balcony/terrace/lounge + view) come from the source descriptions.
const BASE = ["wifi", "ac", "tv", "fridge", "safe", "phone", "bath"];

const baseRooms: Room[] = [
  // ── Однокомнатные ──
  {
    id: 1,
    name: "Однокомнатный двухместный «Стандарт», вид на парк",
    slug: "standart-park",
    category: "one-room",
    guests: 2,
    view: "парк",
    amenities: [...BASE, "parkView"],
    description:
      "Уютный номер, выполненный в спокойных светлых тонах, с великолепным видом на ландшафтный парк.",
    order: 1,
  },
  {
    id: 2,
    name: "Однокомнатный двухместный «Стандарт Комфорт», вид на парк",
    slug: "standart-comfort-park",
    category: "one-room",
    guests: 2,
    view: "парк",
    amenities: [...BASE, "parkView"],
    description:
      "Комфортный и уютный номер с видом на парк обеспечит вам незабываемый отдых.",
    order: 2,
  },
  {
    id: 3,
    name: "Однокомнатный двухместный «Стандарт Комфорт», балкон, вид на море",
    slug: "standart-comfort-balcony-sea",
    category: "one-room",
    guests: 2,
    view: "море",
    amenities: [...BASE, "balcony", "seaView"],
    description:
      "Номер в классическом интерьере с балконом открывает неповторимые морские пейзажи.",
    order: 3,
  },
  {
    id: 4,
    name: "Однокомнатный двухместный «Стандарт Комфорт», терраса, вид на море",
    slug: "standart-comfort-terrace-sea",
    category: "one-room",
    guests: 2,
    view: "море",
    amenities: [...BASE, "terrace", "lounge", "seaView"],
    description:
      "Светлый, стильный и современный номер с террасой и лаунж-зоной и видом на море.",
    order: 4,
  },
  {
    id: 5,
    name: "Однокомнатный двухместный «Джуниор Сюит»",
    slug: "junior-suite",
    category: "one-room",
    sizeM2: 28,
    guests: 2,
    view: "море и парк",
    amenities: [...BASE, "balcony", "seaView", "parkView"],
    description:
      "Стильный современный номер, где спальня сочетается с жилой зоной; оформлен в лавандовых и мятных тонах. Балкон с панорамным видом на море и парк.",
    order: 5,
  },
  // ── Двухкомнатные ──
  {
    id: 6,
    name: "Двухкомнатный двухместный «Люкс», вид на парк",
    slug: "lux-park",
    category: "two-room",
    sizeM2: 40,
    guests: 2,
    view: "парк",
    amenities: [...BASE, "parkView"],
    description:
      "Просторный двухкомнатный номер повышенной комфортности с видом на парк.",
    order: 6,
  },
  {
    id: 7,
    name: "Двухкомнатный двухместный «Люкс», балкон, вид на море",
    slug: "lux-balcony-sea",
    category: "two-room",
    sizeM2: 39,
    guests: 2,
    view: "море",
    amenities: [...BASE, "balcony", "seaView"],
    description:
      "Просторный и красивый двухкомнатный номер с балконом открывает завораживающий вид на море.",
    order: 7,
  },
  {
    id: 8,
    name: "Двухкомнатный двухместный «Люкс», терраса, вид на море",
    slug: "lux-terrace-sea",
    category: "two-room",
    sizeM2: 39,
    guests: 2,
    view: "море",
    amenities: [...BASE, "terrace", "seaView"],
    description:
      "Двухкомнатный номер, оформленный в лучших традициях классического стиля, с террасой и видом на море.",
    order: 8,
  },
  {
    id: 9,
    name: "Двухкомнатный двухместный «Люкс», балкон, вид на море, 57 м²",
    slug: "lux-balcony-sea-57",
    category: "two-room",
    sizeM2: 57,
    guests: 2,
    view: "море и парк",
    beds: "Большая двуспальная кровать",
    amenities: [...BASE, "balcony", "seaView", "parkView"],
    description:
      "Самый роскошный двухкомнатный номер с большой кроватью, прикроватными тумбами и креслами. Балкон с видом на море и парк.",
    order: 9,
  },
  {
    id: 10,
    name: "Двухкомнатные апартаменты с террасой",
    slug: "apartment-terrace-2a",
    category: "two-room",
    guests: 2,
    view: "парк",
    building: "Корпус 2А",
    amenities: [...BASE, "terrace", "lounge", "parkView"],
    description:
      "Роскошный двухкомнатный номер с просторной террасой и видом на парк.",
    order: 10,
  },
];

// Placeholder TravelLine room id for the fallback data; real per-room ids live
// in Strapi (Room.tlRoomType) and drive /booking?room-type=… in production.
export const rooms: Room[] = baseRooms.map((r) => ({
  ...r,
  tlRoomType: "27000",
}));
