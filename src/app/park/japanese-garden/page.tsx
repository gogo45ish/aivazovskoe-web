import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  IconClock,
  IconHourglass,
  IconMapPin,
  IconTicket,
  IconPhone,
  IconGift,
  IconCircleCheck,
} from "@tabler/icons-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import RoomGallery from "@/components/ui/RoomGallery";
import ParkHero from "@/components/park/ParkHero";
import SeasonsCarousel from "@/components/park/SeasonsCarousel";
import {
  getJapaneseGarden,
  getEveningTour,
  getSiteSettings,
  strapiImageUrl,
  strapiImageUnoptimized,
} from "@/lib/strapi";
import { jgHeroImage } from "@/data/park";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Японский сад — Санаторий «Айвазовское»",
  description:
    "Японский сад архитектора Широ Накане: о саде, сезоны японского сада, часы посещения и стоимость. Ежедневно 11:00–16:00, основной билет 800 ₽.",
}, "/park/japanese-garden");

export default async function JapaneseGardenPage() {
  const [jg, evening, { settings }] = await Promise.all([
    getJapaneseGarden(),
    getEveningTour(),
    getSiteSettings(),
  ]);

  const heroSrc = strapiImageUrl(jg.heroImage?.url) ?? jgHeroImage;
  const storyParas = jg.story.split("\n\n").filter(Boolean);
  const sideImg = jg.gallery?.[0];
  const sideSrc = strapiImageUrl(sideImg?.url);
  const eveningTel = `tel:${(evening.bookingMethod ?? "").replace(/[^+\d]/g, "")}`;

  return (
    <>
      <Nav />

      {/* 1. Hero */}
      <ParkHero
        eyebrow="Парк «Айвазовское»"
        title="Японский сад"
        intro="Сад архитектора Широ Накане"
        image={heroSrc}
        facts={[
          { value: "1 га", label: "площадь сада" },
          { value: "2010–2018", label: "годы создания" },
          { value: "Широ Накане", label: "автор" },
        ]}
      >
        <a href="#visit" className="btn">
          Часы и стоимость
        </a>
        <Link href="/park" className="btn-out">
          ← В парк
        </Link>
      </ParkHero>

      {/* 2. О саде — verbatim */}
      <section className="section bg-sand-50">
        <div className="wrap grid md:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <div className="eyebrow">О саде</div>
              <h2 className="text-ink" style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}>
                {jg.heading}
              </h2>
            </Reveal>
            {storyParas.map((p, i) => (
              <Reveal key={i}>
                {i === storyParas.length - 1 && storyParas.length > 1 ? (
                  <blockquote className="border-l-2 border-brass pl-6 mt-7 font-serif italic text-ink leading-[1.55] text-[clamp(18px,2.1vw,23px)]">
                    {p}
                  </blockquote>
                ) : (
                  <p className="text-body text-[16px] leading-[1.85] mt-5 max-w-160">
                    {p}
                  </p>
                )}
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="relative aspect-4/5 rounded-lg overflow-hidden ring-1 ring-black/5 shadow-[0_30px_70px_-40px_rgba(30,45,36,0.5)]">
              <Image
                src={sideSrc ?? heroSrc}
                alt="Японский сад"
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 42vw"
                unoptimized={strapiImageUnoptimized(sideSrc ?? heroSrc)}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Галерея */}
      <section className="section bg-sand-50 pt-0">
        <div className="wrap">
          <Reveal className="mb-10">
            <div className="eyebrow">Галерея</div>
            <h2 className="text-ink" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Атмосфера сада
            </h2>
          </Reveal>
          <Reveal>
            <RoomGallery images={jg.gallery ?? []} alt="Японский сад" />
          </Reveal>
        </div>
      </section>

      {/* 4. Сезоны японского сада — verbatim, signature block */}
      <section className="section bg-green-900">
        <div className="wrap">
          <Reveal className="mb-10 max-w-150">
            <div className="eyebrow">Сезоны японского сада</div>
            <h2 className="text-sand-100" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Круглый год — своё любование
            </h2>
          </Reveal>
          <Reveal>
            <SeasonsCarousel seasons={jg.seasonalEvents ?? []} />
          </Reveal>
        </div>
      </section>

      {/* 5. Часы посещения и стоимость — verbatim, inline */}
      <section className="section bg-sand-50" id="visit">
        <div className="wrap grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <Reveal>
            <div className="eyebrow">Посещение</div>
            <h2 className="text-ink" style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}>
              Часы посещения и стоимость
            </h2>
            <ul className="mt-7 space-y-5">
              {jg.hours && (
                <li className="flex gap-3">
                  <IconClock size={20} className="text-brass shrink-0 mt-0.5" />
                  <div className="text-[15px] text-body">{jg.hours}</div>
                </li>
              )}
              {jg.scheduleSlots?.length ? (
                <li className="flex gap-3">
                  <IconClock size={20} className="text-brass shrink-0 mt-0.5 opacity-0" />
                  <div>
                    <div className="text-[13px] text-muted mb-2">
                      График посещения
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {jg.scheduleSlots.map((t) => (
                        <span
                          key={t}
                          className="text-[14px] text-ink bg-white border border-line rounded-full px-3 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ) : null}
              {jg.durationMin && (
                <li className="flex gap-3">
                  <IconHourglass size={20} className="text-brass shrink-0 mt-0.5" />
                  <div className="text-[15px] text-body">
                    Продолжительность: {jg.durationMin} минут
                  </div>
                </li>
              )}
              {jg.startPoint && (
                <li className="flex gap-3">
                  <IconMapPin size={20} className="text-brass shrink-0 mt-0.5" />
                  <div className="text-[15px] text-body">{jg.startPoint}</div>
                </li>
              )}
              <li className="flex gap-3">
                <IconTicket size={20} className="text-brass shrink-0 mt-0.5" />
                <div className="text-[15px] text-body">
                  Билеты приобретаются в кассе при входе.
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal>
            <div className="card-light p-7">
              <div className="eyebrow">Стоимость</div>
              <div className="flex items-baseline justify-between gap-4 mt-2 pb-5 border-b border-line">
                <span className="text-ink text-[15px]">Основной билет</span>
                <span className="font-serif text-ink text-[30px] whitespace-nowrap">
                  {jg.mainTicketPrice}
                </span>
              </div>
              {jg.bookingPhone && (
                <div className="flex gap-3 mt-5">
                  <IconPhone size={20} className="text-brass shrink-0 mt-0.5" />
                  <div>
                    <a
                      href={`tel:${jg.bookingPhone.replace(/[^+\d]/g, "")}`}
                      className="text-[15px] text-ink hover:text-brass transition-colors"
                    >
                      {jg.bookingPhone}
                    </a>
                    <div className="text-muted text-[12px] mt-0.5">
                      Справки и групповые заявки
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Вечерняя экскурсия — verbatim, highlighted */}
      <section className="section bg-green-900">
        <div className="wrap">
          <Reveal className="max-w-200">
            <div className="eyebrow">Вечерняя экскурсия</div>
            <h2
              className="text-sand-100"
              style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
            >
              {evening.title}
            </h2>
            <p className="text-green-300 text-[16px] leading-[1.85] mt-5">
              {evening.description}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Reveal>
              <div className="bg-green-800 rounded-lg p-7 h-full">
                <div className="text-sand-100 font-medium mb-4">В программе</div>
                <ul className="space-y-2.5 text-[14px] text-green-300">
                  {evening.includes.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <IconCircleCheck size={18} className="text-brass shrink-0 mt-0.5" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="bg-green-800 rounded-lg p-7 h-full flex flex-col">
                {evening.bonus && (
                  <div className="flex gap-3">
                    <IconGift size={20} className="text-brass shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sand-100 font-medium mb-1">Бонус</div>
                      <p className="text-green-300 text-[14px] leading-[1.6]">
                        {evening.bonus}
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-auto pt-6">
                  <div className="text-green-300 text-[13px]">Стоимость</div>
                  <div className="font-serif text-sand-100 text-[22px]">
                    {evening.price ? evening.price : "Стоимость уточняется"}
                  </div>
                  {evening.bookingMethod && (
                    <a href={eveningTel} className="btn-out mt-4">
                      <IconPhone size={16} /> {evening.bookingMethod}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
