import type { Metadata } from "next";
import type { Contact } from "@/types";
import { IconClock, IconMail, IconPhone } from "@tabler/icons-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Location from "@/components/Location";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { getSiteSettings, getContacts } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Контакты — Санаторий «Айвазовское»",
  description:
    "Телефоны и адреса отделов санатория «Айвазовское»: бронирование, парк, водолечебница, медицинский центр, отдел кадров и приёмная директора.",
}, "/contacts");

const telHref = (number: string) => `tel:${number.replace(/[^\d+]/g, "")}`;

function DepartmentCard({ dept, delay }: { dept: Contact; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="card-light h-full p-7 flex flex-col">
        <h3 className="font-serif text-ink text-[20px] leading-snug">
          {dept.title}
        </h3>
        {dept.note && (
          <p className="text-muted text-[13px] mt-1.5">{dept.note}</p>
        )}

        {dept.hours && (
          <div className="flex items-center gap-2 mt-4 text-[13px] text-muted">
            <IconClock size={16} className="text-brass shrink-0" />
            {dept.hours}
          </div>
        )}

        <div className="mt-4 space-y-3">
          {dept.phones.map((phone) => (
            <div key={phone.number}>
              {phone.label && (
                <div className="text-[12px] text-muted mb-0.5">
                  {phone.label}
                </div>
              )}
              <a
                href={telHref(phone.number)}
                className="flex items-center gap-2.5 text-ink text-[15px] font-medium hover:text-brass transition-colors"
              >
                <IconPhone size={16} className="text-brass shrink-0" />
                {phone.number}
              </a>
            </div>
          ))}
        </div>

        {dept.email && (
          <a
            href={`mailto:${dept.email}`}
            className="link-arrow mt-auto pt-5 inline-flex items-center gap-2 self-start"
          >
            <IconMail size={16} className="text-brass shrink-0" />
            {dept.email}
          </a>
        )}
      </div>
    </Reveal>
  );
}

export default async function ContactsPage() {
  const [{ settings }, contacts] = await Promise.all([
    getSiteSettings(),
    getContacts(),
  ]);

  return (
    <>
      <Nav />

      <PageHeader
        eyebrow="Связаться с нами · Санаторий «Айвазовское»"
        title="Контакты"
        intro="Прямые телефоны и адреса электронной почты отделов санатория — от бронирования и экскурсий по парку до медицинского центра и приёмной директора."
        facts={[
          { value: "8 (800) 777-00-97", label: "бесплатно по России" },
          { value: "с 8:00", label: "до 16:30 — бронирование" },
        ]}
      >
        <a href="tel:88007770097" className="btn">
          Позвонить
        </a>
        <a href="#location" className="btn-out">
          Как добраться
        </a>
      </PageHeader>

      <section className="section bg-sand-50">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Отделы и службы</div>
            <h2
              className="text-ink"
              style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}
            >
              Кому позвонить
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {contacts.map((dept, i) => (
              <DepartmentCard
                key={dept.id ?? dept.title}
                dept={dept}
                delay={(i % 3) * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      <Location settings={settings} />

      <Footer settings={settings} />
    </>
  );
}
