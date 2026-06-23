import type { Metadata } from "next";
import type { SiteSettings, ReviewAggregate, Room, Offer } from "@/types";

// ── Site identity ────────────────────────────────────────────────────────────
// Public canonical origin. Set NEXT_PUBLIC_SITE_URL on the server to the real
// domain (e.g. https://aivazovskoe.ru) before launch; the default keeps local
// builds working. Trailing slash is stripped so we always join cleanly.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aivazovskoe.ru"
).replace(/\/$/, "");

export const SITE_NAME = "Санаторий «Айвазовское»";

export const DEFAULT_TITLE =
  "Санаторий «Айвазовское» — парк-курорт на Южном берегу Крыма";

export const DEFAULT_DESCRIPTION =
  "Парк-курорт «Айвазовское» в Партените: 25 гектаров реликтового парка между " +
  "горой Аю-Даг и мысом Плака. Номера с видом на море, лечение и отдых круглый год.";

// 1200×630 share card served from /public. Resolved against metadataBase.
export const OG_IMAGE = "/og.png";

// ── Organisation facts (used in JSON-LD structured data) ─────────────────────
// NOTE: verify the geo-coordinates in Yandex.Maps before launch — these are
// approximate for пгт Партенит and feed the map/region card.
const ORG = {
  streetAddress: "ул. Васильченко, 1А",
  locality: "пгт Партенит",
  region: "Республика Крым",
  postalCode: "298542",
  country: "RU",
  latitude: 44.5783,
  longitude: 34.3447,
  phone: "+7 800 777-00-97",
};

// ── Per-page metadata helper ─────────────────────────────────────────────────
// Augments a page's existing { title, description } with the SEO fields that
// were missing site-wide: a canonical URL plus Open Graph / Twitter cards
// (important for clean previews when links are shared on VK / Telegram).
// `path` is the route's absolute path, e.g. "/rooms" — resolved against
// metadataBase into a fully-qualified canonical/og:url.
export function withSeo(meta: Metadata, path: string): Metadata {
  const title =
    typeof meta.title === "string" && meta.title ? meta.title : DEFAULT_TITLE;
  const description = meta.description ?? DEFAULT_DESCRIPTION;
  return {
    ...meta,
    alternates: { canonical: path, ...meta.alternates },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "ru_RU",
      type: "website",
      images: [OG_IMAGE],
      ...meta.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
      ...meta.twitter,
    },
  };
}

// ── JSON-LD structured-data builders ─────────────────────────────────────────
// Plain objects rendered via <JsonLd>. Yandex & Google read Schema.org markup
// to build rich/organisation cards in search results.

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: ORG.streetAddress,
    addressLocality: ORG.locality,
    addressRegion: ORG.region,
    postalCode: ORG.postalCode,
    addressCountry: ORG.country,
  };
}

/** The resort itself — homepage organisation/LocalBusiness card. */
export function lodgingBusinessLd(
  settings: SiteSettings,
  aggregate: ReviewAggregate
): Record<string, unknown> {
  const sameAs = [
    settings.socials.vk,
    settings.socials.telegram,
    settings.socials.whatsapp,
  ].filter((u): u is string => !!u && u !== "#");

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Resort",
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    telephone: ORG.phone,
    priceRange: "₽₽₽",
    image: `${SITE_URL}${OG_IMAGE}`,
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORG.latitude,
      longitude: ORG.longitude,
    },
  };

  if (sameAs.length) ld.sameAs = sameAs;

  if (aggregate.score > 0 && aggregate.count > 0) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregate.score,
      reviewCount: aggregate.count,
      bestRating: 5,
    };
  }

  return ld;
}

/** Breadcrumb trail for a detail page. */
export function breadcrumbLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** A single room/suite as a bookable hotel room with a starting price. */
export function roomLd(room: Room): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.name,
    description: room.description,
    url: `${SITE_URL}/rooms/${room.slug}`,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.guests,
      unitText: "гость",
    },
  };

  const image = room.gallery?.[0]?.url;
  if (image) ld.image = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  if (room.priceFrom) {
    ld.offers = {
      "@type": "Offer",
      price: room.priceFrom,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/rooms/${room.slug}`,
    };
  }

  return ld;
}

/** A promotional special offer (акция). Prices aren't published, so no `price`
 *  is emitted — the Offer still carries name/description/validity/seller so
 *  crawlers can surface it. Add `price`/`priceCurrency` here once prices exist. */
export function offerLd(offer: Offer): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: offer.title,
    description: offer.description,
    url: `${SITE_URL}/offers/${offer.slug}`,
    category: "SpecialOffer",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Resort",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const image = offer.image?.url;
  if (image) ld.image = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  if (offer.validUntil) ld.validThrough = offer.validUntil;

  return ld;
}
