"use client";

import Link from "next/link";

const baseClasses =
  "inline-flex h-[54px] shrink-0 items-center justify-center whitespace-nowrap rounded-[68px] px-6 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2";

const variants = {
  primary:
    "bg-gradient-to-r from-[#DC5746] to-[#F5BE47] text-white hover:opacity-90 focus:ring-offset-white",
  outline:
    "border-2 border-white/40 bg-transparent text-white hover:border-[#F5BE47] hover:bg-white/10 focus:ring-offset-[#0B0B0B]/50",
  outlineLight:
    "border-2 border-[#171717]/20 bg-transparent text-[#171717] hover:border-[#DC5746] hover:bg-[#DC5746]/10 focus:ring-offset-[#EEEDEE]",
  outlineGradient:
    "border-0 bg-white text-[#171717] hover:bg-[#FAFAFA] focus:ring-offset-white",
  dark: "bg-[#171717] text-white hover:opacity-90 focus:ring-offset-[#EEEDEE]",
} as const;

type ButtonVariant = keyof typeof variants;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  href: string;
  className?: string;
}

function getButtonClassName(
  variant: ButtonVariant = "primary",
  fullWidth?: boolean,
  className?: string
) {
  return [
    baseClasses,
    variants[variant],
    fullWidth && "w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  fullWidth,
  loading,
  className,
  type = "button",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={getButtonClassName(variant, fullWidth, className)}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  fullWidth,
  className,
  href,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={getButtonClassName(variant, fullWidth, className)}
      {...props}
    >
      {children}
    </Link>
  );
}

/** Wrapper for gradient-outline style: gradient border with light inner fill */
export function ButtonOutlineGradientWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-[68px] p-[2px] bg-gradient-to-r from-[#DC5746] to-[#F5BE47] ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
