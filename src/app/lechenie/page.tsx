import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { IconPhone, IconChevronRight, IconFileText } from "@tabler/icons-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import ParkHero from "@/components/park/ParkHero";
import DoctorCard from "@/components/lechenie/DoctorCard";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import {
  getMedicalCenter,
  getMedicalServices,
  getDoctors,
  getTreatmentPrograms,
  getSiteSettings,
  strapiImageUrl,
  strapiImageUnoptimized,
} from "@/lib/strapi";
import { unsplashUrl } from "@/data/media";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Лечение и медицинский центр — Санаторий «Айвазовское»",
  description:
    "Профилактика и лечение заболеваний органов дыхания, сердечно-сосудистой и нервной системы, опорно-двигательного аппарата. Программы лечения, медицинский центр, команда врачей.",
}, "/lechenie");

// Dev placeholder imagery (Unsplash) — swap for real photos later.
const PROGRAM_IMG: Record<string, string> = {
  "legkoe-dyhanie": unsplashUrl("photo-1505228395891-9a51e7e86bf6"),
  dolgoletie: unsplashUrl("photo-1540555700478-4be289fbecef"),
  "dvizhenie-bez-boli": unsplashUrl("photo-1540541338287-41700207dee6"),
};

const SERVICE_IMG: Record<string, string> = {
  Консультации: unsplashUrl("photo-1582719478250-c89cae4dc85b"),
  Массаж: unsplashUrl("photo-1540555700478-4be289fbecef"),
  Диагностика: unsplashUrl("photo-1611892440504-42a792e24d32"),
  Процедуры: unsplashUrl("photo-1540541338287-41700207dee6"),
  Водолечебница: unsplashUrl("photo-1571896349842-33c89424de2d"),
  Фитотерапия: unsplashUrl("photo-1455587734955-081b22074882"),
  "Лабораторные исследования": unsplashUrl("photo-1520250497591-112f2f40a3f4"),
  Косметология: unsplashUrl("photo-1505693416388-ac5ce068fe85"),
};

const POOL_IMG = unsplashUrl("photo-1571896349842-33c89424de2d");
const LFK_IMG = unsplashUrl("photo-1540555700478-4be289fbecef");

