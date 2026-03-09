"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0B0B] py-12">
      <div className="section-container">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-white/60">
            © Ulaktech, {currentYear}. All rights reserved.
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
            aria-label="Footer"
          >
            <Link
              href="/privacy"
              className="text-white/70 transition hover:text-[#DC5746]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/70 transition hover:text-[#DC5746]"
            >
              Terms of Service
            </Link>
            <Link
              href="/faq"
              className="text-white/70 transition hover:text-[#DC5746]"
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              className="text-white/70 transition hover:text-[#DC5746]"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
