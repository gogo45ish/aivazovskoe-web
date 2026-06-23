"use client";
import Image from "next/image";
import Link from "next/link";
import { IconRuler, IconUsers, IconEye } from "@tabler/icons-react";
import type { Room } from "@/types";
import { getAmenities } from "@/data/amenities";
import PlaceholderImage from "./PlaceholderImage";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";

function guestLabel(n: number): string {
  if (n === 1) return "1 гость";
  if (n >= 2 && n <= 4) return `${n} гостя`;
  return `${n} гостей`;
}

export default function RoomCard({ room }: { room: Room }) {
  const amenities = getAmenities(room.amenities);
  const img = room.gallery?.[0];
  const href = `/rooms/${room.slug}`;

  return (
    <article className="card-light group overflow-hidden h-full flex flex-col">
      <Link href={href} className="relative h-56 overflow-hidden block">
        {img ? (
          <Image
            src={strapiImageUrl(img.url)!}
            alt={img.alternativeText ?? room.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
            unoptimized={strapiImageUnoptimized(strapiImageUrl(img.url))}
          />
        ) : (
          <PlaceholderImage className="h-56" />
        )}
        {room.building && (
          <span className="absolute top-4 left-4 z-10 bg-green-900/85 text-sand-100 text-[12px] px-3 py-1.5 rounded-md backdrop-blur-sm">
            {room.building}
          </span>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link href={href}>
          <h3 className="text-ink text-[19px] leading-snug hover:text-brass transition-colors">
            {room.name}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-muted text-[13px]">
          {room.sizeM2 && (
            <span className="flex items-center gap-1.5">
              <IconRuler size={15} className="text-brass" /> {room.sizeM2} м²
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <IconUsers size={15} className="text-brass" /> {guestLabel(room.guests)}
          </span>
          <span className="flex items-center gap-1.5">
            <IconEye size={15} className="text-brass" /> {room.view}
          </span>
        </div>

        <p className="text-body text-[14px] leading-[1.6] mt-4 flex-1">
          {room.description}
        </p>

        {amenities.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-line">
            {amenities.map((a) => (
              <li
                key={a.key}
                className="flex items-center gap-1.5 text-[12px] text-body bg-sand-50 border border-line rounded-full pl-2 pr-3 py-1"
              >
                <a.Icon size={14} className="text-brass" stroke={1.5} />
                {a.label}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-end justify-end gap-3 mt-5">
          <Link href={href} className="btn-out shrink-0">
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
