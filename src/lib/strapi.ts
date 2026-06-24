import type {
  Room,
  Offer,
  ReviewHighlight,
  ReviewAggregate,
  SiteSettings,
  HomeHero,
  StrapiImage,
  ParkInfo,
  Garden,
  JapaneseGardenContent,
  ExcursionSchedule,
  PriceTier,
  FreeCategory,
  VisitRuleGroup,
  EveningTour,
  MedicalCenter,
  MedicalService,
  Doctor,
  TreatmentProgram,
  InfrastructureItem,
  Restaurant,
  LegalDocument,
  Contact,
  EventItem,
} from "@/types";
import { infrastructureItems as localInfrastructure } from "@/data/infrastructure";
import { restaurants as localRestaurants } from "@/data/restaurants";
import { legalDocuments as localDocuments } from "@/data/documentation";
import { contacts as localContacts } from "@/data/contacts";
import { park as localPark, localEveningTour } from "@/data/park";
import {
  medicalCenter as localMedicalCenter,
  medicalServices as localServices,
  doctors as localDoctors,
  treatmentPrograms as localPrograms,
} from "@/data/lechenie";
import { rooms as localRooms } from "@/data/rooms";
import { offers as localOffers } from "@/data/offers";
import {
  reviewHighlights as localReviews,
  reviewAggregate as localAggregate,
} from "@/data/reviewHighlights";
import { siteSettings as localSettings } from "@/data/siteSettings";
import { homeHero as localHero } from "@/data/homeHero";

// STRAPI_URL points at the live CMS. Local dev sets it (.env.local →
// http://localhost:1337). When unset (e.g. the Vercel "content snapshot"
// deploy), BASE is "" so: API fetches become relative and fail → the app uses
// the baked src/data fallbacks, and relative "/uploads/…" image paths resolve
// same-origin (served from web/public/uploads). Set STRAPI_URL again to go live.
const BASE = process.env.STRAPI_URL ?? "";
const ISR = { next: { revalidate: 60 } };

export function strapiImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${BASE}${url}`;
}

export function strapiImageUnoptimized(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith("http://localhost") || url.startsWith("http://127.");
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/api${path}`, ISR);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface StrapiList<T> {
  data: T[];
}
interface StrapiSingle<T> {
  data: T;
}

export async function getRooms(): Promise<Room[]> {
  const json = await get<StrapiList<Room>>(
    "/rooms?populate=*&sort=order:asc&pagination[pageSize]=100"
  );
  return json?.data?.length ? json.data : localRooms;
}

