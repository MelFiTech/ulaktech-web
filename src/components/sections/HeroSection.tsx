"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-20 sm:px-8 lg:px-12">
      {/* Video background */}
      <div className="absolute inset-0 z-0 bg-[#EEEDEE]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          aria-hidden
        >
          <source src="video/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0 bg-[#0B0B0B]/60"
          aria-hidden
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.p
          variants={item}
          className="text-sm font-medium uppercase tracking-widest text-[#F5BE47] sm:text-base"
        >
          Built with you in mind
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Simplify Bill Payments
        </motion.h1>
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl"
        >
          Pay bills, buy data, and stay connected—all in one place. Data bundles,
          airtime, TV subscriptions, and electricity, available 24/7.
        </motion.p>
        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Mobile only: single Download app button */}
          <div className="w-full md:hidden">
            <ButtonLink
              href="#download"
              variant="primary"
              fullWidth
            >
              Download app
            </ButtonLink>
          </div>
          {/* Desktop only: Get Started — wrapper hidden on mobile so base inline-flex doesn’t override */}
          <div className="hidden md:block">
            <ButtonLink href="/register" variant="primary">
              Get Started
            </ButtonLink>
          </div>
        </motion.div>
        <motion.p
          variants={item}
          className="mt-8 text-sm text-white/70"
        >
          Trusted by thousands of users and resellers across Nigeria.
        </motion.p>
      </motion.div>
    </section>
  );
}
