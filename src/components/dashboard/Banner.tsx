"use client";

import Link from "next/link";

interface BannerProps {
  /** Banner image URL (uploaded from admin) */
  imageUrl?: string | null;
  /** Alt text for the banner image */
  imageAlt?: string;
  /** Optional link URL – entire banner becomes clickable */
  href?: string | null;
}

export function Banner({
  imageUrl,
  imageAlt = "Promotional banner",
  href,
}: BannerProps) {
  const content = imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={imageAlt}
      className="h-auto w-full rounded-2xl object-cover object-center"
    />
  ) : (
    <div
      className="flex aspect-[1200/320] w-full items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--textSecondary)]"
      aria-hidden
    >
      <span className="text-sm">Banner</span>
    </div>
  );

  const wrapperClass =
    "block w-full overflow-hidden rounded-2xl bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[var(--background)]";

  if (href) {
    return (
      <section>
        <Link href={href} className={wrapperClass}>
          {content}
        </Link>
      </section>
    );
  }

  return <section className={wrapperClass}>{content}</section>;
}
