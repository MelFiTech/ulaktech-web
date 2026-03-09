"use client";

import { useState } from "react";
import {
  CardsPageHeader,
  VirtualCardDisplay,
  CardQuickActions,
  ManageCardSection,
  CardRecentTransactions,
} from "@/components/dashboard";

export default function CardsPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);

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
