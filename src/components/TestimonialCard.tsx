"use client";

import { motion } from "framer-motion";

export interface TestimonialCardProps {
  imageSrc: string;
  imageAlt: string;
  category: string;
  name: string;
  role: string;
  quote: string;
}

export function TestimonialCard({
  imageSrc,
  imageAlt,
  category,
  name,
  role,
  quote,
}: TestimonialCardProps) {
  return (
    <motion.article
      className="group relative flex min-h-[380px] cursor-default flex-col overflow-hidden rounded-[30px]"
      initial={false}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/95 via-[#0B0B0B]/50 to-[#0B0B0B]/30"
          aria-hidden
        />
      </div>

      {/* Content */}
      <div className="relative flex min-h-[380px] flex-1 flex-col justify-between p-6">
        <span className="inline-flex w-fit rounded-full bg-[#171717]/90 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90">
          {category}
        </span>
        <div className="mt-auto transition-transform duration-300 ease-out group-hover:-translate-y-8">
          <p className="text-xl font-bold text-white md:text-2xl">{name}</p>
          <p className="mt-0.5 text-sm font-medium uppercase tracking-wide text-white/80">
            {role}
          </p>
          <p className="mt-3 line-clamp-3 text-sm text-white/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </motion.article>
  );
}
