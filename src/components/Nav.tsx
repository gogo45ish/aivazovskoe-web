"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { IconMenu2, IconX } from "@tabler/icons-react";

type Link = [href: string, label: string];

// Main bar — "the resort"
const PRIMARY: Link[] = [
  ["/rooms", "Номера"],
  ["/park", "Парк"],
  ["/lechenie", "Лечение"],
  ["/infrastructure", "Инфраструктура"],
  ["/restaurants", "Рестораны"],
];

// Utility strip — "for guests"
const SECONDARY: Link[] = [
  ["/offers", "Акции"],
  ["/reviews", "Отзывы"],
  ["/events", "Афиша"],
  ["/documentation", "Документация"],
  ["/contacts", "Контакты"],
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock smooth scroll + allow Esc to close while the drawer is open
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  return (
    <>
    <header
      className={`fixed top-0 inset-x-0 z-30 transition-colors duration-500 ${
        scrolled
          ? "bg-green-900/90 backdrop-blur-md shadow-[0_8px_30px_-14px_rgba(0,0,0,0.55)]"
          : "bg-transparent"
      }`}
    >
      {/* Tier 1 — utility strip (desktop) */}
      <div
        className={`hidden md:block border-b transition-colors duration-500 ${
          scrolled ? "border-green-700/50" : "border-white/15"
        }`}
      >
        <div className="wrap flex justify-end items-center gap-7 py-2">
          {SECONDARY.map(([href, label]) => (
            <a
              key={label}
              href={href}
              className="text-[12.5px] tracking-[0.04em] text-sand-100/60 hover:text-sand-100 transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Tier 2 — main bar */}
      <div
        className={`wrap flex justify-between items-center transition-[padding] duration-500 ${
          scrolled ? "py-3.5" : "py-5"
        }`}
      >
        <Link
          href="/"
          aria-label="Санаторий «Айвазовское» — на главную"
          className="flex items-center gap-3.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Санаторий «Айвазовское»"
            className={`w-auto transition-all duration-500 ${
              scrolled ? "h-14" : "h-20"
            }`}
          />
          <span className="hidden sm:block font-serif text-sand-100 text-[21px] tracking-[0.14em]">
            АЙВАЗОВСКОЕ
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {PRIMARY.map(([href, label]) => (
            <a
              key={label}
              href={href}
              className="nav-link text-[14px] text-[#cdd6c9] hover:text-sand-100 transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <a href="#booking" className="btn py-2.5! px-5! text-[13px]!">
            Забронировать
          </a>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <a href="#booking" className="btn py-2! px-4! text-[12px]!">
            Забронировать
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={open}
            className="flex items-center justify-center w-10 h-10 text-sand-100 cursor-pointer"
          >
            <IconMenu2 size={24} />
          </button>
        </div>
      </div>

    </header>

      {/* Mobile drawer — rendered outside <header> so the scrolled
          backdrop-blur doesn't trap this fixed element in a containing block */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="fixed inset-0 z-40 bg-green-900 flex flex-col md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: prefersReduced ? 0 : 0.4, ease }}
          >
            <div className="flex justify-between items-center px-7 py-5 border-b border-green-700/60">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Санаторий «Айвазовское»"
                  className="h-14 w-auto"
                />
                <span className="font-serif text-sand-100 text-[19px] tracking-[0.14em]">
                  АЙВАЗОВСКОЕ
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
                className="flex items-center justify-center w-10 h-10 text-sand-100 cursor-pointer"
              >
                <IconX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-8 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
              <MobileGroup title="Курорт" links={PRIMARY} onNavigate={() => setOpen(false)} />
              <MobileGroup title="Гостям" links={SECONDARY} onNavigate={() => setOpen(false)} />
            </div>

            <div className="px-7 py-6 border-t border-green-700/60">
              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="btn w-full"
              >
                Забронировать
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileGroup({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: Link[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <div className="eyebrow">{title}</div>
      <ul className="space-y-3.5">
        {links.map(([href, label]) => (
          <li key={label}>
            <a
              href={href}
              onClick={onNavigate}
              className="font-serif text-sand-100 text-[20px] hover:text-brass transition-colors duration-200"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
