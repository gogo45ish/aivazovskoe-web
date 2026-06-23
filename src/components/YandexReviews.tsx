/**
 * Yandex Maps reviews widget for the sanatorium.
 *
 * Free, official embed — no API key. Source the org id from the organisation's
 * Yandex Maps card (yandex.ru/maps/org/ayvazovskoye/<ORG_ID>/) and paste it
 * below. The widget renders live, moderated reviews straight from Yandex.
 */
const ORG_ID = "54713465134";
const MAPS_URL = `https://yandex.ru/maps/org/ayvazovskoye/${ORG_ID}/`;
const WIDGET_URL = `https://yandex.ru/maps-reviews-widget/${ORG_ID}?comments`;

export default function YandexReviews({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div
        className="relative overflow-hidden rounded-lg border border-line bg-white shadow-[0_28px_55px_-30px_rgba(30,45,36,0.45)]"
        style={{ height: "clamp(560px, 78vh, 760px)" }}
      >
        <iframe
          title="Отзывы о санатории «Айвазовское» на Яндекс Картах"
          src={WIDGET_URL}
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="link-arrow mt-4 inline-flex"
      >
        Все отзывы на Яндекс Картах
      </a>
    </div>
  );
}
