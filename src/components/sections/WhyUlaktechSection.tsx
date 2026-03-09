"use client";

import { motion } from "framer-motion";
import { FeatureCard } from "@/components/FeatureCard";

const reasons = [
  {
    title: "Instant Delivery",
    description:
      "All purchases are processed automatically—no delays, no manual confirmation. Get your data and tokens in seconds.",
  },
  {
    title: "Secure & Reliable",
    description:
      "Your wallet and transactions are protected with secure payment infrastructure you can trust.",
  },
  {
    title: "Competitive Rates",
    description:
      "Affordable pricing for everyone. Even better margins for resellers scaling their business.",
  },
  {
    title: "Support When You Need It",
    description:
      "Our support team is available around the clock to help you whenever you need it.",
  },
];

const pastelColors = [
  "bg-[#E8D5E7]",
  "bg-[#D5E5E8]",
  "bg-[#F5E6D8]",
  "bg-[#E5E0D5]",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function WhyUlaktechSection() {
  return (
    <section id="why-ulaktech" className="bg-[#EEEDEE] py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#171717] sm:text-4xl"
          >
            All Your Needs, One Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-[#171717]/70"
          >
            Seamless bill payments, instant delivery, competitive rates, and
            round-the-clock support with Ulaktech.
          </motion.p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid gap-8 sm:grid-cols-2"
        >
          {reasons.map((reason, index) => (
            <motion.div key={reason.title} variants={item}>
              <FeatureCard
                title={reason.title}
                description={reason.description}
                placeholderClassName={pastelColors[index] ?? pastelColors[0]}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
