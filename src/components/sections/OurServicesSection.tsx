"use client";

import { motion } from "framer-motion";
import { ServiceFeatureRow } from "@/components/ServiceFeatureRow";

const services = [
  {
    title: "Data Bundles",
    description:
      "Affordable data plans for all major networks. Works on Android, iPhone, modems, and more.",
    ctaText: "Buy data",
    ctaHref: "/data",
  },
  {
    title: "VTU Airtime",
    description:
      "Recharge instantly with automated airtime delivery—fast and reliable.",
    ctaText: "Buy Airtime",
    ctaHref: "/airtime",
  },
  {
    title: "Electricity Bills",
    description:
      "Pay electricity bills easily and receive your token without delay.",
    ctaText: "Pay bill",
    ctaHref: "/electricity",
  },
  {
    title: "TV Subscriptions",
    description:
      "Subscribe or renew DSTV, GOTV, and Startimes in seconds.",
    ctaText: "Subscribe",
    ctaHref: "/tv",
  },
  {
    title: "Airtime to Cash",
    description:
      "Convert unused airtime into cash directly to your wallet.",
    ctaText: "Convert now",
    ctaHref: "/airtime-to-cash",
  },
  {
    title: "USD Virtual Card",
    description:
      "Create and fund USD virtual cards for online payments and subscriptions.",
    ctaText: "Get USD virtual card",
    ctaHref: "/virtual-card",
  },
];

const pastelColors = [
  "bg-[#E8D5E7]",
  "bg-[#D5E5E8]",
  "bg-[#F5E6D8]",
  "bg-[#E5E0D5]",
  "bg-[#D8E8E5]",
  "bg-[#E0D8E8]",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function OurServicesSection() {
  return (
    <section id="services" className="bg-white py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#171717] sm:text-4xl"
          >
            Explore Bills & Airtime
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-[#171717]/70"
          >
            Everything you need in one platform—data, airtime, electricity, TV,
            and more.
          </motion.p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 flex flex-col gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={item}>
              <ServiceFeatureRow
                title={service.title}
                description={service.description}
                imageSide={index % 2 === 0 ? "left" : "right"}
                placeholderClassName={pastelColors[index] ?? pastelColors[0]}
                ctaText={service.ctaText}
                ctaHref={service.ctaHref}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
