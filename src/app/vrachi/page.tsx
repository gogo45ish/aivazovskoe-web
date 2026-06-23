import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/ui/Reveal";
import DoctorCard from "@/components/lechenie/DoctorCard";
import { getDoctors, getSiteSettings } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Врачи — Санаторий «Айвазовское»",
  description:
    "Команда медработников санатория «Айвазовское»: терапевты, кардиолог, невролог, физиотерапевт и другие специалисты.",
}, "/vrachi");

export default async function DoctorsPage() {
  const [doctors, { settings }] = await Promise.all([
    getDoctors(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Nav />

      <header className="bg-green-900 pt-[clamp(140px,18vh,180px)] pb-16">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Медицинский центр</div>
            <h1
              className="text-sand-100"
              style={{ fontSize: "clamp(34px, 5vw, 60px)", maxWidth: "780px" }}
            >
              Команда медработников
            </h1>
            <p className="text-green-300 text-[16px] mt-5 max-w-150 leading-[1.7]">
              Опытные специалисты санатория «Айвазовское» — терапевты,
              кардиолог, невролог, физиотерапевт и другие врачи.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="section bg-sand-50">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {doctors.map((d) => (
              <Reveal key={d.id}>
                <DoctorCard doctor={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
