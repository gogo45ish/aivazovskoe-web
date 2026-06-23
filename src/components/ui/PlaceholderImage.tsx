import { IconPhoto } from "@tabler/icons-react";

interface Props {
  label?: string;
  dark?: boolean;
  className?: string;
}

export default function PlaceholderImage({
  label,
  dark = false,
  className = "",
}: Props) {
  return (
    <div
      className={`ph ${className}`}
      style={
        dark
          ? { background: "#2c4636", color: "var(--color-green-500)" }
          : undefined
      }
    >
      <IconPhoto size={24} />
      {label && <span>{label}</span>}
    </div>
  );
}
