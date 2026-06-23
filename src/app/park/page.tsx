import type { Metadata } from "next";
import Link from "next/link";
import {
  IconClock,
  IconMapPin,
  IconPhone,
  IconTicket,
  IconCalendarEvent,
} from "@tabler/icons-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import RoomGallery from "@/components/ui/RoomGallery";
import ParkHero from "@/components/park/ParkHero";
import GardensSection from "@/components/park/GardensSection";
import PricingSection from "@/components/park/PricingSection";
import RulesSection from "@/components/park/RulesSection";
import { getParkContent, getSiteSettings } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";
import { parkHeroImage } from "@/data/park";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Экскурсии по парку «Айвазовское» — расписание и билеты",
  description:
    "Экскурсии по парку «Айвазовское»: расписание, стоимость билетов, льготные категории, японский сад и правила посещения. Один билет — весь парк.",
}, "/park");

const LAT = 44.582876;
const LON = 34.344372;
const MAP_SRC = `https://yandex.ru/map-widget/v1/?ll=${LON},${LAT}&z=16&pt=${LON},${LAT},pm2rdm&l=map&lang=ru_RU`;

function ruDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}.${m}.${y}` : iso;
}

export default async function ParkPage() {
  const [park, { settings }] = await Promise.all([
    getParkContent(),
    getSiteSettings(),
  ]);
  const { info, gardens, jg, schedule, tiers, free, rules } = park;
  const tel = `tel:${info.bookingPhone.replace(/[^+\d]/g, "")}`;

  return (
    <>
      <Nav />

      {/* 1. Hero */}
      <ParkHero
        eyebrow="Парк-памятник · Партенит"
        title="Экскурсии по парку"
        intro="Один билет — весь парк и все тематические сады. Экскурсии ежедневно от скульптуры И. К. Айвазовского."
        image={parkHeroImage}
        facts={[
          ...(info.areaHa ? [{ value: `${info.areaHa} га`, label: "площадь парка" }] : []),
          { value: "4", label: "тематических сада" },
          { value: "Ежедневно", label: "без выходных" },
        ]}
      >
        <a href="#schedule" className="btn">
          Расписание экскурсий
        </a>
        <a href="#pricing" className="btn-out">
          Стоимость билетов
        </a>
      </ParkHero>

      {/* 2. О парке + сады */}
      <section className="section bg-sand-50">
        <div className="wrap">
          <Reveal className="max-w-160 mb-12">
            <div className="eyebrow">О парке</div>
            <h2 className="text-ink" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Сады парка
            </h2>
            <p className="text-body text-[16px] leading-[1.8] mt-5">{info.intro}</p>
          </Reveal>
          <GardensSection gardens={gardens} />
        </div>
      </section>

      {/* 3. Японский сад — spotlight */}
      <section className="section bg-green-900" id="japanese-garden">
        <div className="wrap grid md:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 items-start">
          <Reveal>
            <RoomGallery images={jg.gallery ?? []} alt="Японский сад" />
          </Reveal>
          <Reveal>
            <div className="bg-sand-50 rounded-lg p-7 md:sticky md:top-28">
              <div className="eyebrow">Японский сад</div>
              <h2 className="text-ink" style={{ fontSize: "clamp(24px, 3vw, 32px)" }}>
                {jg.heading}
              </h2>
              <div className="mt-4 space-y-3">
                {(jg.spotlightText ?? jg.story)
                  .split("\n\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <p
                      key={i}
                      className="text-body text-[15px] leading-[1.8]"
                    >
                      {p}
                    </p>
                  ))}
              </div>

              <div className="mt-6 pt-6 border-t border-line">
                <div className="flex items-center gap-2 text-ink font-medium mb-2">
                  <IconTicket size={18} className="text-brass" />
                  Отдельный билет — со своим расписанием
                </div>
                <p className="text-muted text-[13px]">
                  Посещение японского сада не входит в общую экскурсию по парку.
                </p>
                <Link
                  href={jg.pageLink ?? "/park/japanese-garden"}
                  className="btn mt-5"
                >
                  Подробнее о Японском саде →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Расписание экскурсий */}
      <section className="section bg-sand-50" id="schedule">
        <div className="wrap">
          <Reveal className="mb-10">
            <div className="eyebrow">Расписание</div>
            <h2 className="text-ink" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Расписание экскурсий
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="card-light p-7 h-full">
                <div className="text-ink font-medium mb-4">Будни · Пн–Пт</div>
                <div className="flex flex-wrap gap-2 mb-7">
                  {schedule.weekdayTimes.map((t) => (
                    <span
                      key={t}
                      className="text-[14px] text-ink bg-sand-50 border border-line rounded-full px-3 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-ink font-medium mb-4">Выходные · Сб–Вс</div>
                <div className="flex flex-wrap gap-2">
                  {schedule.weekendTimes.map((t) => (
                    <span
                      key={t}
                      className="text-[14px] text-ink bg-sand-50 border border-line rounded-full px-3 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="card-light p-7 h-full">
                <div className="flex items-center gap-2 text-ink font-medium mb-5">
                  <IconCalendarEvent size={18} className="text-brass" />
                  Тематические экскурсии
                </div>
                <ul className="space-y-4">
                  {schedule.themedExcursions.map((ex) => (
                    <li key={ex.title}>
                      <div className="font-serif text-ink text-[17px] leading-snug">
                        {ex.title}
                      </div>
                      <div className="text-brass text-[14px] mt-1">
                        {ex.scheduleText}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-7 text-[14px] text-muted">
              <span className="flex items-center gap-2">
                <IconMapPin size={16} className="text-brass" /> {schedule.startPoint}
              </span>
              <span className="flex items-center gap-2">
                <IconClock size={16} className="text-brass" />{" "}
                {schedule.ticketOfficeHours}
              </span>
            </div>
            <p className="text-muted text-[13px] mt-3">
              Расписание действует с {ruDate(schedule.validFrom)} по{" "}
              {ruDate(schedule.validTo)}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5. Стоимость */}
      <section className="section bg-sand-50" id="pricing">
        <div className="wrap">
          <Reveal className="mb-10">
            <div className="eyebrow">Билеты</div>
            <h2 className="text-ink" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Стоимость посещения
            </h2>
          </Reveal>
          <PricingSection
            tiers={tiers}
            free={free}
            validityNote={info.validityNote}
            bookingPhone={info.bookingPhone}
          />
        </div>
      </section>

      {/* 6. Правила посещения */}
      <section className="section bg-green-900">
        <div className="wrap">
          <Reveal className="mb-10 max-w-160">
            <div className="eyebrow">Правила</div>
            <h2 className="text-sand-100" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Правила посещения
            </h2>
          </Reveal>
          <RulesSection rules={rules} />
        </div>
      </section>

      {/* 7. Как добраться / посещение */}
      <section className="section bg-sand-50" id="visit">
        <div className="wrap grid md:grid-cols-[1fr_1.4fr] gap-10 items-stretch">
          <Reveal>
            <div className="eyebrow">Посещение</div>
            <h2 className="text-ink" style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}>
              Как добраться
            </h2>
            <div className="mt-7 space-y-5">
              <div className="flex gap-3">
                <IconMapPin size={20} className="text-brass shrink-0 mt-0.5" />
                <div
                  className="text-[14px] text-body leading-snug"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {settings.address}
                </div>
              </div>
              <div className="flex gap-3">
                <IconTicket size={20} className="text-brass shrink-0 mt-0.5" />
                <div className="text-[14px] text-body">
                  Билеты приобретаются в кассе парка при входе.
                </div>
              </div>
              <div className="flex gap-3">
                <IconClock size={20} className="text-brass shrink-0 mt-0.5" />
                <div className="text-[14px] text-body">{info.ticketOfficeHours}</div>
              </div>
              <div className="flex gap-3">
                <IconPhone size={20} className="text-brass shrink-0 mt-0.5" />
                <div>
                  <a
                    href={tel}
                    className="text-[14px] text-ink hover:text-brass transition-colors"
                  >
                    {info.bookingPhone}
                  </a>
                  <div className="text-muted text-[12px] mt-0.5">
                    Справки и групповые заявки
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <iframe
              src={MAP_SRC}
              title="Парк «Айвазовское» на карте"
              className="rounded-lg min-h-85 w-full h-full border-0 ring-1 ring-line shadow-[0_28px_55px_-30px_rgba(30,45,36,0.4)]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
