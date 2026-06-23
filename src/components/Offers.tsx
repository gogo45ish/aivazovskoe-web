import type { Offer } from "@/types";
import Link from "next/link";
import Reveal from "./ui/Reveal";
import OfferCard from "./ui/OfferCard";

export default function Offers({ offers }: { offers: Offer[] }) {
  return (
    <section className="section bg-green-900" id="offers">
      <div className="wrap">
        <Reveal className="flex justify-between items-end gap-4 mb-12">
          <div className="max-w-130">
            <div className="eyebrow">Специальные предложения</div>
            <h2
              className="text-sand-100"
              style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}
            >
              Акции и предложения
            </h2>
            <p className="text-green-300 text-[15px] mt-3 leading-[1.7]">
              Сезонные предложения и привилегии для тех, кто планирует отдых
              заранее или приезжает надолго.
            </p>
          </div>
          <Link href="/offers" className="link-arrow shrink-0">
            Все акции →
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 0.1}>
              <OfferCard offer={offer} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
