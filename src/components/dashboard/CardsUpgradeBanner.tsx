"use client";

interface CardsUpgradeBannerProps {
  href?: string;
}

export function CardsUpgradeBanner({ href = "#" }: CardsUpgradeBannerProps) {
  const content = (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#059669] to-[#0d9488] p-6 shadow-md sm:p-8">
      <div className="relative z-10 max-w-md">
        <h3 className="text-xl font-bold text-white sm:text-2xl">
          Cards just got an upgrade
        </h3>
        <p className="mt-2 text-sm text-white/90 sm:text-base">
          You can now pay with Apple Pay and spend directly from any of your
          balances.
        </p>
        <span className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-[#171717] px-5 text-sm font-semibold text-white transition hover:opacity-90">
          Check it out →
        </span>
      </div>
      {/* Decorative right side - simple graphic placeholder */}
      <div
        className="absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-20 sm:block"
        aria-hidden
      >
        <div className="h-24 w-32 rounded-lg border-2 border-white/40 bg-white/10" />
      </div>
    </div>
  );

  if (href) {
    return (
      <section>
        <a
          href={href}
          className="block focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[var(--background)] rounded-2xl"
        >
          {content}
        </a>
      </section>
    );
  }

  return <section>{content}</section>;
}
