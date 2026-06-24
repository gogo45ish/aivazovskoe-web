import type { ReviewHighlight, ReviewAggregate } from "@/types";

export const reviewHighlights: ReviewHighlight[] = [
  {
    "id": 1,
    "author": "Марина К.",
    "date": "Октябрь 2024",
    "rating": 5,
    "quote": "Великолепный санаторий! Чистый воздух, сосновый парк прямо у моря, вкусная еда. Персонал очень внимательный. Уже планируем вернуться следующим летом.",
    "order": 1
  },
  {
    "id": 2,
    "author": "Алексей В.",
    "date": "Август 2024",
    "rating": 5,
    "quote": "Отдыхали с семьёй две недели. Дети были в восторге от бассейна и анимации. Номер просторный, балкон с видом на море. Рекомендую всем без исключения.",
    "order": 2
  }
];

export const reviewAggregate: ReviewAggregate = {
  "score": 4.8,
  "count": 320,
  "source": "Яндекс Картах"
};
