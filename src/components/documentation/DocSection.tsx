import { IconDownload, IconFileTypePdf } from "@tabler/icons-react";
import Reveal from "@/components/ui/Reveal";

export interface DocLink {
  title: string;
  /** Real PDF URL, or "#" while the file hasn't been uploaded yet. */
  href: string;
}

interface Props {
  id?: string;
  eyebrow?: string;
  title: string;
  docs: DocLink[];
  /** Dark section gets forest-green background + light text. */
  dark?: boolean;
}

export default function DocSection({ id, eyebrow, title, docs, dark }: Props) {
  const row = dark
    ? "bg-green-800 border-green-700/70 text-sand-100 hover:border-brass/45"
    : "bg-white border-line text-ink hover:border-brass/40 hover:shadow-[0_18px_40px_-28px_rgba(30,45,36,0.4)]";
  const action = dark
    ? "text-green-300 group-hover:text-brass"
    : "text-muted group-hover:text-brass";

  return (
    <section id={id} className={`section ${dark ? "bg-green-900" : "bg-sand-50"}`}>
      <div className="wrap">
        <Reveal>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2
            className={dark ? "text-sand-100" : "text-ink"}
            style={{ fontSize: "clamp(26px, 3.4vw, 40px)" }}
          >
            {title}
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-3 md:grid-cols-2">
          {docs.map((doc, i) => {
            const live = doc.href !== "#";
            return (
              <li key={doc.title}>
                <Reveal delay={(i % 2) * 0.05}>
                  <a
                    href={doc.href}
                    {...(live
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`group flex items-center gap-3.5 rounded-lg border p-4 transition-all duration-300 ${row}`}
                  >
                    <IconFileTypePdf size={22} className="text-brass shrink-0" />
                    <span className="flex-1 text-[14px] leading-snug">
                      {doc.title}
                    </span>
                    <span
                      className={`hidden sm:inline text-[11px] tracking-[0.08em] ${action} transition-colors`}
                    >
                      PDF
                    </span>
                    <IconDownload
                      size={18}
                      className={`shrink-0 ${action} transition-colors`}
                    />
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
