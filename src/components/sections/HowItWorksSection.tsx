"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: 1,
    title: "Create an account",
    description:
      "Sign up online in minutes or download our mobile app to get started.",
  },
  {
    step: 2,
    title: "Fund your wallet",
    description:
      "Add funds via bank transfer, card payment, QR code, or deposit.",
  },
  {
    step: 3,
    title: "Make payments instantly",
    description:
      "Purchase any service instantly from your dashboard—simple and fast.",
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

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#EEEDEE] py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#171717] sm:text-4xl"
          >
            Get started in three simple steps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-[#171717]/70"
          >
            Simple. Fast. Reliable.
          </motion.p>
        </div>

        {/* Image rectangle — same width as step cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 w-full overflow-hidden rounded-[30px] bg-[#E5E0D5] aspect-[21/9] min-h-[180px]"
          aria-hidden
        />

        {/* Step cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {steps.map((s) => (
            <motion.article
              key={s.step}
              variants={item}
              className="rounded-[30px] border border-[#171717]/15 bg-white p-6 transition hover:border-[#DC5746]/40"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DC5746] text-lg font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#171717]">
                {s.title}
              </h3>
              <p className="mt-2 text-[#171717]/70">
                {s.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
