import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RoomCard from "@/components/ui/RoomCard";
import Reveal from "@/components/ui/Reveal";
import { getRooms, getSiteSettings } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";
import type { Room } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Номера и люксы — Санаторий «Айвазовское»",
  description:
    "Однокомнатные и двухкомнатные номера, люксы и апартаменты с видом на парк и Чёрное море. Стандарт, Стандарт Комфорт, Джуниор Сюит, Люкс.",
}, "/rooms");

function CategorySection({
  eyebrow,
  title,
  rooms,
}: {
  eyebrow: string;
  title: string;
  rooms: Room[];
}) {
  if (!rooms.length) return null;
  return (
    <div className="mb-20 last:mb-0">
      <Reveal className="mb-10">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="text-ink" style={{ fontSize: "clamp(24px, 3vw, 34px)" }}>
          {title}
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rooms.map((room, i) => (
          <Reveal key={room.id} delay={(i % 3) * 0.08}>
            <RoomCard room={room} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default async function RoomsPage() {
  const [rooms, { settings }] = await Promise.all([
    getRooms(),
    getSiteSettings(),
  ]);

  const oneRoom = rooms.filter((r) => r.category === "one-room");
  const twoRoom = rooms.filter((r) => r.category === "two-room");

  return (
    <>
      <Nav />

      {/* Page header — dark so the transparent fixed nav stays legible */}
      <header className="bg-green-900 pt-[clamp(140px,18vh,180px)] pb-16">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Размещение</div>
            <h1
              className="text-sand-100"
              style={{ fontSize: "clamp(34px, 5vw, 60px)", maxWidth: "780px" }}
            >
              Номера и люксы
            </h1>
            <p className="text-green-300 text-[16px] mt-5 max-w-150 leading-[1.7]">
              Уютные стандарты, просторные люксы и апартаменты — с видом на
              реликтовый парк или Чёрное море. Все номера оснащены всем
              необходимым для комфортного отдыха.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="section bg-sand-50">
        <div className="wrap">
          <CategorySection
            eyebrow="Один номер"
            title="Однокомнатные"
            rooms={oneRoom}
          />
          <CategorySection
            eyebrow="Два номера"
            title="Двухкомнатные"
            rooms={twoRoom}
          />
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
