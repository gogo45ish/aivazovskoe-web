import {
  IconPlant2,
  IconSparkles,
  IconPaw,
  IconShieldCheck,
  IconBike,
  IconCircleCheck,
} from "@tabler/icons-react";
import type { VisitRuleGroup } from "@/types";
import Reveal from "../ui/Reveal";

// Icon per group, by order; falls back gracefully for extra groups.
const ICONS = [IconPlant2, IconSparkles, IconPaw, IconShieldCheck, IconBike];

export default function RulesSection({ rules }: { rules: VisitRuleGroup[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {rules.map((g, i) => {
        const Icon = ICONS[i] ?? IconCircleCheck;
        return (
          <Reveal key={g.id} delay={(i % 3) * 0.06}>
            <div className="card-light h-full p-6">
              <span className="flex items-center justify-center w-11 h-11 rounded-full border border-line text-brass mb-4">
                <Icon size={22} stroke={1.5} />
              </span>
              <h3 className="font-serif text-ink text-[18px] leading-snug mb-4">
                {g.groupTitle}
              </h3>
              <ul className="space-y-2.5 text-[14px] text-body leading-snug">
                {g.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 w-1 h-1 rounded-full bg-brass shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
