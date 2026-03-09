"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

const IMAGE_SRC = "/images/1.png";

export function ForResellersSection() {
  return (
    <section id="resellers" className="relative overflow-hidden py-20 lg:py-28">
      {/* 6 images side by side as background */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative min-h-0">
            <Image
              src={IMAGE_SRC}
              alt=""
              fill
              className="object-cover"
              sizes="16.67vw"
            />
          </div>
        ))}
      </div>
      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 bg-[#0B0B0B]/65"
        aria-hidden
      />
      {/* Centered text over the grid */}
      <div className="section-container relative z-10 flex min-h-[560px] items-center justify-center md:min-h-[640px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Built for resellers
          </h2>
          <p className="mt-4 text-lg text-white">
            Earn more with our competitive pricing. Scale your VTU business with
            reliable automation and instant delivery—built to grow with you.
          </p>
          <ButtonLink
            href="/reseller"
            variant="primary"
            className="mt-8 shadow-lg focus:ring-[var(--border)] focus:ring-offset-[#0B0B0B]/50"
          >
            Become a reseller
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
