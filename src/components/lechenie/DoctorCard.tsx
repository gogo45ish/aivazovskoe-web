import Link from "next/link";
import Image from "next/image";
import PlaceholderImage from "../ui/PlaceholderImage";
import { strapiImageUrl, strapiImageUnoptimized } from "@/lib/strapi";
import type { Doctor } from "@/types";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const src = strapiImageUrl(doctor.photo?.url);
  return (
    <Link
      href={`/vrachi/${doctor.slug}`}
      className="card-light group overflow-hidden flex flex-col"
    >
      <div className="relative aspect-4/5 overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={doctor.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 25vw"
            unoptimized={strapiImageUnoptimized(src)}
          />
        ) : (
          <PlaceholderImage className="absolute inset-0" label="фото врача" />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-ink text-[16px] leading-snug group-hover:text-brass transition-colors">
          {doctor.name}
        </h3>
        <p className="text-muted text-[13px] mt-1.5 leading-snug">
          {doctor.specialties.join(", ")}
        </p>
      </div>
    </Link>
  );
}
