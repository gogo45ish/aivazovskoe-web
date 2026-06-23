import Link from "next/link";
import type { CtaButtonBlock as CtaButtonBlockType } from "@/types";

export default function CtaButtonBlock({ block }: { block: CtaButtonBlockType }) {
  const cls = block.style === "outline" ? "btn-out" : "btn";
  return (
    <div className="wrap">
      <div className="max-w-[760px] mx-auto">
        <Link href={block.href} className={cls}>
          {block.label}
        </Link>
      </div>
    </div>
  );
}
