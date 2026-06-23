import type { RichTextBlock as RichTextBlockType } from "@/types";

// TODO: if offers start using lists / bold / links in body copy, swap this
// blank-line split for a proper Markdown renderer. For now: paragraphs only,
// matching the repo convention (see lechenie/[slug]).
export default function RichTextBlock({ block }: { block: RichTextBlockType }) {
  const paras = block.content
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="wrap">
      <div className="max-w-[760px] mx-auto space-y-4">
        {paras.map((p, i) => (
          <p key={i} className="text-body text-[16px] leading-[1.85]">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
