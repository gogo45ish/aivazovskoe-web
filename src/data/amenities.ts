import {
  IconWifi,
  IconSnowflake,
  IconDeviceTv,
  IconFridge,
  IconLock,
  IconPhone,
  IconBath,
  IconWindow,
  IconUmbrella,
  IconSofa,
  IconBeach,
  IconTrees,
} from "@tabler/icons-react";

type IconComponent = React.ComponentType<{
  size?: number | string;
  className?: string;
  stroke?: number;
}>;

export interface Amenity {
  key: string;
  label: string;
  Icon: IconComponent;
}

// Canonical catalog. Room data references these by key; the source site shows
// these as image-icons, so we render our own consistent Tabler set instead.
export const AMENITIES: Record<string, Amenity> = {
  wifi: { key: "wifi", label: "Wi-Fi", Icon: IconWifi },
  ac: { key: "ac", label: "Кондиционер", Icon: IconSnowflake },
  tv: { key: "tv", label: "Телевизор", Icon: IconDeviceTv },
  fridge: { key: "fridge", label: "Холодильник", Icon: IconFridge },
  safe: { key: "safe", label: "Сейф", Icon: IconLock },
  phone: { key: "phone", label: "Телефон", Icon: IconPhone },
  bath: { key: "bath", label: "Душ / санузел", Icon: IconBath },
  balcony: { key: "balcony", label: "Балкон", Icon: IconWindow },
  terrace: { key: "terrace", label: "Терраса", Icon: IconUmbrella },
  lounge: { key: "lounge", label: "Лаунж-зона", Icon: IconSofa },
  seaView: { key: "seaView", label: "Вид на море", Icon: IconBeach },
  parkView: { key: "parkView", label: "Вид на парк", Icon: IconTrees },
};

// Display order, independent of how each room lists its keys.
const ORDER = Object.keys(AMENITIES);

/** Resolve amenity keys to catalog entries, in canonical order, skipping unknowns. */
export function getAmenities(keys?: string[]): Amenity[] {
  if (!keys?.length) return [];
  return ORDER.filter((k) => keys.includes(k)).map((k) => AMENITIES[k]);
}
