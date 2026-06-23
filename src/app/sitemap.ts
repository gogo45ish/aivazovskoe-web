import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import {
  getRooms,
  getDoctors,
  getTreatmentPrograms,
  getOffers,
} from "@/lib/strapi";

// Static top-level routes with a rough crawl priority. Higher = more important.
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/rooms", priority: 0.9 },
  { path: "/booking", priority: 0.9 },
  { path: "/lechenie", priority: 0.8 },
  { path: "/offers", priority: 0.7 },
  { path: "/park", priority: 0.8 },
  { path: "/park/japanese-garden", priority: 0.6 },
  { path: "/vrachi", priority: 0.6 },
  { path: "/restaurants", priority: 0.6 },
  { path: "/infrastructure", priority: 0.6 },
  { path: "/events", priority: 0.6 },
  { path: "/reviews", priority: 0.5 },
  { path: "/contacts", priority: 0.6 },
  { path: "/documentation", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Detail pages are driven by Strapi content, so pull their slugs at build time.
  const [rooms, doctors, programs, offers] = await Promise.all([
    getRooms(),
    getDoctors(),
    getTreatmentPrograms(),
    getOffers(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));

  const roomEntries: MetadataRoute.Sitemap = rooms.map((r) => ({
    url: `${SITE_URL}/rooms/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const doctorEntries: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${SITE_URL}/vrachi/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const programEntries: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${SITE_URL}/lechenie/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const offerEntries: MetadataRoute.Sitemap = offers.map((o) => ({
    url: `${SITE_URL}/offers/${o.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...roomEntries,
    ...doctorEntries,
    ...programEntries,
    ...offerEntries,
  ];
}
