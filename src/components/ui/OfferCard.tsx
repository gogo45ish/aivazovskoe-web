import type { Offer } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";

export default function OfferCard({ offer }: { offer: Offer }) {
  const src = strapiImageUrl(offer.image?.url);
  return (
    <div className="card-dark group overflow-hidden flex flex-col h-full">
      <div className="relative h-44 bg-green-700 overflow-hidden">
        {src && (
          <Image
            src={src}
            alt={offer.image?.alternativeText ?? offer.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
            unoptimized={strapiImageUnoptimized(src)}
          />
        )}
        {offer.badge && (
          <span
            className={`absolute top-4 left-4 z-10 text-[12px] font-medium px-3 py-1.5 rounded-md backdrop-blur-sm ${
              offer.badgeStyle === "gold"
                ? "bg-brass text-green-900"
                : "bg-white/12 text-[#d4b885]"
            }`}
          >
            {offer.badge}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-sand-100 text-[20px]">{offer.title}</h3>
        <p className="text-green-300 text-[13px] mt-3 mb-6 flex-1 leading-relaxed">
          {offer.description}
        </p>
        <Link href={`/offers/${offer.slug}`} className="btn-out self-start">
          Подробнее
        </Link>
      </div>
    </div>
  );
}
