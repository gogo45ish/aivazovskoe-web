import Image from "next/image";
import PlaceholderImage from "../ui/PlaceholderImage";
import Reveal from "../ui/Reveal";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";
import type { Garden } from "@/types";

// Compact, secondary 3-card grid (the Japanese garden is the spotlight below).
export default function GardensSection({ gardens }: { gardens: Garden[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {gardens.map((g, i) => {
        const src = strapiImageUrl(g.image?.url);
        return (
          <Reveal key={g.id} delay={(i % 3) * 0.08}>
            <article className="card-light group h-full overflow-hidden flex flex-col">
              <div className="relative aspect-4/3 overflow-hidden">
                {src ? (
                  <Image
                    src={src}
                    alt={g.image?.alternativeText ?? g.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 900px) 100vw, 33vw"
                    unoptimized={strapiImageUnoptimized(src)}
                  />
                ) : (
                  <PlaceholderImage className="absolute inset-0" label={g.name} />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-serif text-ink text-[19px] leading-snug">
                  {g.name}
                </h3>
                <p className="text-body text-[14px] leading-[1.6] mt-2">{g.blurb}</p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
