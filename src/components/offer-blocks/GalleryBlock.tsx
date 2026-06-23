import Image from "next/image";
import type { GalleryBlock as GalleryBlockType } from "@/types";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";

export default function GalleryBlock({ block }: { block: GalleryBlockType }) {
  const images = block.images ?? [];
  if (images.length === 0) return null;

  return (
    <div className="wrap">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => {
          const src = strapiImageUrl(img.url);
          if (!src) return null;
          return (
            <div
              key={img.id}
              className="relative aspect-[4/3] rounded-lg overflow-hidden bg-green-700"
            >
              <Image
                src={src}
                alt={img.alternativeText ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized={strapiImageUnoptimized(src)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
