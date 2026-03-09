"use client";

export interface FeatureCardProps {
  title: string;
  description: string;
  placeholderClassName?: string;
}

export function FeatureCard({
  title,
  description,
  placeholderClassName = "bg-[#E5E0D5]",
}: FeatureCardProps) {
  return (
    <article className="rounded-[30px] border border-[#171717]/15 bg-white p-0 overflow-hidden transition hover:border-[#DC5746]/40">
      <div
        className={`aspect-[4/3] w-full rounded-t-[30px] ${placeholderClassName}`}
        aria-hidden
      />
      <div className="p-6 text-left">
        <h3 className="text-xl font-semibold text-[#171717]">{title}</h3>
        <p className="mt-2 text-[#171717]/70">{description}</p>
      </div>
    </article>
  );
}
