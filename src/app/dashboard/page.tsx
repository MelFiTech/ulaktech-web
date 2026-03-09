"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AirtimeModal,
  AddFundsModal,
  AirtimeToCashModal,
  Banner,
  BettingModal,
  DataModal,
  DashboardHeader,
  ElectricityModal,
  MoreModal,
  TotalBalanceSection,
  QuickActionsSection,
  RecentTransactionsSection,
  TransferChoiceModal,
  TransferModal,
  TvModal,
  VerificationModal,
  WithdrawModal,
} from "@/components/dashboard";
import type { TransferOptionType } from "@/components/dashboard/modals/TransferChoiceModal";
import { useProfilePrefs } from "@/contexts/ProfilePrefsContext";
import { STORAGE_KEYS } from "@/lib/profileStorage";
import { getMe } from "@/lib/api/auth";
import { getWallet, listTransactions, invalidateWalletCache, getLastKnownBalance, type WalletTransaction } from "@/lib/api/wallet";

const RECENT_LIMIT = 3;

function formatBalance(balanceStr: string): string {
  const num = parseFloat(balanceStr.replace(/,/g, ""));
  if (isNaN(num)) return "₦0.00";
  return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { balanceVisible, setBalanceVisible } = useProfilePrefs();
  const [airtimeModalOpen, setAirtimeModalOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [airtimeToCashModalOpen, setAirtimeToCashModalOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [electricityModalOpen, setElectricityModalOpen] = useState(false);
  const [tvModalOpen, setTvModalOpen] = useState(false);
  const [bettingModalOpen, setBettingModalOpen] = useState(false);
  const [addFundsModalOpen, setAddFundsModalOpen] = useState(false);
  const [transferChoiceOpen, setTransferChoiceOpen] = useState(false);
  const [transferSendOpen, setTransferSendOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<WalletTransaction[]>([]);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  // Show last known balance immediately when returning to home; silent refetch updates it
  const initialBalance = (() => {
    const raw = getLastKnownBalance();
    return raw != null ? formatBalance(raw) : "₦0.00";
  })();
  const [walletBalance, setWalletBalance] = useState<string>(initialBalance);

  const handleTransferChoice = (option: TransferOptionType) => {
    setTransferChoiceOpen(false);
    if (verified !== true) {
      setVerificationModalOpen(true);
      return;
    }
    if (option === "send") setTransferSendOpen(true);
    if (option === "withdrawToBank") setWithdrawModalOpen(true);
  };

  const fetchBalance = useCallback(async () => {
    try {
      const w = await getWallet();
      setWalletBalance(formatBalance(w?.balance ?? "0"));
    } catch {
      // Keep previous balance on error (same as mobile: "keep previous balance")
    }
  }, []);

  const fetchRecentTransactions = useCallback(async () => {
    try {
      const res = await listTransactions({ page: 1, limit: RECENT_LIMIT });
      setRecentTransactions(res?.transactions ?? []);
    } catch {
      setRecentTransactions([]);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    fetchRecentTransactions();
  }, [fetchRecentTransactions]);

  // Fetch verification status so we can gate wallet/quick actions when not verified
  useEffect(() => {
    getMe()
      .then((user) => setVerified(user.verified === true))
      .catch(() => setVerified(false));
  }, []);

  // Show verification modal when user needs to complete identity verification (e.g. after login/set-pin)
  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    const show = sessionStorage.getItem(STORAGE_KEYS.SHOW_VERIFICATION_MODAL) === "true";
    setVerificationModalOpen(show);
  }, []);

  const requireVerified = (action: () => void) => () => {
    if (verified !== true) setVerificationModalOpen(true);
    else action();
  };

  const handleStartVerification = () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEYS.SHOW_VERIFICATION_MODAL);
    }
    setVerificationModalOpen(false);
    router.push("/dashboard/verify");
  };

  // Open bill payment modal from nav (Pay submenu → /dashboard?pay=...) – or verification if not verified
  useEffect(() => {
    const pay = searchParams.get("pay");
    if (!pay || pay === "exam-pin") return;
    if (verified !== true) {
      setVerificationModalOpen(true);
      router.replace("/dashboard", { scroll: false });
      return;
    }
    if (pay === "data") setDataModalOpen(true);
    else if (pay === "airtime") setAirtimeModalOpen(true);
    else if (pay === "electricity") setElectricityModalOpen(true);
    else if (pay === "tv") setTvModalOpen(true);
    else if (pay === "betting") setBettingModalOpen(true);
    router.replace("/dashboard", { scroll: false });
  }, [searchParams, router, verified]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <DashboardHeader />
      <TotalBalanceSection
        totalBalance={walletBalance}
        balanceVisible={balanceVisible}
        onToggleBalanceVisibility={() => setBalanceVisible(!balanceVisible)}
        onAddFundsClick={requireVerified(() => setAddFundsModalOpen(true))}
        onTransferClick={requireVerified(() => setTransferChoiceOpen(true))}
      />
      <QuickActionsSection
        onAirtimeClick={requireVerified(() => setAirtimeModalOpen(true))}
        onDataClick={requireVerified(() => setDataModalOpen(true))}
        onAirtimeToCashClick={requireVerified(() => setAirtimeToCashModalOpen(true))}
        onMoreClick={requireVerified(() => setMoreModalOpen(true))}
      />
      <RecentTransactionsSection
        transactions={recentTransactions}
        balanceVisible={balanceVisible}
      />
      <Banner imageUrl={null} imageAlt="Promotional banner" />

      <AddFundsModal open={addFundsModalOpen} onClose={() => setAddFundsModalOpen(false)} />
      <TransferChoiceModal
        open={transferChoiceOpen}
        onClose={() => setTransferChoiceOpen(false)}
        onSelect={handleTransferChoice}
      />
      <TransferModal
        open={transferSendOpen}
        onClose={() => setTransferSendOpen(false)}
        onSuccess={() => {
          invalidateWalletCache();
          fetchBalance();
          fetchRecentTransactions();
        }}
      />
      <WithdrawModal
        open={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onSuccess={() => {
          invalidateWalletCache();
          fetchBalance();
          fetchRecentTransactions();
        }}
      />
      <VerificationModal
        open={verificationModalOpen}
        onClose={() => {
          setVerificationModalOpen(false);
          if (typeof sessionStorage !== "undefined") {
            sessionStorage.removeItem(STORAGE_KEYS.SHOW_VERIFICATION_MODAL);
          }
        }}
        onStartVerification={handleStartVerification}
      />
      <AirtimeModal
        open={airtimeModalOpen}
        onClose={() => setAirtimeModalOpen(false)}
        onSuccess={() => {
          fetchBalance();
          fetchRecentTransactions();
        }}
      />
      <DataModal
        open={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        onSuccess={() => {
          fetchBalance();
          fetchRecentTransactions();
        }}
      />
      <AirtimeToCashModal
        open={airtimeToCashModalOpen}
        onClose={() => setAirtimeToCashModalOpen(false)}
      />
      <MoreModal
        open={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        onElectricityClick={requireVerified(() => setElectricityModalOpen(true))}
        onTvClick={requireVerified(() => setTvModalOpen(true))}
        onBettingClick={requireVerified(() => setBettingModalOpen(true))}
      />
      <ElectricityModal
        open={electricityModalOpen}
        onClose={() => setElectricityModalOpen(false)}
      />
      <TvModal open={tvModalOpen} onClose={() => setTvModalOpen(false)} />
      <BettingModal
        open={bettingModalOpen}
        onClose={() => setBettingModalOpen(false)}
      />
    </div>
  );
}
