import { IconPhone } from "@tabler/icons-react";
import type { PriceTier, FreeCategory } from "@/types";
import Reveal from "../ui/Reveal";

export default function PricingSection({
  tiers,
  free,
  validityNote,
  bookingPhone,
}: {
  tiers: PriceTier[];
  free: FreeCategory[];
  validityNote: string;
  bookingPhone: string;
}) {
  const standard = tiers.filter((t) => !t.isGroupOrSpecial);
  const special = tiers.filter((t) => t.isGroupOrSpecial);
  const tel = `tel:${bookingPhone.replace(/[^+\d]/g, "")}`;

  return (
    <div>
      {/* Standard tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {standard.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.08}>
            <div className="card-light h-full p-6 flex flex-col">
              <div className="text-muted text-[13px]">{t.label}</div>
              <div className="font-serif text-ink text-[32px] leading-none mt-2">
                {t.price}
              </div>
              <p className="text-body text-[13px] leading-[1.6] mt-3">
                {t.condition}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Special / phone-only tiers, visually set apart */}
      {special.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {special.map((t) => (
            <Reveal key={t.id}>
              <div className="rounded-lg border border-brass/40 bg-green-900 p-6 h-full flex flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-sand-100 text-[15px] font-medium">
                    {t.label}
                  </div>
                  <div className="font-serif text-brass text-[22px] whitespace-nowrap">
                    {t.price}
                  </div>
                </div>
                <p className="text-green-300 text-[13px] leading-[1.6] mt-3 flex-1">
                  {t.condition}
                </p>
                <a href={tel} className="btn-out mt-5 self-start">
                  <IconPhone size={16} /> Записаться по телефону
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <p className="text-muted text-[13px] mt-6">{validityNote}</p>

      {/* Free categories — static panel */}
      <Reveal>
        <div className="mt-8 bg-sand-100/60 border border-line rounded-lg p-7">
          <h3 className="font-serif text-ink text-[19px] mb-1">
            Бесплатно — льготные категории
          </h3>
          <p className="text-muted text-[13px] mb-5">
            При предъявлении оригиналов документов
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 text-[14px] text-body">
            {free.map((f) => (
              <li key={f.id} className="flex gap-2.5">
                <span className="mt-2 w-1 h-1 rounded-full bg-brass shrink-0" />
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
