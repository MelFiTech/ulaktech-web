"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfileSubPageHeader } from "@/components/dashboard/profile/ProfileSubPageHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { STORAGE_KEYS } from "@/lib/profileStorage";
import {
  verificationStatus,
  verificationBvn,
  verificationSelfie,
  type VerificationStatusResponse,
} from "@/lib/api/verification";

type StepStatus = "success" | "pending" | "inactive";

interface VerificationStepItem {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
}

function getSteps(status: VerificationStatusResponse | null): VerificationStepItem[] {
  const bvnDone = status?.bvnVerified ?? false;
  const selfieDone = status?.selfieVerified ?? false;
  return [
    {
      id: "bvn",
      title: "Your BVN",
      description: "Input your BVN to create your wallet.",
      status: bvnDone ? "success" : "inactive",
    },
    {
      id: "selfie",
      title: "Biometrics",
      description: "Smile and take a selfie to verify your identity.",
      status: selfieDone ? "success" : bvnDone ? "pending" : "inactive",
    },
    {
      id: "full",
      title: "Full Access",
      description: "Get your account number and start using your wallet.",
      status: bvnDone && selfieDone ? "success" : "inactive",
    },
  ];
}

export default function VerifyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [bvn, setBvn] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bvnSubmitting, setBvnSubmitting] = useState(false);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfieSubmitting, setSelfieSubmitting] = useState(false);

  const steps = getSteps(status);
  const bothDone = status?.bvnVerified && status?.selfieVerified;
  const nextStep = status?.verificationStepRequired ?? "bvn";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await verificationStatus();
        if (!cancelled) setStatus(res);
      } catch {
        if (!cancelled) toast("Could not load verification status.", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const handleBvnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = bvn.replace(/\D/g, "");
    if (trimmed.length !== 11) {
      toast("Enter a valid 11-digit BVN.", "error");
      return;
    }
    const dob = dateOfBirth.trim();
    if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      toast("Enter your date of birth (YYYY-MM-DD).", "error");
      return;
    }
    setBvnSubmitting(true);
    try {
      await verificationBvn({ bvn: trimmed, dateOfBirth: dob });
      toast("BVN verified.");
      const res = await verificationStatus();
      setStatus(res);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "BVN submission failed.";
      toast(msg, "error");
    } finally {
      setBvnSubmitting(false);
    }
  };

  const handleSelfieSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) setSelfieFile(file);
    e.target.value = "";
  };

  const handleSelfieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfieFile) {
      toast("Please select a photo.", "error");
      return;
    }
    setSelfieSubmitting(true);
    try {
      await verificationSelfie(selfieFile);
      toast("Selfie submitted.");
      const res = await verificationStatus();
      setStatus(res);
      setSelfieFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Selfie upload failed.";
      toast(msg, "error");
    } finally {
      setSelfieSubmitting(false);
    }
  };

  const handleGoToHome = () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEYS.SHOW_VERIFICATION_MODAL);
    }
    router.replace("/dashboard");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <ProfileSubPageHeader title="Verify your Identity" backHref="/dashboard" />
        <p className="mt-6 text-[var(--textSecondary)]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <ProfileSubPageHeader title="Verify your Identity" backHref="/dashboard" />

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const lineColor =
            step.status === "success"
              ? "bg-[#00DD79]"
              : step.status === "pending"
                ? "bg-[#FF9500]"
                : "bg-[var(--border)]";
          const iconBg =
            step.status === "success"
              ? "bg-[#00DD79]"
              : step.status === "pending"
                ? "bg-[#FF9500]"
                : "bg-[var(--border)]";
          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg} text-white`}
                >
                  {step.status === "success" ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                </div>
                {!isLast && <div className={`mt-1 h-8 w-0.5 ${lineColor}`} />}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[var(--text)]">{step.title}</h2>
                  {step.status === "success" && (
                    <span className="rounded-full bg-[#00DD79]/20 px-2 py-0.5 text-xs font-medium text-[#00DD79]">
                      Success
                    </span>
                  )}
                  {step.status === "pending" && (
                    <span className="rounded-full bg-[#FF9500]/20 px-2 py-0.5 text-xs font-medium text-[#FF9500]">
                      Pending
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[var(--textSecondary)]">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {bothDone ? (
        <div className="flex justify-center pt-4">
          <Button onClick={handleGoToHome} variant="primary" className="min-w-[200px]">
            Go to home
          </Button>
        </div>
      ) : nextStep === "bvn" ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text)]">Your BVN</h3>
          <form onSubmit={handleBvnSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="verify-bvn" className="mb-1 block text-sm font-medium text-[var(--text)]">
                BVN
              </label>
              <input
                id="verify-bvn"
                type="text"
                inputMode="numeric"
                maxLength={11}
                value={bvn}
                onChange={(e) => setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="Enter your 11-digit BVN"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)] focus:border-[var(--tint)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]/20"
              />
            </div>
            <div>
              <label htmlFor="verify-dob" className="mb-1 block text-sm font-medium text-[var(--text)]">
                Date of birth
              </label>
              <input
                id="verify-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] focus:border-[var(--tint)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]/20"
              />
              <p className="mt-1 text-xs text-[var(--textSecondary)]">Format: YYYY-MM-DD</p>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={bvn.replace(/\D/g, "").length !== 11 || !dateOfBirth || bvnSubmitting}
              className="w-full"
            >
              {bvnSubmitting ? "Verifying…" : "Continue"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text)]">Take a quick selfie</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[var(--textSecondary)]">
            <li>Ensure your face is clearly visible.</li>
            <li>Remove hats, glasses, or face coverings.</li>
            <li>Make sure your environment has good lighting.</li>
            <li>Hold your device at eye level and look directly at the camera.</li>
          </ul>
          <form onSubmit={handleSelfieSubmit} className="mt-6 space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleSelfieSelect}
              className="hidden"
              aria-label="Choose selfie image"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] py-6 text-[var(--textSecondary)] transition hover:border-[var(--tint)] hover:text-[var(--tint)]"
            >
              {selfieFile ? selfieFile.name : "Choose photo or take a picture"}
            </button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selfieFile || selfieSubmitting}
              className="w-full"
            >
              {selfieSubmitting ? "Uploading…" : "Submit selfie"}
            </Button>
          </form>
        </div>
      )}

      <p className="text-center text-sm text-[var(--textSecondary)]">
        <Link href="/dashboard" className="text-[var(--tint)] hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
