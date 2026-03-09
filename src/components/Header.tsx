"use client";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

const SCROLL_THRESHOLD = 10;
const NAV_HEIGHT = 72;

const NAV_SECTIONS = [
  { id: "why-ulaktech", label: "Why Ulaktech" },
  { id: "services", label: "Services" },
  { id: "resellers", label: "Resellers" },
] as const;

export function Header() {
  const [visible, setVisible] = useState(true);
  const [isOnHero, setIsOnHero] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnHero(scrollY.get() < window.innerHeight * 0.85);
    }
    const unsubscribe = scrollY.on("change", (y) => {
      if (typeof window !== "undefined") {
        setIsOnHero(y < window.innerHeight * 0.85);
      }
      if (y <= SCROLL_THRESHOLD) {
        setVisible(true);
      } else if (y > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = y;
    });
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const textClass = isOnHero ? "text-white" : "text-[#171717]";
  const textMutedClass = isOnHero ? "text-white/90" : "text-[#171717]/80";
  const headerContrastWhenMenuOpen = isMobileMenuOpen;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : -NAV_HEIGHT }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed left-0 right-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          headerContrastWhenMenuOpen
            ? "border-b border-[#171717]/10 bg-[#EEEDEE] backdrop-blur-md"
            : isOnHero
              ? "border-transparent bg-transparent backdrop-blur-none"
              : "border-b border-[var(--border)] bg-[#EEEDEE]/95 backdrop-blur-md"
        }`}
      >
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4 md:gap-8 md:px-[60px]">
          <Link
            href="/"
            className={`shrink-0 text-xl font-bold transition ${headerContrastWhenMenuOpen ? "text-[#171717]" : textClass}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
          >
            Ulaktech
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Main"
          >
            {NAV_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`shrink-0 rounded-md px-2 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 ${
                  isOnHero
                    ? "text-white/90 hover:bg-white/10 hover:text-white focus:ring-offset-[#0B0B0B]/50"
                    : "text-[#171717]/80 hover:bg-[#171717]/10 hover:text-[#171717] focus:ring-offset-[#EEEDEE]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Desktop: Login + Download app */}
          <div className="hidden shrink-0 items-center gap-4 md:flex">
            <Link
              href="/login"
              className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition hover:text-[#DC5746] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[#EEEDEE] ${textMutedClass}`}
            >
              Login
            </Link>
            <ButtonLink href="#download" variant="primary">
              Download app
            </ButtonLink>
          </div>

          {/* Mobile: hamburger / close - dark when menu open for contrast */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md md:hidden transition focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[#0B0B0B]/50 ${headerContrastWhenMenuOpen ? "text-[#171717] focus:ring-offset-[#EEEDEE]" : textClass}`}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </svg>
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-sm md:hidden"
            aria-hidden
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col bg-[#EEEDEE] px-8 pt-20 pb-10 shadow-xl md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Mobile">
              {NAV_SECTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="rounded-lg px-4 py-3 text-left text-lg font-medium text-[#171717] transition hover:bg-[#171717]/10 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2"
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="mt-auto flex shrink-0 flex-col gap-3 pt-8">
              <ButtonLink
                href="/login"
                variant="outlineLight"
                fullWidth
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </ButtonLink>
              <ButtonLink
                href="/register"
                variant="primary"
                fullWidth
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create Free Account
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
