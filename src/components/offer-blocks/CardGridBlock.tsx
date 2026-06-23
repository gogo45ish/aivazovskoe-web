import Image from "next/image";
import Link from "next/link";
import type { CardGridBlock as CardGridBlockType } from "@/types";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";

export default function CardGridBlock({ block }: { block: CardGridBlockType }) {
  const cards = block.cards ?? [];
  if (cards.length === 0) return null;

  return (
    <div className="wrap">
      {block.heading && (
        <h2
          className="text-ink mb-6"
          style={{ fontSize: "clamp(22px, 2.6vw, 30px)" }}
        >
          {block.heading}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const src = strapiImageUrl(card.image?.url);
          const inner = (
            <div className="card-light h-full overflow-hidden flex flex-col">
              {src && (
                <div className="relative h-40 bg-green-700">
                  <Image
                    src={src}
                    alt={card.image?.alternativeText ?? card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={strapiImageUnoptimized(src)}
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-ink text-[18px]">{card.title}</h3>
                {card.text && (
                  <p className="text-body text-[14px] mt-2 leading-relaxed flex-1">
                    {card.text}
                  </p>
                )}
                {card.href && <span className="link-arrow mt-4">Подробнее →</span>}
              </div>
            </div>
          );

          return card.href ? (
            <Link key={card.id} href={card.href} className="block group">
              {inner}
            </Link>
          ) : (
            <div key={card.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