export default async function LecheniePage() {
  const [center, services, doctors, programs, { settings }] = await Promise.all([
    getMedicalCenter(),
    getMedicalServices(),
    getDoctors(),
    getTreatmentPrograms(),
    getSiteSettings(),
  ]);

  const tel = `tel:${center.bookingPhone.replace(/[^+\d]/g, "")}`;
  const poolParas = center.poolLfkText.split("\n\n").filter(Boolean);

  return (
    <>
      <Nav />

      {/* 1. Hero */}
      <ParkHero
        eyebrow="Санаторий «Айвазовское»"
        title="Лечение"
        intro="Оздоровление и медицинская помощь в атмосферном месте на Южном берегу Крыма."
        image={unsplashUrl("photo-1540555700478-4be289fbecef")}
      >
        <a href={tel} className="btn">
          <IconPhone size={18} /> {center.bookingPhone}
        </a>
      </ParkHero>

      {/* 2. Intro */}
      <section className="section bg-sand-50">
        <div className="wrap">
          <Reveal className="max-w-200">
            <div className="eyebrow">О лечении</div>
            <p className="font-serif text-ink text-[clamp(20px,2.6vw,30px)] leading-normal">
              {center.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. Программы лечения */}
      <section className="bg-sand-50 pb-[clamp(78px,9vw,132px)]">
        <div className="wrap">
          <Reveal className="mb-10">
            <div className="eyebrow">Программы</div>
            <h2 className="text-ink" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Программы лечения
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((p, i) => {
              const src =
                strapiImageUrl(p.heroImage?.url) ?? PROGRAM_IMG[p.slug];
              return (
                <Reveal key={p.id} delay={i * 0.08}>
                  <Link
                    href={`/lechenie/${p.slug}`}
                    className="card-light group h-full overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-3/4 overflow-hidden">
                      {src ? (
                        <Image
                          src={src}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 900px) 100vw, 33vw"
                          unoptimized={strapiImageUnoptimized(src)}
                        />
                      ) : (
                        <PlaceholderImage className="absolute inset-0" />
                      )}
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <div className="font-serif text-brass/40 text-[32px] leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="font-serif text-ink text-[23px] leading-snug mt-3 group-hover:text-brass transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-body text-[14px] leading-[1.6] mt-2 flex-1">
                        {p.condition}
                      </p>
                      <span className="link-arrow mt-5">Подробнее →</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Медицинский центр */}
      <section className="section bg-green-900">
        <div className="wrap">
          <Reveal className="max-w-200 mb-12">
            <div className="eyebrow">Медицинский центр</div>
            <h2 className="text-sand-100" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Современное оборудование
            </h2>
            <p className="text-green-300 text-[16px] leading-[1.8] mt-5">
              {center.centerLead}
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {center.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 0.06}>
                <div className="h-full border border-green-700/50 rounded-lg p-6">
                  <h3 className="font-serif text-sand-100 text-[18px] mb-3">
                    {c.title}
                  </h3>
                  <p className="text-green-300 text-[13.5px] leading-[1.7]">
                    {c.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Медицинские услуги */}
      <section className="section bg-sand-50">
        <div className="wrap">
          <Reveal className="mb-10">
            <div className="eyebrow">Услуги</div>
            <h2 className="text-ink" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
              Медицинские услуги
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {services.map((s, i) => {
              const img = SERVICE_IMG[s.name];
              return (
                <Reveal key={s.id} delay={(i % 4) * 0.06}>
                  <div className="card-light group h-full overflow-hidden">
                    <div className="relative aspect-16/10 overflow-hidden">
                      {img ? (
                        <Image
                          src={img}
                          alt={s.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 560px) 50vw, 25vw"
                        />
                      ) : (
                        <PlaceholderImage className="absolute inset-0" />
                      )}
                    </div>
                    <div className="p-4 text-ink text-[14px] leading-snug">
                      {s.name}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              {center.priceListPdf ? (
                <a
                  href={center.priceListPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  <IconFileText size={18} /> Список и стоимость медицинских услуг
                </a>
              ) : (
                <span
                  className="btn opacity-55 cursor-not-allowed"
                  aria-disabled="true"
                  title="Прайс-лист появится позже"
                >
                  <IconFileText size={18} /> Список и стоимость медицинских услуг
                </span>
              )}
              <span className="text-muted text-[14px]">
                Запись на услуги —{" "}
                <a href={tel} className="text-brass hover:opacity-75 transition-opacity">
                  {center.bookingPhone}
                </a>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Бассейн с морской водой и зал ЛФК */}
      <section className="section bg-green-900">
        <div className="wrap grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <div className="eyebrow">Бассейн и зал ЛФК</div>
              <h2 className="text-sand-100" style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}>
                Бассейн с морской водой и зал ЛФК
              </h2>
            </Reveal>
            {poolParas.map((p, i) => (
              <Reveal key={i}>
                <p className="text-green-300 text-[16px] leading-[1.8] mt-5 max-w-160">
                  {p}
                </p>
              </Reveal>
            ))}
            <Reveal>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/bassejn" className="btn-out">
                  Бассейн <IconChevronRight size={18} />
                </Link>
                <Link href="/trenazhernyj-zal" className="btn-out">
                  Тренажёрный зал <IconChevronRight size={18} />
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-3/4 rounded-lg overflow-hidden ring-1 ring-black/10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)]">
                <Image
                  src={POOL_IMG}
                  alt="Бассейн с морской водой"
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 50vw, 23vw"
                />
              </div>
              <div className="relative aspect-3/4 rounded-lg overflow-hidden ring-1 ring-black/10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)] mt-8">
                <Image
                  src={LFK_IMG}
                  alt="Зал лечебной физкультуры"
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 50vw, 23vw"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. Команда медработников */}
      <section className="section bg-sand-50">
        <div className="wrap">
          <Reveal className="flex justify-between items-end gap-4 mb-10">
            <div>
              <div className="eyebrow">Команда</div>
              <h2 className="text-ink" style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}>
                Команда медработников
              </h2>
            </div>
            <Link href="/vrachi" className="link-arrow shrink-0">
              Все врачи →
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {doctors.map((d) => (
              <Reveal key={d.id}>
                <DoctorCard doctor={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="section bg-green-900">
        <div className="wrap text-center max-w-160 mx-auto">
          <Reveal>
            <div className="eyebrow justify-center">Запись и консультация</div>
            <h2 className="text-sand-100" style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}>
              Подберём программу под ваше здоровье
            </h2>
            <a href={tel} className="btn mt-7">
              <IconPhone size={18} /> {center.bookingPhone}
            </a>
          </Reveal>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
