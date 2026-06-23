import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import YandexReviews from "@/components/YandexReviews";
import { getSiteSettings } from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Отзывы — Санаторий «Айвазовское»",
  description:
    "Что пишут наши гости. Реальные, прошедшие модерацию отзывы о санатории «Айвазовское» на Яндекс Картах — рейтинг и впечатления тех, кто уже отдыхал у нас.",
}, "/reviews");

const REASONS = [
  "Яндекс — одна из крупнейших поисковых систем в мире, и репутация для компании крайне важна. Она не станет рисковать своим положением, публикуя поддельные отзывы.",
  "Отзывы проходят строгую модерацию и отражают реальное мнение пользователей.",
  "Гости оставляют отзывы охотно — это удобно и быстро. Часто впечатлениями делятся сразу после поездки, поэтому они получаются искренними и честными.",
];

export default async function ReviewsPage() {
  const { settings } = await getSiteSettings();

  return (
    <>
      <Nav />

      <PageHeader
        eyebrow="Впечатления гостей · Санаторий «Айвазовское»"
        title="Отзывы"
        intro="Реальные, прошедшие модерацию отзывы тех, кто уже провёл отпуск в «Айвазовском» — собраны прямо с Яндекс Карт."
        facts={[
          { value: "5.0", label: "рейтинг на Яндекс Картах" },
          { value: "★★★★★", label: "по оценкам гостей" },
        ]}
      >
        <a
          href="https://yandex.ru/maps/org/ayvazovskoye/54713465134/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          Оставить отзыв
        </a>
      </PageHeader>

      <section className="section bg-sand-50">
        <div className="wrap">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Editorial copy */}
            <Reveal>
              <div className="lg:sticky lg:top-32">
                <div className="eyebrow">Что пишут наши гости</div>
                <h2
                  className="text-ink"
                  style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}
                >
                  Отзывы
                </h2>
                <p className="text-body mt-5 text-[15px] leading-[1.7]">
                  Отзывам на Яндексе можно доверять по нескольким причинам:
                </p>

                <ul className="mt-7 space-y-6">
                  {REASONS.map((reason, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-serif text-brass text-[22px] leading-none shrink-0 pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-body text-[15px] leading-[1.7]">
                        {reason}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Live Yandex reviews widget */}
            <Reveal delay={0.1}>
              <YandexReviews />
            </Reveal>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
