import type { ReviewHighlight, ReviewAggregate } from "@/types";

export const reviewAggregate: ReviewAggregate = {
  score: 4.8,
  count: 320,
  source: "Яндекс Картах",
};

export const reviewHighlights: ReviewHighlight[] = [
  {
    id: 1,
    author: "Марина К.",
    date: "март 2026",
    rating: 5,
    quote:
      "Парк потрясающий — к морю спускаешься через настоящий ботанический сад.",
    order: 1,
  },
  {
    id: 2,
    author: "Алексей П.",
    date: "февраль 2026",
    rating: 5,
    quote:
      "Тишина, чистейший воздух и внимательный персонал. Обязательно вернёмся.",
    order: 2,
  },
];
