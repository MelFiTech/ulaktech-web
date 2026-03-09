"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const slides = [
  {
    title: "Fast, Secure & Automated Payments",
    description:
      "Buy data, airtime, TV subscriptions and pay electricity bills instantly — anytime, anywhere.",
    icon: "⚡",
  },
  {
    title: "More Than Just Data",
    description:
      "Buy airtime, subscribe to TV, pay electricity, and manage everything from one wallet.",
    icon: "📱",
  },
  {
    title: "Start in Seconds",
    description:
      "Sign up → Fund wallet → Complete payments instantly. Simple. Affordable. Reliable.",
    icon: "✨",
  },
];

export default function OnboardingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-[#EEEDEE]">
      <div className="flex flex-1 flex-col px-6 pt-12 pb-8">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-[#171717]">Ulaktech</h1>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-2xl border border-[#171717]/10 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 text-5xl" aria-hidden>
                {slide.icon}
              </span>
              <h2 className="text-xl font-bold text-[#171717] sm:text-2xl">
                {slide.title}
              </h2>
              <p className="mt-3 text-[#171717]/70 leading-relaxed">
                {slide.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-4">
          <div className="flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-6 bg-[#DC5746]" : "w-2 bg-[#171717]/20"
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <Link href="/register" className="w-full max-w-sm">
              <Button type="button" className="w-full" variant="primary">
                Get Started
              </Button>
            </Link>
          ) : (
            <Button
              type="button"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="w-full max-w-sm"
              variant="primary"
            >
              Next
            </Button>
          )}

          <Link
            href="/login"
            className="text-sm text-[#171717]/60 hover:text-[#171717]"
          >
            Already have an account? <span className="font-semibold text-[#DC5746]">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
