import type { SiteSettings } from "@/types";
import { IconMapPin, IconPlane, IconPhone } from "@tabler/icons-react";
import Reveal from "./ui/Reveal";

const LAT = 44.582876;
const LON = 34.344372;
const MAP_SRC = `https://yandex.ru/map-widget/v1/?ll=${LON},${LAT}&z=16&pt=${LON},${LAT},pm2rdm&l=map&lang=ru_RU`;
const ROUTE_HREF = `https://yandex.ru/maps/?ll=${LON},${LAT}&z=16&pt=${LON},${LAT},pm2rdm`;

export default function Location({ settings }: { settings: SiteSettings }) {
  return (
    <section className="section bg-green-900" id="location">
      <div className="wrap grid md:grid-cols-[1fr_1.4fr] gap-12 items-stretch">
        <div>
          <Reveal>
            <div className="eyebrow">Как добраться</div>
            <h2
              className="text-sand-100"
              style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}
            >
              Расположение
            </h2>
          </Reveal>

          <div className="mt-7 space-y-4.5">
            <div className="flex gap-3">
              <IconMapPin size={19} className="text-brass shrink-0 mt-0.5" />
              <div
                className="text-[14px] text-sand-100 leading-snug"
                style={{ whiteSpace: "pre-line" }}
              >
                {settings.address}
              </div>
            </div>
            <div className="flex gap-3">
              <IconPlane size={19} className="text-brass shrink-0 mt-0.5" />
              <div
                className="text-[13px] text-green-300 leading-snug"
                style={{ whiteSpace: "pre-line" }}
              >
                {settings.addressLine2}
              </div>
            </div>
            <div className="flex gap-3">
              <IconPhone size={19} className="text-brass shrink-0 mt-0.5" />
              <div className="text-[14px] text-sand-100">{settings.phone}</div>
            </div>
          </div>

          <a
            href={ROUTE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-8 inline-flex"
          >
            Построить маршрут →
          </a>
        </div>

        <iframe
          src={MAP_SRC}
          title="Санаторий «Айвазовское» на карте"
          className="rounded-lg min-h-85 w-full border-0 ring-1 ring-green-700/60 shadow-[0_28px_55px_-30px_rgba(0,0,0,0.6)]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
