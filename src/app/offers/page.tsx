import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import OfferCard from "@/components/ui/OfferCard";
import Reveal from "@/components/ui/Reveal";
import { getOffers, getSiteSettings } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo(
  {
    title: "Акции и специальные предложения — Санаторий «Айвазовское»",
    description:
      "Сезонные акции и привилегии санатория «Айвазовское»: скидка за раннее бронирование, выгода за долгое пребывание и оздоровительные программы в подарок.",
  },
  "/offers"
);

export default async function OffersPage() {
  const [offers, { settings }] = await Promise.all([
    getOffers(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Nav />

      {/* Page header — dark so the transparent fixed nav stays legible */}
      <header className="bg-green-900 pt-[clamp(140px,18vh,180px)] pb-16">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Специальные предложения</div>
            <h1
              className="text-sand-100"
              style={{ fontSize: "clamp(34px, 5vw, 60px)", maxWidth: "780px" }}
            >
              Акции и предложения
            </h1>
            <p className="text-green-300 text-[16px] mt-5 max-w-150 leading-[1.7]">
              Сезонные предложения и привилегии для тех, кто планирует отдых
              заранее или приезжает надолго. Выберите подходящее — и забронируйте
              на выгодных условиях.
            </p>
          </Reveal>
        </div>
      </header>

      {/* Cards are dark-styled, so the grid sits on a dark section (as on the homepage) */}
      <section className="section bg-green-900 pt-0">
        <div className="wrap">
          {offers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {offers.map((offer, i) => (
                <Reveal key={offer.id} delay={(i % 3) * 0.08}>
                  <OfferCard offer={offer} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-green-300 text-[16px]">
              Сейчас активных акций нет. Уточняйте актуальные предложения по
              телефону {settings.phone}.
            </p>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
