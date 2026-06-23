import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import InfraSection from "@/components/infrastructure/InfraSection";
import { getInfrastructureItems, getSiteSettings } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Инфраструктура — Санаторий «Айвазовское»",
  description:
    "Инфраструктура санатория «Айвазовское»: ресторан, парк, японский сад, бассейн, тренажёрный зал, пляжная зона, кинотеатр, библиотека и многое другое.",
}, "/infrastructure");

export default async function InfrastructurePage() {
  const [items, { settings }] = await Promise.all([
    getInfrastructureItems(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Nav />

      <header className="bg-green-900 pt-[clamp(140px,18vh,180px)] pb-16">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Санаторий «Айвазовское»</div>
            <h1
              className="text-sand-100"
              style={{ fontSize: "clamp(34px, 5vw, 60px)", maxWidth: "780px" }}
            >
              Инфраструктура
            </h1>
            <p className="text-green-300 text-[16px] mt-5 max-w-150 leading-[1.7]">
              Всё для отдыха и оздоровления в одном месте — от ресторана и парка
              до бассейна, тренажёрного зала и пляжной зоны.
            </p>
          </Reveal>
        </div>
      </header>

      {items.map((item, i) => (
        <InfraSection
          key={item.id ?? item.title}
          item={item}
          index={i}
          total={items.length}
          dark={i % 2 === 1}
        />
      ))}

      <Footer settings={settings} />
    </>
  );
}
