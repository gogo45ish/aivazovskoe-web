export interface StrapiImage {
  id: number;
  url: string;
  width: number;
  height: number;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
}

// Non-image media (PDFs, etc.) from Strapi's upload plugin.
export interface StrapiFile {
  id: number;
  url: string;
  name?: string;
  ext?: string;
  mime?: string;
  size?: number;
}

export type RoomCategory = "one-room" | "two-room";

export interface Room {
  id: number;
  name: string;
  slug: string;
  category: RoomCategory;
  sizeM2?: number;
  guests: number;
  view: string;
  beds?: string;
  building?: string;
  priceFrom?: number;
  /** TravelLine room identifier ("идентификатор номера TL"); builds /booking?room-type=… */
  tlRoomType?: string;
  /** Amenity keys — see AMENITIES catalog in @/data/amenities */
  amenities?: string[];
  description: string;
  order: number;
  gallery?: StrapiImage[];
}

export interface Offer {
  id: number;
  title: string;
  slug: string;
  badge: string;
  badgeStyle: "gold" | "soft";
  description: string;
  validUntil?: string;
  order: number;
  image?: StrapiImage;
  /** Dynamic-zone page body, rendered block-by-block on /offers/[slug]. */
  body?: OfferBlock[];
}

// ── Offer body — Strapi dynamic-zone blocks (offer-blocks.* components) ──
// Each block carries Strapi's `__component` discriminator so the renderer can
// switch on it. `id` is Strapi's per-entry component id (handy as a React key).
interface OfferBlockBase {
  id: number;
}

export interface HeadingBlock extends OfferBlockBase {
  __component: "offer-blocks.heading";
  text: string;
  level: "h2" | "h3";
}

export interface RichTextBlock extends OfferBlockBase {
  __component: "offer-blocks.rich-text";
  /** Markdown/plain text; rendered as paragraphs split on blank lines. */
  content: string;
}

export interface ImageBlock extends OfferBlockBase {
  __component: "offer-blocks.image";
  media?: StrapiImage;
  caption?: string;
}

export interface GalleryBlock extends OfferBlockBase {
  __component: "offer-blocks.gallery";
  images?: StrapiImage[];
}

export interface OfferCard {
  id: number;
  title: string;
  text?: string;
  href?: string;
  image?: StrapiImage;
}

export interface CardGridBlock extends OfferBlockBase {
  __component: "offer-blocks.card-grid";
  heading?: string;
  cards?: OfferCard[];
}

export interface CarouselSlide {
  id: number;
  caption?: string;
  image?: StrapiImage;
}

export interface CarouselBlock extends OfferBlockBase {
  __component: "offer-blocks.carousel";
  slides?: CarouselSlide[];
}

export interface CtaButtonBlock extends OfferBlockBase {
  __component: "offer-blocks.cta-button";
  label: string;
  href: string;
  style: "primary" | "outline";
}

export type OfferBlock =
  | HeadingBlock
  | RichTextBlock
  | ImageBlock
  | GalleryBlock
  | CardGridBlock
  | CarouselBlock
  | CtaButtonBlock;

export interface ReviewHighlight {
  id: number;
  author: string;
  date: string;
  rating: number;
  quote: string;
  order: number;
}

export interface ReviewAggregate {
  score: number;
  count: number;
  source: string;
}

export interface SiteSettings {
  phone: string;
  hours: string;
  address: string;
  addressLine2: string;
  socials: {
    telegram?: string;
    vk?: string;
    whatsapp?: string;
  };
  aboutImage?: StrapiImage;
}

export interface HomeHero {
  eyebrow: string;
  heading: string;
  sub: string;
  videoUrl: string;
  posterUrl: string;
}

// ── Park (/park) ──
export interface ParkInfo {
  intro: string;
  areaHa?: number;
  openDailyNote: string;
  startPoint: string;
  ticketOfficeHours: string;
  bookingPhone: string;
  validityNote: string;
}

export interface Garden {
  id: number;
  name: string;
  blurb: string;
  order: number;
  image?: StrapiImage;
}

export interface JgPriceTier {
  label: string;
  price: string;
  condition?: string;
}

