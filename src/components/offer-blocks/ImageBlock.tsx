import Image from "next/image";
import type { ImageBlock as ImageBlockType } from "@/types";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";

export default function ImageBlock({ block }: { block: ImageBlockType }) {
  const src = strapiImageUrl(block.media?.url);
  if (!src) return null;

  return (
    <figure className="wrap">
      <div className="relative max-w-[960px] mx-auto aspect-[16/9] rounded-xl overflow-hidden bg-green-700">
        <Image
          src={src}
          alt={block.media?.alternativeText ?? block.caption ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 960px) 100vw, 960px"
          unoptimized={strapiImageUnoptimized(src)}
        />
      </div>
      {block.caption && (
        <figcaption className="text-muted text-[13px] text-center mt-3 max-w-[960px] mx-auto">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
