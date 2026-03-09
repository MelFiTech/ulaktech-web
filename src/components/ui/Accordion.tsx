"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionTrigger({
  question,
  isOpen,
  onToggle,
  dark,
}: {
  question: string;
  isOpen: boolean;
  onToggle: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`flex w-full items-center justify-between gap-4 py-4 text-left text-lg font-semibold transition hover:text-[#DC5746] focus:outline-none ${
        dark ? "text-white" : "text-[#171717]"
      }`}
    >
      <span>{question}</span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className={`shrink-0 ${dark ? "text-white/60" : "text-[#171717]/60"}`}
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.span>
    </button>
  );
}

function AccordionContent({
  answer,
  isOpen,
  dark,
}: {
  answer: string;
  isOpen: boolean;
  dark?: boolean;
}) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className={`pb-4 pt-0 ${dark ? "text-white/80" : "text-[#171717]/80"}`}>
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface AccordionItemPropsWithVariant extends AccordionItemProps {
  dark?: boolean;
}

export function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  dark,
}: AccordionItemPropsWithVariant) {
  return (
    <div
      className={`border-b last:border-b-0 ${
        dark ? "border-white/15" : "border-[#171717]/15"
      }`}
    >
      <AccordionTrigger
        question={question}
        isOpen={isOpen}
        onToggle={onToggle}
        dark={dark}
      />
      <AccordionContent answer={answer} isOpen={isOpen} dark={dark} />
    </div>
  );
}

export interface AccordionProps {
  items: Array<{ question: string; answer: string }>;
  type?: "single" | "multiple";
  variant?: "light" | "dark";
}

export function Accordion({
  items,
  type = "single",
  variant = "light",
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(type === "single" ? null : null);
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const dark = variant === "dark";

  const handleToggle = (index: number) => {
    if (type === "single") {
      setOpenIndex((prev) => (prev === index ? null : index));
    } else {
      setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    }
  };

  const isOpen = (index: number) =>
    type === "single" ? openIndex === index : openSet.has(index);

  return (
    <div className="divide-y-0">
      {items.map((item, index) => (
        <AccordionItem
          key={item.question}
          question={item.question}
          answer={item.answer}
          isOpen={isOpen(index)}
          onToggle={() => handleToggle(index)}
          dark={dark}
        />
      ))}
    </div>
  );
}
