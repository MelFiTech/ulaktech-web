"use client";

interface SessionRow {
  id: string;
  deviceName: string;
  location: string;
  signInVia: string;
  dateTime: string;
}

const MOCK_SESSIONS: SessionRow[] = [
  { id: "1", deviceName: "Chrome Apple macOS", location: "-", signInVia: "Web", dateTime: "33 minutes ago, today" },
  { id: "2", deviceName: "iPhone", location: "-", signInVia: "Mobile app (ios)", dateTime: "2 hours ago" },
];

export function SecuritySettingsContent() {
  return (
    <div className="space-y-6">
      {/* Two Factor Authentication */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[var(--text)]">Two Factor Authentication</h3>
            <p className="mt-1 text-sm text-[var(--textSecondary)]">
              Help protect your account from unauthorised access by requiring a second
              authentication method in addition to your Ulaktech password.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--textSecondary)]">
              Authenticator app
            </p>
            <p className="mt-1 text-sm text-[var(--textSecondary)]">
              Use a mobile authentication app to get a verification code to enter every
              time you log in to your Ulaktech account.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--tint)] hover:underline"
            >
              Activate
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--success)]/15 px-2.5 py-1 text-xs font-medium text-[var(--success)]">
            Recommended
          </span>
        </div>
      </div>

      {/* Password reset */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="font-bold text-[var(--text)]">Password reset</h3>
        <p className="mt-1 text-sm text-[var(--textSecondary)]">
          Change your password at any time.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--tint)] hover:underline"
        >
          Change password
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Devices & sessions */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="font-bold text-[var(--text)]">Devices & sessions</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--textSecondary)]">
          Active sessions
        </p>
        <p className="mt-1 text-sm text-[var(--textSecondary)]">
          You are currently logged into these device(s).
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="pb-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                  Device name
                </th>
                <th className="pb-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                  Location
                </th>
                <th className="pb-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                  Sign in via
                </th>
                <th className="pb-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                  Date & time
                </th>
                <th className="w-10 pb-3" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {MOCK_SESSIONS.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 font-medium text-[var(--text)]">{row.deviceName}</td>
                  <td className="py-3 text-[var(--textSecondary)]">{row.location}</td>
                  <td className="py-3 text-[var(--textSecondary)]">{row.signInVia}</td>
                  <td className="py-3 text-[var(--textSecondary)]">{row.dateTime}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="rounded p-1.5 text-[var(--textSecondary)] hover:bg-[var(--background)] hover:text-[var(--text)]"
                      aria-label="Session options"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
