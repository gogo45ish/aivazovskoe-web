import type { HeadingBlock as HeadingBlockType } from "@/types";

export default function HeadingBlock({ block }: { block: HeadingBlockType }) {
  const Tag = block.level; // "h2" | "h3"
  const size =
    block.level === "h3" ? "clamp(20px, 2.2vw, 26px)" : "clamp(24px, 3vw, 34px)";
  return (
    <div className="wrap">
      <Tag className="text-ink max-w-[760px] mx-auto" style={{ fontSize: size }}>
        {block.text}
      </Tag>
    </div>
  );
}
