"use client";

import { useState } from "react";

const DOCS_URL = "https://docs.ulaktech.com";

export function DevelopersContent() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleGenerateKey = () => {
    // Mock: generate a placeholder key. Replace with real API call later.
    setApiKey(`ulak_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`);
  };

  const handleCopyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* API Key */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="font-bold text-[var(--text)]">API Key</h3>
        <p className="mt-1 text-sm text-[var(--textSecondary)]">
          Use an API key to authenticate requests to the Ulaktech API. Keep your key
          secret and never share it or commit it to version control.
        </p>
        {apiKey ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <code className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-sm text-[var(--text)]">
              {apiKey}
            </code>
            <button
              type="button"
              onClick={handleCopyApiKey}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--background)]"
            >
              {apiKeyCopied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => setApiKey(null)}
              className="text-sm font-medium text-[var(--error)] hover:underline"
            >
              Revoke & generate new
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGenerateKey}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-[var(--tint)] bg-[var(--tint)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--tint)] transition hover:bg-[var(--tint)]/20"
          >
            Generate API key
          </button>
        )}
      </div>

      {/* Webhook */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="font-bold text-[var(--text)]">Webhook</h3>
        <p className="mt-1 text-sm text-[var(--textSecondary)]">
          Set a URL to receive HTTP callbacks when events occur (e.g. transaction
          completed, transfer failed). We will send POST requests to this endpoint.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-server.com/webhooks/ulaktech"
            className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--tint)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]/20"
          />
          <button
            type="button"
            className="shrink-0 rounded-lg bg-[var(--tint)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Save webhook
          </button>
        </div>
      </div>

      {/* Documentation */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="font-bold text-[var(--text)]">Developer documentation</h3>
        <p className="mt-1 text-sm text-[var(--textSecondary)]">
          API reference, guides, webhooks, and code examples for integrating with
          Ulaktech.
        </p>
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--tint)] hover:underline"
        >
          Open documentation
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" x2="21" y1="14" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
