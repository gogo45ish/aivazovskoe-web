import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TravelLineBookingForm from "@/components/booking/TravelLineBookingForm";
import { getSiteSettings } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Бронирование — Санаторий «Айвазовское»",
  description:
    "Онлайн-бронирование номеров санатория «Айвазовское»: проверка наличия, тарифы и оплата.",
}, "/booking");

export default async function BookingPage() {
  const { settings } = await getSiteSettings();

  return (
    <>
      <Nav />

      {/* Minimal forest-green header band — factual labels only, no marketing copy.
          TODO: drop client intro copy here as a <p> if/when it's provided. */}
      <header className="bg-green-900 pt-[clamp(140px,18vh,180px)] pb-12">
        <div className="wrap">
          <div className="eyebrow">Онлайн-бронирование</div>
          <h1
            className="text-sand-100"
            style={{ fontSize: "clamp(34px, 5vw, 60px)", maxWidth: "780px" }}
          >
            Бронирование
          </h1>
        </div>
      </header>

      {/* TravelLine widget — owns availability, rates, payment and акции. */}
      <section className="section bg-sand-50">
        <div className="wrap">
          <TravelLineBookingForm />
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
