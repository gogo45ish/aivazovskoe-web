import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import {
  getEvents,
  getSiteSettings,
  strapiImageUrl,
  strapiImageUnoptimized,
} from "@/lib/strapi";
import { withSeo } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = withSeo({
  title: "Афиша — Санаторий «Айвазовское»",
  description:
    "Афиша мероприятий санатория «Айвазовское» — концерты, экскурсии и события на ближайшие даты.",
}, "/events");

export default async function EventsPage() {
  const [events, { settings }] = await Promise.all([
    getEvents(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Nav />

      <PageHeader
        eyebrow="Афиша · Санаторий «Айвазовское»"
        title="Афиша"
        intro="Концерты, экскурсии и события санатория. Афиша обновляется по мере появления новых мероприятий."
      />

      <section className="section bg-sand-50">
        <div className="wrap">
          {events.length === 0 ? (
            <Reveal>
              <p className="text-muted text-[15px] leading-[1.7] max-w-150">
                Скоро здесь появится афиша ближайших мероприятий.
              </p>
            </Reveal>
          ) : (
            // Grid fills row by row, keeping posters in chronological order
            // left-to-right (CSS columns would order them top-to-bottom).
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev, i) => {
                const src = strapiImageUrl(ev.cover?.url);
                if (!src) return null;
                return (
                  <Reveal
                    key={ev.id}
                    delay={(i % 3) * 0.08}
                  >
                    <div className="overflow-hidden rounded-lg ring-1 ring-line/40 shadow-[0_30px_60px_-35px_rgba(30,45,36,0.5)]">
                      <Image
                        src={src}
                        alt={ev.cover?.alternativeText ?? "Мероприятие санатория «Айвазовское»"}
                        width={ev.cover?.width ?? 800}
                        height={ev.cover?.height ?? 1100}
                        className="w-full h-auto"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        // First poster is the above-the-fold LCP on every breakpoint;
                        // preload it eagerly. The rest stay lazy.
                        priority={i === 0}
                        unoptimized={strapiImageUnoptimized(src)}
                      />
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
