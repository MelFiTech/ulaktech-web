"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";

export function DownloadAppSection() {
  return (
    <section id="download" className="overflow-hidden bg-white py-20 lg:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-[#171717]/70">
            Get started today
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#171717] sm:text-4xl">
            Experience bill payments, <br /> on the go as it&apos;s meant to be
          </h2>
          <div className="mt-6 grid max-w-md grid-cols-2 gap-4 mx-auto">
            <ButtonLink
              href="#"
              variant="dark"
              fullWidth
              className="gap-2 focus:ring-offset-[#EEEDEE]"
            >
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.01-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </ButtonLink>
            <ButtonLink
              href="#"
              variant="dark"
              fullWidth
              className="gap-2 focus:ring-offset-[#EEEDEE]"
            >
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l6.54-6.54 4.22 4.22 2.27-2.27-4.27-4.27zM20.16 4.85L6.05 2.66 16.59 12 6.05 21.34 20.16 19.15c.5-.24.84-.76.84-1.35V6.2c0-.59-.34-1.11-.84-1.35z" />
              </svg>
              Play Store
            </ButtonLink>
          </div>
        </motion.div>

        {/* Phone mockup container: reduce mt-6 to mt-2 for less space between buttons and image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto mt-2 h-[560px] w-full max-w-[560px] overflow-hidden rounded-t-3xl rounded-b-none -mb-32 lg:-mb-40"
        >
          <Image
            src="/images/download.png"
            alt="Ulaktech app download"
            fill
            className="object-cover object-top"
            sizes="(max-width: 700px) 100vw, 560px"
          />
        </motion.div>
      </div>
    </section>
  );
}
