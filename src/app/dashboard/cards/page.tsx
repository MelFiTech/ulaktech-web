"use client";

import { useEffect, useState } from "react";
import {
  CardsPageHeader,
  VirtualCardDisplay,
  CardQuickActions,
  ManageCardSection,
  CardRecentTransactions,
  NewUserCardState,
} from "@/components/dashboard";
import { useCardsScreen } from "@/contexts/CardsScreenContext";

export default function CardsPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [hasCard, setHasCard] = useState(false);
  const { setIsNewUserState } = useCardsScreen();

  useEffect(() => {
    setIsNewUserState(!hasCard);
    return () => setIsNewUserState(false);
  }, [hasCard, setIsNewUserState]);

  if (!hasCard) {
    return (
      <div className="space-y-8">
        <CardsPageHeader />
        <div className="mx-auto max-w-5xl">
          <NewUserCardState />
          <div className="mt-6">
            <button
              type="button"
              className="w-full rounded-2xl bg-[var(--tint)] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              disabled
            >
              Create virtual card — Coming soon
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CardsPageHeader />

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Main card and Manage card side by side, equal widths */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="min-w-0">
            <VirtualCardDisplay
              maskedNumber="**** **** **** 8429"
              balance="$1.39"
              balanceVisible={balanceVisible}
            />
          </div>
          <div className="min-w-0">
            <ManageCardSection
              onWithdraw={() => {}}
              onStatement={() => {}}
              onDelete={() => {}}
            />
          </div>
        </div>

        {/* Quick actions below card + manage row */}
        <CardQuickActions
          onDetails={() => {}}
          onAddMoney={() => {}}
          onFreeze={() => {}}
        />

        <CardRecentTransactions balanceVisible={balanceVisible} />
      </div>
    </div>
  );
}
