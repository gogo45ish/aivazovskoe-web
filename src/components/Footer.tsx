import Link from "next/link";
import type { SiteSettings } from "@/types";
import {
  IconBrandTelegram,
  IconBrandVk,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

// Mirror the navbar — "Курорт" (PRIMARY) + "Гостям" (SECONDARY)
const RESORT: [href: string, label: string][] = [
  ["/rooms", "Номера"],
  ["/park", "Парк"],
  ["/lechenie", "Лечение"],
  ["/infrastructure", "Инфраструктура"],
  ["/restaurants", "Рестораны"],
];

const GUESTS: [href: string, label: string][] = [
  ["#offers", "Акции"],
  ["#reviews", "Отзывы"],
  ["#", "Афиша"],
  ["/documentation", "Документация"],
  ["/contacts", "Контакты"],
];

function FooterLink({ href, label }: { href: string; label: string }) {
  const className =
    "block text-green-300 text-[13px] mb-[10px] hover:text-sand-100 transition-colors";
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-green-900 pt-20 pb-8">
      <div className="wrap">
        <div className="rule mb-14" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1.1fr] gap-y-10 gap-x-8">
          <div>
            <div className="font-serif text-sand-100 text-[21px] tracking-[0.1em] mb-[14px]">
              АЙВАЗОВСКОЕ
            </div>
            <div className="text-green-300 text-[13px] max-w-[240px] mb-[18px]">
              Парк-курорт на Южном берегу Крыма, в посёлке Партенит.
            </div>
            <div className="flex gap-[14px] text-green-300">
              <a
                href={settings.socials.telegram ?? "#"}
                className="hover:text-brass transition-colors"
                aria-label="Telegram"
              >
                <IconBrandTelegram size={21} />
              </a>
              <a
                href={settings.socials.vk ?? "#"}
                className="hover:text-brass transition-colors"
                aria-label="ВКонтакте"
              >
                <IconBrandVk size={21} />
              </a>
              <a
                href={settings.socials.whatsapp ?? "#"}
                className="hover:text-brass transition-colors"
                aria-label="WhatsApp"
              >
                <IconBrandWhatsapp size={21} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sand-100 text-[14px] font-medium mb-[14px]">
              Санаторий
            </h4>
            {RESORT.map(([href, label]) => (
              <FooterLink key={label} href={href} label={label} />
            ))}
          </div>

          <div>
            <h4 className="font-sans text-sand-100 text-[14px] font-medium mb-[14px]">
              Гостям
            </h4>
            {GUESTS.map(([href, label]) => (
              <FooterLink key={label} href={href} label={label} />
            ))}
          </div>

          <div>
            <h4 className="font-sans text-sand-100 text-[14px] font-medium mb-[14px]">
              Бронирование
            </h4>
            <div className="font-serif text-brass text-[20px] mb-1">
              {settings.phone}
            </div>
            <div className="text-green-300 text-[12px] mb-4">
              {settings.hours}
            </div>
            <a href="#booking" className="btn">
              Забронировать
            </a>
          </div>
        </div>

        <div className="border-t border-green-700 mt-[34px] pt-[18px] flex justify-between flex-wrap gap-[10px]">
          <span className="text-green-500 text-[12px]">
            © 2026 Санаторий «Айвазовское» · Управление делами Президента РФ
          </span>
          <span className="text-green-500 text-[12px]">
            Политика конфиденциальности · Карта сайта
          </span>
        </div>
      </div>
    </footer>
  );
}
