"use client";

import Link from "next/link";
import {
  ButtonLink,
  ButtonOutlineGradientWrapper,
} from "@/components/ui/Button";

export interface ServiceFeatureRowProps {
  title: string;
  description: string;
  imageSide: "left" | "right";
  placeholderClassName?: string;
  ctaText: string;
  ctaHref?: string;
}

export function ServiceFeatureRow({
  title,
  description,
  imageSide,
  placeholderClassName = "bg-[#E5E0D5]",
  ctaText,
  ctaHref = "#",
}: ServiceFeatureRowProps) {
  const imageBlock = (
    <div
      className={`aspect-[4/3] w-full rounded-[30px] ${placeholderClassName} min-h-[200px]`}
      aria-hidden
    />
  );

  const contentBlock = (
    <div className="flex min-h-full flex-col justify-center px-4 py-6 md:px-8 md:py-10">
      <h3 className="text-xl font-semibold text-[#171717] md:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-[#171717]/80 md:text-lg">{description}</p>
      <ButtonOutlineGradientWrapper className="mt-5">
        <ButtonLink
          href={ctaHref}
          variant="outlineGradient"
          className="!h-[50px] !rounded-[66px]"
        >
          {ctaText}
        </ButtonLink>
      </ButtonOutlineGradientWrapper>
    </div>
  );

  return (
    <div className="grid w-full grid-cols-1 overflow-hidden rounded-[30px] bg-[#FAFAFA] md:grid-cols-2 md:items-stretch md:gap-0">
      {imageSide === "left" ? (
        <>
          <div className="min-h-0 p-4 md:p-6">{imageBlock}</div>
          <div className="flex min-h-full">{contentBlock}</div>
        </>
      ) : (
        <>
          <div className="order-1 flex min-h-full md:order-1">
            {contentBlock}
          </div>
          <div className="order-2 min-h-0 p-4 md:order-2 md:p-6">
            {imageBlock}
          </div>
        </>
      )}
    </div>
  );
}