export async function getRoom(slug: string): Promise<Room | null> {
  const json = await get<StrapiList<Room>>(
    `/rooms?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  if (json?.data?.length) return json.data[0];
  return localRooms.find((r) => r.slug === slug) ?? null;
}

export async function getOffers(): Promise<Offer[]> {
  const json = await get<StrapiList<Offer>>(
    "/offers?populate=*&sort=order:asc&pagination[pageSize]=100"
  );
  if (!json?.data?.length) return localOffers;
  // Strapi entries can predate the slug field (slug: null). A null slug breaks
  // routing (/offers/[slug]) and card links, so backfill from the order-matched
  // local offer, then fall back to a stable id-based slug — never null.
  return json.data.map((o) => ({
    ...o,
    slug:
      o.slug ||
      localOffers.find((l) => l.order === o.order)?.slug ||
      `offer-${o.id}`,
  }));
}

// Strapi v5 does NOT populate dynamic zones with `populate=*`. Each component in
// the `body` zone must be named explicitly via the `[on]` syntax — and only the
// components listed here are returned, so every block type must appear below.
// Nested media (card images, carousel slides) needs the deeper `[populate]`
// path; the leaf `populate=*` then pulls each component's own media.
const OFFER_BODY_POPULATE = [
  "populate[image]=true",
  "populate[body][on][offer-blocks.heading][populate]=*",
  "populate[body][on][offer-blocks.rich-text][populate]=*",
  "populate[body][on][offer-blocks.image][populate]=*",
  "populate[body][on][offer-blocks.gallery][populate]=*",
  "populate[body][on][offer-blocks.card-grid][populate][cards][populate]=*",
  "populate[body][on][offer-blocks.carousel][populate][slides][populate]=*",
  "populate[body][on][offer-blocks.cta-button][populate]=*",
].join("&");

export async function getOffer(slug: string): Promise<Offer | null> {
  const json = await get<StrapiList<Offer>>(
    `/offers?filters[slug][$eq]=${encodeURIComponent(slug)}&${OFFER_BODY_POPULATE}`
  );
  const local = localOffers.find((o) => o.slug === slug) ?? null;
  const remote = json?.data?.[0];
  if (!remote) return local;
  // Prefer Strapi content, but fall back to the local body when the entry has no
  // blocks authored yet so the detail page still renders something meaningful.
  return { ...remote, body: remote.body?.length ? remote.body : local?.body };
}

export async function getReviewHighlights(): Promise<ReviewHighlight[]> {
  const json = await get<StrapiList<ReviewHighlight>>(
    "/review-highlights?sort=order:asc&pagination[pageSize]=100"
  );
  return json?.data?.length ? json.data : localReviews;
}

export async function getSiteSettings(): Promise<{
  settings: SiteSettings;
  reviewAggregate: ReviewAggregate;
}> {
  const json = await get<StrapiSingle<Record<string, unknown>>>(
    "/site-setting?populate=*"
  );
  if (!json?.data) {
    return { settings: localSettings, reviewAggregate: localAggregate };
  }
  const d = json.data;
  const settings: SiteSettings = {
    phone: (d.phone as string) ?? "",
    hours: (d.hours as string) ?? "",
    address: (d.address as string) ?? "",
    addressLine2: (d.addressLine2 as string) ?? "",
    socials: {
      telegram: (d.telegramUrl as string) || undefined,
      vk: (d.vkUrl as string) || undefined,
      whatsapp: (d.whatsappUrl as string) || undefined,
    },
    aboutImage: (d.aboutImage as StrapiImage) || undefined,
  };
  const reviewAggregate: ReviewAggregate = {
    score: (d.reviewScore as number) ?? 0,
    count: (d.reviewCount as number) ?? 0,
    source: (d.reviewSource as string) ?? "",
  };
  return { settings, reviewAggregate };
}

// Raw shape of the /home-hero record: video/poster are uploaded media objects;
// videoUrl/posterUrl are optional manual URL overrides.
interface HomeHeroResponse {
  eyebrow?: string;
  heading?: string;
  sub?: string;
  video?: { url?: string } | null;
  poster?: StrapiImage | null;
  videoUrl?: string;
  posterUrl?: string;
}

export async function getHomeHero(): Promise<HomeHero> {
  // populate=* pulls the uploaded video/poster files. Precedence per field:
  // uploaded media → manual URL override → local placeholder.
  const json = await get<StrapiSingle<HomeHeroResponse>>(
    "/home-hero?populate=*"
  );
  const d = json?.data;
  if (!d) return localHero;
  return {
    eyebrow: d.eyebrow ?? localHero.eyebrow,
    heading: d.heading ?? localHero.heading,
    sub: d.sub ?? localHero.sub,
    videoUrl: strapiImageUrl(d.video?.url) ?? d.videoUrl ?? localHero.videoUrl,
    posterUrl:
      strapiImageUrl(d.poster?.url) ?? d.posterUrl ?? localHero.posterUrl,
  };
}

// Merge a (possibly partial) Strapi Japanese-garden record with local
// placeholders so the page always has imagery + own hours/prices.
function mergeJg(base?: JapaneseGardenContent | null): JapaneseGardenContent {
  const b = base ?? localPark.jg;
  const j = localPark.jg;
  return {
    ...b,
    spotlightText: b.spotlightText ?? j.spotlightText,
    gallery: b.gallery?.length ? b.gallery : j.gallery,
    seasonalEvents: b.seasonalEvents?.length
      ? b.seasonalEvents.map((e, i) => ({
          ...e,
          image: e.image ?? j.seasonalEvents?.[i]?.image,
        }))
      : j.seasonalEvents,
    hours: b.hours ?? j.hours,
    scheduleSlots: b.scheduleSlots?.length ? b.scheduleSlots : j.scheduleSlots,
    durationMin: b.durationMin ?? j.durationMin,
    startPoint: b.startPoint ?? j.startPoint,
    mainTicketPrice: b.mainTicketPrice ?? j.mainTicketPrice,
    bookingCTA: b.bookingCTA ?? j.bookingCTA,
    bookingPhone: b.bookingPhone ?? j.bookingPhone,
    pageLink: b.pageLink ?? j.pageLink,
  };
}

export async function getJapaneseGarden(): Promise<JapaneseGardenContent> {
  const json = await get<StrapiSingle<JapaneseGardenContent>>(
    "/japanese-garden?populate=*"
  );
  return mergeJg(json?.data);
}

export async function getEveningTour(): Promise<EveningTour> {
  const json = await get<StrapiSingle<EveningTour>>("/evening-tour?populate=*");
  return json?.data ?? localEveningTour;
}

// ── Lechenie ──
export async function getMedicalCenter(): Promise<MedicalCenter> {
  const json = await get<StrapiSingle<MedicalCenter>>("/medical-center");
  return json?.data ?? localMedicalCenter;
}

export async function getMedicalServices(): Promise<MedicalService[]> {
  const json = await get<StrapiList<MedicalService>>(
    "/medical-services?sort=order:asc&pagination[pageSize]=50"
  );
  return json?.data?.length ? json.data : localServices;
}

export async function getDoctors(): Promise<Doctor[]> {
  const json = await get<StrapiList<Doctor>>(
    "/doctors?populate=*&sort=order:asc&pagination[pageSize]=100"
  );
  return json?.data?.length ? json.data : localDoctors;
}

export async function getDoctor(slug: string): Promise<Doctor | null> {
  const json = await get<StrapiList<Doctor>>(
    `/doctors?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  if (json?.data?.length) return json.data[0];
  return localDoctors.find((d) => d.slug === slug) ?? null;
}

export async function getTreatmentPrograms(): Promise<TreatmentProgram[]> {
  const json = await get<StrapiList<TreatmentProgram>>(
    "/treatment-programs?populate=*&sort=order:asc&pagination[pageSize]=50"
  );
  return json?.data?.length ? json.data : localPrograms;
}

export async function getTreatmentProgram(
  slug: string
): Promise<TreatmentProgram | null> {
  const json = await get<StrapiList<TreatmentProgram>>(
    `/treatment-programs?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  if (json?.data?.length) return json.data[0];
  return localPrograms.find((p) => p.slug === slug) ?? null;
}

export async function getInfrastructureItems(): Promise<InfrastructureItem[]> {
  const json = await get<StrapiList<InfrastructureItem>>(
    "/infrastructure-items?populate=*&sort=order:asc&pagination[pageSize]=100"
  );
  if (!json?.data?.length) return localInfrastructure;
  // Prefer Strapi content, but fall back to local placeholder images when a
  // Strapi entry has no uploaded image yet (matched by order).
  return json.data.map((item) => ({
    ...item,
    image:
      item.image ??
      localInfrastructure.find((l) => l.order === item.order)?.image,
  }));
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const json = await get<StrapiList<Restaurant>>(
    "/restaurants?populate=*&sort=order:asc&pagination[pageSize]=100"
  );
  if (!json?.data?.length) return localRestaurants;
  // Prefer Strapi content, but fall back to local images when a Strapi entry
  // has no uploads yet (matched by order).
  return json.data.map((r) => ({
    ...r,
    images: r.images?.length
      ? r.images
      : localRestaurants.find((l) => l.order === r.order)?.images,
  }));
}

export async function getLegalDocuments(): Promise<LegalDocument[]> {
  const json = await get<StrapiList<LegalDocument>>(
    "/legal-documents?populate=*&sort=order:asc&pagination[pageSize]=200"
  );
  return json?.data?.length ? json.data : localDocuments;
}

export async function getContacts(): Promise<Contact[]> {
  const json = await get<StrapiList<Contact>>(
    "/contacts?sort=order:asc&pagination[pageSize]=100"
  );
  return json?.data?.length ? json.data : localContacts;
}

// Афиша — event posters, sorted chronologically by date. No local fallback:
// the grid is staff-driven and simply renders empty until posters are uploaded.
export async function getEvents(): Promise<EventItem[]> {
  const json = await get<StrapiList<EventItem>>(
    "/events?populate=cover&sort=eventDate:asc&pagination[pageSize]=200"
  );
  return json?.data ?? [];
}

export interface ParkContent {
  info: ParkInfo;
  gardens: Garden[];
  jg: JapaneseGardenContent;
  schedule: ExcursionSchedule;
  tiers: PriceTier[];
  free: FreeCategory[];
  rules: VisitRuleGroup[];
}

export async function getParkContent(): Promise<ParkContent> {
  const [infoJ, gardensJ, jgJ, schedJ, tiersJ, freeJ, rulesJ] = await Promise.all([
    get<StrapiSingle<ParkInfo>>("/park-info?populate=*"),
    get<StrapiList<Garden>>(
      "/gardens?populate=*&sort=order:asc&pagination[pageSize]=50"
    ),
    get<StrapiSingle<JapaneseGardenContent>>("/japanese-garden?populate=*"),
    get<StrapiSingle<ExcursionSchedule>>("/excursion-schedule?populate=*"),
    get<StrapiList<PriceTier>>(
      "/price-tiers?sort=order:asc&pagination[pageSize]=50"
    ),
    get<StrapiList<FreeCategory>>(
      "/free-categories?sort=order:asc&pagination[pageSize]=50"
    ),
    get<StrapiList<VisitRuleGroup>>(
      "/visit-rule-groups?sort=order:asc&pagination[pageSize]=50"
    ),
  ]);

  // Gardens: prefer Strapi content, but fall back to local placeholder images
  // when a Strapi entry has no uploaded image yet (order-aligned).
  const gardens = gardensJ?.data?.length
    ? gardensJ.data.map((g, i) => ({
        ...g,
        image: g.image ?? localPark.gardens[i]?.image,
      }))
    : localPark.gardens;

  const jg = mergeJg(jgJ?.data);

  return {
    info: infoJ?.data ?? localPark.info,
    gardens,
    jg,
    schedule: schedJ?.data ?? localPark.schedule,
    tiers: tiersJ?.data?.length ? tiersJ.data : localPark.tiers,
    free: freeJ?.data?.length ? freeJ.data : localPark.free,
    rules: rulesJ?.data?.length ? rulesJ.data : localPark.rules,
  };
}
