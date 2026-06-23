import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IconPhone, IconChevronRight } from "@tabler/icons-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import {
  getDoctor,
  getDoctors,
  getMedicalCenter,
  getSiteSettings,
  strapiImageUrl,
  strapiImageUnoptimized,
} from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const doctors = await getDoctors();
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDoctor(slug);
  if (!d) return { title: "Врач не найден — Санаторий «Айвазовское»" };
  return withSeo(
    {
      title: `${d.name} — ${d.specialties.join(", ")} — Санаторий «Айвазовское»`,
      description: `${d.name} — ${d.specialties.join(", ")}.`,
    },
    `/vrachi/${slug}`
  );
}

export default async function DoctorPage({ params }: Params) {
  const { slug } = await params;
  const [doctor, center, { settings }] = await Promise.all([
    getDoctor(slug),
    getMedicalCenter(),
    getSiteSettings(),
  ]);

  if (!doctor) notFound();

  const tel = `tel:${center.bookingPhone.replace(/[^+\d]/g, "")}`;
  const photo = strapiImageUrl(doctor.photo?.url);
  const bioParas = doctor.bio?.split("\n\n").filter(Boolean) ?? [];

  return (
    <>
      <Nav />

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
            <Link href="/vrachi" className="hover:text-sand-100 transition-colors">
              Врачи
            </Link>
            <IconChevronRight size={14} className="opacity-60" />
            <span className="text-sand-100/80 line-clamp-1">{doctor.name}</span>
          </nav>

          <div className="eyebrow">{doctor.specialties.join(" · ")}</div>
          <h1
            className="text-sand-100"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", maxWidth: "820px" }}
          >
            {doctor.name}
          </h1>
        </div>
      </header>

      <section className="section bg-sand-50">
        <div className="wrap grid md:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-14 items-start">
          <Reveal>
            <div className="relative aspect-4/5 rounded-lg overflow-hidden ring-1 ring-black/5 shadow-[0_30px_70px_-40px_rgba(30,45,36,0.4)]">
              {photo ? (
                <Image
                  src={photo}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 100vw, 33vw"
                  unoptimized={strapiImageUnoptimized(photo)}
                />
              ) : (
                <PlaceholderImage className="absolute inset-0" label="фото врача" />
              )}
            </div>
          </Reveal>

          <Reveal>
            <div>
              <div className="eyebrow">О враче</div>
              <h2 className="text-ink" style={{ fontSize: "clamp(22px, 2.6vw, 30px)" }}>
                {doctor.specialties.join(", ")}
              </h2>

              {bioParas.length > 0 ? (
                <div className="space-y-4 mt-5 max-w-160">
                  {bioParas.map((p, i) => (
                    <p key={i} className="text-body text-[16px] leading-[1.8]">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-body text-[16px] leading-[1.8] mt-5 max-w-160">
                  Подробная информация о специалисте скоро появится. Для записи на
                  приём, пожалуйста, свяжитесь с нами по телефону.
                </p>
              )}

              <a href={tel} className="btn mt-7">
                <IconPhone size={18} /> Записаться на приём
              </a>
              <div className="text-muted text-[13px] mt-3">
                {center.bookingPhone}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
