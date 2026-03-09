"use client";

import { useState } from "react";

export function NotificationsContent() {
  const [emailTransactions, setEmailTransactions] = useState(true);
  const [emailPromo, setEmailPromo] = useState(false);
  const [pushTransactions, setPushTransactions] = useState(true);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="font-bold text-[var(--text)]">Preferences</h3>
        <p className="mt-1 text-sm text-[var(--textSecondary)]">
          Choose how you want to be notified about your account activity.
        </p>
        <ul className="mt-4 space-y-4">
          <li className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-[var(--text)]">Email: Transactions</p>
              <p className="text-sm text-[var(--textSecondary)]">
                Get an email when you make or receive payments.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailTransactions}
              onClick={() => setEmailTransactions((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                emailTransactions ? "bg-[var(--tint)]" : "bg-[var(--border)]"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition left-1 ${
                  emailTransactions ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </li>
          <li className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-[var(--text)]">Email: Promotions</p>
              <p className="text-sm text-[var(--textSecondary)]">
                News, tips and offers from Ulaktech.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailPromo}
              onClick={() => setEmailPromo((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                emailPromo ? "bg-[var(--tint)]" : "bg-[var(--border)]"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition left-1 ${
                  emailPromo ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </li>
          <li className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-[var(--text)]">Push: Transactions</p>
              <p className="text-sm text-[var(--textSecondary)]">
                Push notifications for payments on your devices.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={pushTransactions}
              onClick={() => setPushTransactions((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                pushTransactions ? "bg-[var(--tint)]" : "bg-[var(--border)]"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition left-1 ${
                  pushTransactions ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
