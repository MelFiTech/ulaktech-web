"use client";

import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  tagline: string;
  showLanguageSelector?: boolean;
}

export function AuthLayout({
  children,
  tagline,
  showLanguageSelector = true,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col lg:flex-row">
      {/* Left: dark promotional panel — adjust width via lg:w-[XXXpx] below */}
      <div className="relative hidden min-h-[40vh] w-full flex-col justify-between bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1f] to-[#0B0B0B] pl-12 pr-10 py-12 lg:flex lg:min-h-screen lg:w-[520px] lg:shrink-0 lg:pl-16 lg:pr-12">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xl font-bold text-white transition hover:opacity-90"
          >
            Ulaktech
          </Link>
          <span className="h-px w-8 bg-white/30" aria-hidden />
        </div>
        <div className="mt-auto">
          <p className="max-w-md text-3xl font-bold leading-tight text-white lg:text-4xl">
            {tagline}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/70">
          <span>© Ulaktech {new Date().getFullYear()}</span>
          <Link href="/contact" className="transition hover:text-white">
            Help Center
          </Link>
          <Link href="/terms" className="transition hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Right: form area */}
      <div className="relative flex flex-1 flex-col bg-[#EEEDEE] lg:min-h-screen">
        {showLanguageSelector && (
          <div className="absolute right-6 top-6 lg:right-10 lg:top-10">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-[#171717]/15 bg-white/80 px-3 py-2 text-sm text-[#171717]/80 transition hover:border-[#171717]/25 hover:text-[#171717]"
            >
              English (US)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12 lg:py-16">
          {children}
        </div>
      </div>
    </div>
  );
}
