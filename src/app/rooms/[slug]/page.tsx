import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  IconRuler,
  IconUsers,
  IconEye,
  IconBed,
  IconBuilding,
  IconChevronRight,
} from "@tabler/icons-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import RoomGallery from "@/components/ui/RoomGallery";
import { getRoom, getRooms, getSiteSettings } from "@/lib/strapi";
import { withSeo, breadcrumbLd, roomLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getAmenities } from "@/data/amenities";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) return { title: "Номер не найден — Санаторий «Айвазовское»" };
  return withSeo(
    {
      title: `${room.name} — Санаторий «Айвазовское»`,
      description: room.description,
    },
    `/rooms/${slug}`
  );
}

function guestLabel(n: number): string {
  if (n === 1) return "1 гость";
  if (n >= 2 && n <= 4) return `${n} гостя`;
  return `${n} гостей`;
}

export default async function RoomDetailPage({ params }: Params) {
  const { slug } = await params;
  const [room, { settings }] = await Promise.all([
    getRoom(slug),
    getSiteSettings(),
  ]);

  if (!room) notFound();

  const amenities = getAmenities(room.amenities);
  const categoryLabel =
    room.category === "two-room" ? "Двухкомнатный" : "Однокомнатный";

  // The TravelLine widget reads the room id from the page URL; the id is
  // editable per room in Strapi (Room.tlRoomType).
  const bookingHref = room.tlRoomType
    ? `/booking?room-type=${encodeURIComponent(room.tlRoomType)}`
    : "/booking";

  const facts = [
    room.sizeM2 && { Icon: IconRuler, label: "Площадь", value: `${room.sizeM2} м²` },
    { Icon: IconUsers, label: "Гостей", value: guestLabel(room.guests) },
    { Icon: IconEye, label: "Вид", value: room.view },
    room.beds && { Icon: IconBed, label: "Кровать", value: room.beds },
    room.building && { Icon: IconBuilding, label: "Корпус", value: room.building },
  ].filter(Boolean) as { Icon: typeof IconRuler; label: string; value: string }[];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Главная", path: "/" },
            { name: "Номера", path: "/rooms" },
            { name: room.name, path: `/rooms/${room.slug}` },
          ]),
          roomLd(room),
        ]}
      />
      <Nav />

      {/* Header */}
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
            <Link href="/rooms" className="hover:text-sand-100 transition-colors">
              Номера
            </Link>
            <IconChevronRight size={14} className="opacity-60" />
            <span className="text-sand-100/80 line-clamp-1">{room.name}</span>
          </nav>

          <div className="eyebrow">{categoryLabel} номер</div>
          <h1
            className="text-sand-100"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", maxWidth: "820px" }}
          >
            {room.name}
          </h1>
        </div>
      </header>

      {/* Gallery + booking */}
      <section className="section bg-sand-50">
        <div className="wrap grid md:grid-cols-[1.6fr_1fr] gap-10 lg:gap-14 items-start">
          <Reveal>
            <RoomGallery images={room.gallery ?? []} alt={room.name} />
          </Reveal>

          <Reveal>
            <aside className="card-light p-7 md:sticky md:top-28">
              <dl className="pb-5 space-y-3.5">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 text-[14px]">
                    <f.Icon size={18} className="text-brass shrink-0" />
                    <dt className="text-muted w-24 shrink-0">{f.label}</dt>
                    <dd className="text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Full-document nav (not <Link>): TravelLine reads room-type from
                  the URL at loader init, so a hard load guarantees pre-select. */}
              <a href={bookingHref} className="btn w-full">
                Забронировать
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                className="block text-center text-brass text-[14px] mt-4 hover:opacity-75 transition-opacity"
              >
                {settings.phone}
              </a>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Description + amenities */}
      <section className="bg-sand-50 pb-[clamp(78px,9vw,132px)]">
        <div className="wrap grid md:grid-cols-[1.6fr_1fr] gap-10 lg:gap-14 items-start">
          <div>
            <Reveal>
              <div className="eyebrow">О номере</div>
              <h2 className="text-ink" style={{ fontSize: "clamp(22px, 2.6vw, 30px)" }}>
                Описание
              </h2>
              <p className="text-body text-[16px] leading-[1.8] mt-5 max-w-160">
                {room.description}
              </p>
            </Reveal>
          </div>

          {amenities.length > 0 && (
            <Reveal>
              <div>
                <div className="eyebrow">Удобства</div>
                <h2
                  className="text-ink mb-5"
                  style={{ fontSize: "clamp(22px, 2.6vw, 30px)" }}
                >
                  В номере
                </h2>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {amenities.map((a) => (
                    <li
                      key={a.key}
                      className="flex items-center gap-2.5 text-[14px] text-body"
                    >
                      <a.Icon size={18} className="text-brass shrink-0" stroke={1.5} />
                      {a.label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
