import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconPhone, IconChevronRight, IconCircleCheck } from "@tabler/icons-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import DoctorCard from "@/components/lechenie/DoctorCard";
import {
  getTreatmentProgram,
  getTreatmentPrograms,
  getMedicalCenter,
  getDoctors,
  getSiteSettings,
} from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const programs = await getTreatmentPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getTreatmentProgram(slug);
  if (!p) return { title: "Программа не найдена — Санаторий «Айвазовское»" };
  return withSeo(
    {
      title: `${p.name} — Лечение — Санаторий «Айвазовское»`,
      description: p.condition,
    },
    `/lechenie/${slug}`
  );
}

export default async function ProgramPage({ params }: Params) {
  const { slug } = await params;
  const [program, center, allDoctors, { settings }] = await Promise.all([
    getTreatmentProgram(slug),
    getMedicalCenter(),
    getDoctors(),
    getSiteSettings(),
  ]);

  if (!program) notFound();

  const tel = `tel:${center.bookingPhone.replace(/[^+\d]/g, "")}`;
  const bodyParas = program.body?.split("\n\n").filter(Boolean) ?? [];
  const relevantDoctors = program.doctorSlugs?.length
    ? allDoctors.filter((d) => program.doctorSlugs!.includes(d.slug))
    : [];

  return (
    <>
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
            <Link href="/lechenie" className="hover:text-sand-100 transition-colors">
              Лечение
            </Link>
            <IconChevronRight size={14} className="opacity-60" />
            <span className="text-sand-100/80 line-clamp-1">{program.name}</span>
          </nav>

          <div className="eyebrow">Программа лечения</div>
          <h1
            className="text-sand-100"
            style={{ fontSize: "clamp(30px, 4.4vw, 54px)", maxWidth: "820px" }}
          >
            {program.name}
          </h1>
          <p className="text-green-300 text-[16px] mt-4 max-w-160 leading-[1.7]">
            {program.condition}
          </p>
        </div>
      </header>

      {/* Body */}
      <section className="section bg-sand-50">
        <div className="wrap grid md:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-start">
          <div>
            {bodyParas.length > 0 ? (
              <Reveal>
                <div className="space-y-5 max-w-160">
                  {bodyParas.map((p, i) => (
                    <p key={i} className="text-body text-[16px] leading-[1.85]">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <div className="rounded-lg border border-dashed border-line bg-white/60 p-8 max-w-160">
                  <div className="eyebrow">Описание готовится</div>
                  <p className="text-body text-[16px] leading-[1.8] mt-2">
                    Подробное описание программы «{program.name}» скоро появится.
                    Для записи и консультации, пожалуйста, свяжитесь с нами по
                    телефону.
                  </p>
                  <a href={tel} className="btn mt-6">
                    <IconPhone size={18} /> {center.bookingPhone}
                  </a>
                </div>
              </Reveal>
            )}

            {program.included?.length ? (
              <Reveal>
                <div className="mt-12">
                  <div className="eyebrow">Включено в программу</div>
                  <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-160">
                    {program.included.map((it) => (
                      <li key={it} className="flex gap-2.5 text-[15px] text-body">
                        <IconCircleCheck size={18} className="text-brass shrink-0 mt-0.5" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Booking aside */}
          <Reveal>
            <aside className="card-light p-7 md:sticky md:top-28">
              <div className="eyebrow">Запись</div>
              <p className="text-body text-[14px] leading-[1.7] mt-2">
                Стоимость и состав программы уточняйте у администратора.
              </p>
              {program.duration && (
                <div className="mt-4 flex justify-between gap-4 text-[14px] border-t border-line pt-4">
                  <span className="text-muted">Длительность</span>
                  <span className="text-ink font-medium">{program.duration}</span>
                </div>
              )}
              <a href={tel} className="btn w-full mt-6">
                <IconPhone size={18} /> Записаться
              </a>
              <div className="text-center text-muted text-[13px] mt-3">
                {center.bookingPhone}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Relevant doctors */}
      {relevantDoctors.length > 0 && (
        <section className="section bg-sand-50 pt-0">
          <div className="wrap">
            <Reveal className="mb-8">
              <div className="eyebrow">Врачи программы</div>
              <h2 className="text-ink" style={{ fontSize: "clamp(24px, 3vw, 34px)" }}>
                Специалисты
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relevantDoctors.map((d) => (
                <Reveal key={d.id}>
                  <DoctorCard doctor={d} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer settings={settings} />
    </>
  );
}