export interface SeasonalEvent {
  season: string;
  term: string;
  description: string;
  /** Image URL (seasonalEvents is stored as JSON, so this is a plain URL). */
  image?: string;
}

export interface JapaneseGardenContent {
  heading: string;
  spotlightText?: string;
  story: string;
  heroImage?: StrapiImage;
  gallery?: StrapiImage[];
  seasonalEvents?: SeasonalEvent[];
  hours?: string;
  scheduleSlots?: string[];
  durationMin?: number;
  startPoint?: string;
  mainTicketPrice?: string;
  bookingCTA?: string;
  includedInTour: boolean;
  ownHours?: string;
  ownPrice?: string;
  ownPriceTiers?: JgPriceTier[];
  bookingPhone?: string;
  pageLink?: string;
}

export interface EveningTour {
  title: string;
  description: string;
  includes: string[];
  bonus?: string;
  price?: string;
  bookingMethod?: string;
}

// ── Lechenie (/lechenie) ──
export interface Capability {
  title: string;
  text: string;
}

export interface MedicalCenter {
  intro: string;
  centerLead: string;
  capabilities: Capability[];
  poolLfkText: string;
  bookingPhone: string;
  priceListPdf?: string;
}

export interface MedicalService {
  id: number;
  name: string;
  order: number;
}

export interface Doctor {
  id: number;
  name: string;
  slug: string;
  specialties: string[];
  photo?: StrapiImage;
  bio?: string;
  order: number;
}

export interface TreatmentProgram {
  id: number;
  name: string;
  slug: string;
  condition: string;
  heroImage?: StrapiImage;
  body?: string;
  included?: string[];
  duration?: string;
  doctorSlugs?: string[];
  order: number;
}

// ── Infrastructure (/infrastructure) ──
export interface InfrastructureItem {
  id: number;
  title: string;
  slug?: string;
  paragraphs: string[];
  href?: string;
  order: number;
  image?: StrapiImage;
}

// ── Restaurants (/restaurants) ──
export interface ScheduleRow {
  label: string;
  time: string;
}

export interface Restaurant {
  id: number;
  name: string;
  kind?: string;
  slug?: string;
  /** Simple single-line opening hours (e.g. "11:00 - 22:00"). */
  hours?: string;
  /** Free-form note above the schedule rows (e.g. seasonal availability). */
  scheduleNote?: string;
  /** Structured meal-by-meal schedule (breakfast / lunch / dinner). */
  scheduleRows?: ScheduleRow[];
  paragraphs: string[];
  featuresIntro?: string;
  features?: string[];
  transferNote?: string;
  menuUrl?: string;
  phone?: string;
  bookingNote?: string;
  featured?: boolean;
  order: number;
  images?: StrapiImage[];
}

// ── Афиша (/events) ──
export interface EventItem {
  id: number;
  /** ISO date (YYYY-MM-DD) the poster is sorted by. */
  eventDate: string;
  cover?: StrapiImage;
}

// ── Documentation (/documentation) ──
export type DocCategory = "regulatory" | "accounting" | "sout" | "pricelist";

export interface LegalDocument {
  id: number;
  title: string;
  category: DocCategory;
  order: number;
  /** Uploaded PDF (added per entry in the Strapi admin). */
  pdf?: StrapiFile;
}

// ── Contacts (/contacts) ──
export interface ContactPhone {
  number: string;
  /** Optional sub-label, e.g. "Заказ групповых экскурсий". */
  label?: string;
}

export interface Contact {
  id: number;
  title: string;
  note?: string;
  hours?: string;
  phones: ContactPhone[];
  email?: string;
  order: number;
}

export interface ThemedExcursion {
  title: string;
  scheduleText: string;
}

export interface ExcursionSchedule {
  weekdayTimes: string[];
  weekendTimes: string[];
  themedExcursions: ThemedExcursion[];
  startPoint: string;
  ticketOfficeHours: string;
  validFrom: string;
  validTo: string;
}

export interface PriceTier {
  id: number;
  label: string;
  price: string;
  condition: string;
  isGroupOrSpecial: boolean;
  order: number;
}

export interface FreeCategory {
  id: number;
  text: string;
  order: number;
}

export interface VisitRuleGroup {
  id: number;
  groupTitle: string;
  items: string[];
  order: number;
}
