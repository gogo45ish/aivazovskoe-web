import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ParkHero from "@/components/park/ParkHero";
import PoseidonShowcase from "@/components/restaurants/PoseidonShowcase";
import RestaurantSection from "@/components/restaurants/RestaurantSection";
import {
  getRestaurants,
  getSiteSettings,
  strapiImageUrl,
} from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Рестораны и бары — Санаторий «Айвазовское»",
  description:
    "Рестораны и бары санатория «Айвазовское»: тематический ресторан «Посейдон у моря» с видом на море, столовая «По-домашнему», летний бар «Итальянский», рестораны корпусов и лобби-бар.",
}, "/restaurants");

export default async function RestaurantsPage() {
  const [restaurants, { settings }] = await Promise.all([
    getRestaurants(),
    getSiteSettings(),
  ]);

  const featured = restaurants.find((r) => r.featured);
  const rest = restaurants.filter((r) => !r.featured);
  const heroImage = strapiImageUrl(featured?.images?.[0]?.url);

  return (
    <>
      <Nav />

      <ParkHero
        eyebrow="Гастрономия · Санаторий «Айвазовское»"
        title="Рестораны и бары"
        intro="Средиземноморская кухня с видом на море, домашние обеды, летние бары и сбалансированное питание в корпусах — для каждого момента отдыха."
        image={heroImage}
        facts={[
          { value: String(restaurants.length), label: "ресторанов и баров" },
          { value: "до 200", label: "гостей в «Посейдоне»" },
          { value: "У моря", label: "панорамные террасы" },
        ]}
      >
        <a href="#posejdon" className="btn">
          Главный ресторан
        </a>
        <a href="/#booking" className="btn-out">
          Забронировать
        </a>
      </ParkHero>

      {featured ? <PoseidonShowcase r={featured} /> : null}

      {rest.map((r, i) => (
        <RestaurantSection
          key={r.id ?? r.slug ?? r.name}
          restaurant={r}
          index={i}
          dark={i % 2 === 0}
        />
      ))}

      <Footer settings={settings} />
    </>
  );
}
