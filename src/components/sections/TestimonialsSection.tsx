"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TestimonialCard } from "@/components/TestimonialCard";

// Using only `category` to represent the testimonial type (used for the pill)
const testimonials = [
  {
    imageSrc: "https://picsum.photos/400/500?random=1",
    imageAlt: "Umar Ibrahim",
    category: "Reseller",
    name: "Umar Ibrahim",
    role: "Reseller",
    quote:
      "Best platform for reselling VTU services. Fast and reliable.",
  },
  {
    imageSrc: "https://picsum.photos/400/500?random=2",
    imageAlt: "Yusuf Ahmed",
    category: "Agent",
    name: "Yusuf Ahmed",
    role: "Agent",
    quote: "Affordable data plans for both users and resellers.",
  },
  {
    imageSrc: "https://picsum.photos/400/500?random=3",
    imageAlt: "Anas Musa",
    category: "User",
    name: "Anas Musa",
    role: "User",
    quote: "Quick support and smooth transactions.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TestimonialsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="testimonials" className="bg-[#EEEDEE] py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-widest text-[#DC5746]"
          >
            Customer stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-2 text-3xl font-bold sm:text-4xl"
          >
            <span className="text-[#171717]/80">Stories from our </span>
            <br />
            <span className="text-[#000000]">Customers</span>
          </motion.h2>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 flex flex-col gap-6 md:flex-row"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={item}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`min-w-0 w-full transition-[flex] duration-300 ease-out md:flex-1 ${
                hoveredIndex === i ? "md:flex-[1.35]" : ""
              }`}
            >
              <TestimonialCard
                imageSrc={t.imageSrc}
                imageAlt={t.imageAlt}
                category={t.category}
                name={t.name}
                role={t.role}
                quote={t.quote}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
