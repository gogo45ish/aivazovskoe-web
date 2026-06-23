import Link from "next/link";
import type { Room } from "@/types";
import Reveal from "./ui/Reveal";
import RoomCard from "./ui/RoomCard";

export default function Rooms({ rooms }: { rooms: Room[] }) {
  const featured = rooms.slice(0, 3);

  return (
    <section className="section bg-sand-50" id="rooms">
      <div className="wrap">
        <Reveal className="flex justify-between items-end gap-4 mb-12">
          <div className="max-w-130">
            <div className="eyebrow">Размещение</div>
            <h2
              className="text-ink"
              style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}
            >
              Номера и люксы
            </h2>
            <p className="text-body text-[15px] mt-3 leading-[1.7]">
              От уютных стандартов до просторных апартаментов — с видом на
              реликтовый парк или Чёрное море.
            </p>
          </div>
          <Link href="/rooms" className="link-arrow shrink-0">
            Все номера →
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((room, i) => (
            <Reveal key={room.id} delay={i * 0.1}>
              <RoomCard room={room} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
