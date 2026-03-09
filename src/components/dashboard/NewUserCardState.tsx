"use client";

const BENEFITS = [
  {
    icon: "wallet",
    iconColor: "#0D9488",
    iconBg: "rgba(13, 148, 136, 0.15)",
    title: "Spend directly from your balance",
    description: "Seamlessly spend from your balances.",
  },
  {
    icon: "shield",
    iconColor: "#2563EB",
    iconBg: "rgba(37, 99, 235, 0.15)",
    title: "3D secure transactions",
    description: "Shop confidently with extra payment protection.",
  },
  {
    icon: "heart",
    iconColor: "#DC2626",
    iconBg: "rgba(220, 38, 38, 0.15)",
    title: "Enjoy benefits and exclusive deals",
    description:
      "Get special Visa discounts and offers that give you more value every time you spend.",
  },
] as const;

function BenefitIcon({ name, color, bg }: { name: string; color: string; bg: string }) {
  if (name === "wallet") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function NewUserCardState() {
  return (
    <div className="space-y-8 pb-24">
      {/* Card preview - matches mobile gradient and layout */}
      <div className="relative h-[212px] overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(to right, #F33F63, #F79334)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white/90" />
              <span className="text-base font-semibold text-white">ULAKTECH</span>
            </div>
            <img
              src="/cards/visa.png"
              alt=""
              className="h-6 w-12 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="mt-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91 1.09.07 2.09.72 2.77 1.34 1.01 1.03 1.75 2.69 1.5 4.28-.27 2.04-1.73 3.7-2.92 4.92Z" />
              </svg>
              <span className="text-xs font-medium text-white">Pay enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits list - matches mobile */}
      <div className="space-y-5">
        {BENEFITS.map((benefit, index) => (
          <div key={index} className="flex items-start gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: benefit.iconBg }}
            >
              <BenefitIcon name={benefit.icon} color={benefit.iconColor} bg={benefit.iconBg} />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-semibold text-[var(--text)]">{benefit.title}</p>
              <p className="text-sm text-[var(--textSecondary)]">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
