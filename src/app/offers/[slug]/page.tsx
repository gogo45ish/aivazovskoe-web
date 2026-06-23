import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import OfferBlocks from "@/components/offer-blocks/OfferBlocks";
import { getOffer, getOffers, getSiteSettings } from "@/lib/strapi";
import { withSeo, breadcrumbLd, offerLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const offers = await getOffers();
  return offers.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getOffer(slug);
  if (!offer) {
    return { title: "Предложение не найдено — Санаторий «Айвазовское»" };
  }
  return withSeo(
    {
      title: `${offer.title} — Санаторий «Айвазовское»`,
      description: offer.description,
    },
    `/offers/${slug}`
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default async function OfferDetailPage({ params }: Params) {
  const { slug } = await params;
  const [offer, { settings }] = await Promise.all([
    getOffer(slug),
    getSiteSettings(),
  ]);

  if (!offer) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Главная", path: "/" },
            { name: "Акции и предложения", path: "/offers" },
            { name: offer.title, path: `/offers/${offer.slug}` },
          ]),
          offerLd(offer),
        ]}
      />
      <Nav />

      {/* Header — the hero is just the offer's title (per spec) */}
      <header className="bg-green-900 pt-[clamp(130px,17vh,170px)] pb-12">
        <div className="wrap">
          <nav
            aria-label="Хлебные крошки"
            className="flex items-center gap-2 text-[13px] text-green-300 mb-6"
          >
            <Link href="/" className="hover:text-sand-100 transition-colors">
              Главная
            </Link>
            <IconChevronRight size={14} className="opacity-60" />
            <Link
              href="/#offers"
              className="hover:text-sand-100 transition-colors"
            >
              Акции
            </Link>
            <IconChevronRight size={14} className="opacity-60" />
            <span className="text-sand-100/80 line-clamp-1">{offer.title}</span>
          </nav>

          {offer.badge && <div className="eyebrow">{offer.badge}</div>}
          <h1
            className="text-sand-100"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", maxWidth: "820px" }}
          >
            {offer.title}
          </h1>
          {offer.description && (
            <p className="text-green-300 text-[16px] mt-4 leading-[1.7] max-w-[680px]">
              {offer.description}
            </p>
          )}
          {offer.validUntil && (
            <p className="text-brass text-[13px] mt-4">
              Действует до {formatDate(offer.validUntil)}
            </p>
          )}
        </div>
      </header>

      {/* Body — dynamic-zone blocks */}
      <section className="section bg-sand-50">
        {offer.body && offer.body.length > 0 ? (
          <OfferBlocks blocks={offer.body} />
        ) : (
          <div className="wrap">
            <p className="text-body text-[16px] max-w-[760px] mx-auto">
              Подробности предложения уточняйте по телефону {settings.phone}.
            </p>
          </div>
        )}
      </section>

      <Footer settings={settings} />
    </>
  );
}
