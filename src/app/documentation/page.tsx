import type { Metadata } from "next";
import type { DocCategory } from "@/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import CredentialRow from "@/components/documentation/CredentialRow";
import DocSection from "@/components/documentation/DocSection";
import { getSiteSettings, getLegalDocuments, strapiImageUrl } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Документация — Санаторий «Айвазовское»",
  description:
    "Официальные документы санатория «Айвазовское»: реквизиты учреждения, регламентирующие документы, учётная политика, специальная оценка условий труда и прейскуранты.",
}, "/documentation");

const REGISTRATION = [
  "Данные документа, подтверждающего факт внесения сведений о юридическом лице в Единый государственный реестр юридических лиц, с указанием органа, осуществившего государственную регистрацию:",
  "Свидетельство о государственной регистрации юридического лица от 08 июля 2015 г., Инспекция Федеральной налоговой службы по г. Симферополю, № ГРН 1149102054232 от 09.10.2014.",
  "Учредитель: Российская Федерация.",
];

const SECTIONS: {
  category: DocCategory;
  eyebrow: string;
  title: string;
  dark: boolean;
}[] = [
  {
    category: "regulatory",
    eyebrow: "Раздел 01",
    title: "Регламентирующие документы",
    dark: true,
  },
  {
    category: "accounting",
    eyebrow: "Раздел 02",
    title: "Об учётной политике учреждения",
    dark: false,
  },
  {
    category: "sout",
    eyebrow: "Раздел 03",
    title: "Специальная оценка условий труда (СОУТ)",
    dark: true,
  },
  {
    category: "pricelist",
    eyebrow: "Раздел 04",
    title: "Прейскуранты",
    dark: false,
  },
];

export default async function DocumentationPage() {
  const [{ settings }, documents] = await Promise.all([
    getSiteSettings(),
    getLegalDocuments(),
  ]);

  const docsByCategory = (category: DocCategory) =>
    documents
      .filter((d) => d.category === category)
      .map((d) => ({
        title: d.title,
        href: strapiImageUrl(d.pdf?.url) ?? "#",
      }));

  return (
    <>
      <Nav />

      <PageHeader
        eyebrow="Официальная информация · Санаторий «Айвазовское»"
        title="Документация"
        intro="Реквизиты учреждения, регламентирующие документы, учётная политика, результаты специальной оценки условий труда и прейскуранты — в открытом доступе."
        facts={[
          { value: "ФГБУ", label: "федеральное учреждение" },
          { value: "УДП РФ", label: "Управление делами Президента" },
        ]}
      >
        <a href="#documents" className="btn">
          К документам
        </a>
      </PageHeader>

      {/* Реквизиты учреждения */}
      <section className="section bg-sand-50">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Реквизиты</div>
            <h2
              className="text-ink"
              style={{ fontSize: "clamp(26px, 3.4vw, 40px)" }}
            >
              Сведения об учреждении
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-[1.85] text-body">
              Полное наименование: Федеральное государственное бюджетное
              учреждение «Санаторий «Айвазовское» Управления делами Президента
              Российской Федерации.
            </p>
            <p className="mt-2 text-[15px] leading-[1.85] text-body">
              Сокращённое наименование: ФГБУ «Санаторий «Айвазовское».
            </p>
          </Reveal>

          <div className="mt-16 space-y-16 md:space-y-24">
            <CredentialRow paragraphs={REGISTRATION} label="Свидетельство о регистрации" />
            <CredentialRow paragraphs={REGISTRATION} label="Лист записи ЕГРЮЛ" flip />
          </div>
        </div>
      </section>

      <div id="documents">
        {SECTIONS.map((s) => (
          <DocSection
            key={s.category}
            eyebrow={s.eyebrow}
            title={s.title}
            docs={docsByCategory(s.category)}
            dark={s.dark}
          />
        ))}
      </div>

      <Footer settings={settings} />
    </>
  );
}
