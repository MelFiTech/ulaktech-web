"use client";

import { motion } from "framer-motion";
import { Accordion } from "@/components/ui/Accordion";

const faqs = [
  {
    question: "How secure is Ulaktech for bill payments?",
    answer:
      "We use secure payment infrastructure to protect your wallet and transactions. All payments are processed through trusted channels.",
  },
  {
    question: "What are the fees for using Ulaktech?",
    answer:
      "We offer competitive rates for end users and even better margins for resellers. Transaction fees are transparent and displayed before you pay.",
  },
  {
    question: "Which networks and services are supported?",
    answer:
      "We support all major networks for data and airtime, plus DSTV, GOTV, Startimes for TV, and electricity bill payments across Nigeria.",
  },
  {
    question: "Can I use Ulaktech as a reseller?",
    answer:
      "Yes. Our platform is built for resellers with competitive pricing, instant delivery, and 24/7 automation. Sign up and apply to become a reseller.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden bg-[#0B0B0B] py-20 lg:py-28">
      {/* Yellow circular gradients diagonally */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(245, 190, 71, 0.35) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full opacity-80"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, rgba(245, 190, 71, 0.35) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="section-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            Still not convinced? <br /> We&apos;ve got the answers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-white/70"
          >
            Common questions about Ulaktech and our services.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="mx-auto mt-16 max-w-3xl rounded-[30px] bg-[#171717] px-6"
        >
          <Accordion items={faqs} type="single" variant="dark" />
        </motion.div>
        <p className="mt-12 text-center text-white/60">
          Still have more questions?{" "}
          <a
            href="/contact"
            className="font-medium text-[#DC5746] hover:underline"
          >
            Contact our help center
          </a>
          .
        </p>
      </div>
    </section>
  );
}
