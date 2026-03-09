"use client";

interface BasicInformationTabProps {
  /** User full name */
  fullName?: string;
  /** User email */
  email?: string;
  /** Verified badge */
  verified?: boolean;
  /** First name */
  firstName?: string;
  /** Middle name */
  middleName?: string;
  /** Last name */
  lastName?: string;
  /** Date of birth */
  dateOfBirth?: string;
  /** Phone number */
  phoneNumber?: string;
  /** Tag name e.g. @pryme */
  tagName?: string;
  /** Avatar URL or initials */
  avatarUrl?: string | null;
  initial?: string;
}

export function BasicInformationTab({
  fullName = "goodness enyo-ojo obaje",
  email = "goodnessobaje077@gmail.com",
  verified = true,
  firstName = "goodness",
  middleName = "enyo-ojo",
  lastName = "obaje",
  dateOfBirth = "09/09/1996",
  phoneNumber = "+23407069957131",
  tagName = "@pryme",
  avatarUrl = null,
  initial = "GO",
}: BasicInformationTabProps) {
  return (
    <div className="space-y-6 pt-6">
      {/* User identification card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--tint)]/20 text-lg font-bold text-[var(--tint)]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-[var(--text)]">{fullName}</p>
              {verified && (
                <span className="rounded-full bg-[var(--success)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--success)]">
                  Verified
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-[var(--textSecondary)]">{email}</p>
          </div>
        </div>
      </div>

      {/* Personal information card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--textSecondary)]">
          Personal Information
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                First name
              </p>
              <p className="mt-0.5 font-medium text-[var(--text)]">{firstName}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Date of birth
              </p>
              <p className="mt-0.5 font-medium text-[var(--text)]">
                {dateOfBirth}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Middle name
              </p>
              <p className="mt-0.5 font-medium text-[var(--text)]">
                {middleName}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Email address
              </p>
              <p className="mt-0.5 font-medium text-[var(--text)]">{email}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Last name
              </p>
              <p className="mt-0.5 font-medium text-[var(--text)]">{lastName}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Phone number
              </p>
              <p className="mt-0.5 font-medium text-[var(--text)]">
                {phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tag card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--textSecondary)]">
          Ulaktech Tag
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="text-[var(--text)]">
            <span className="text-[var(--textSecondary)]">Tag name: </span>
            {tagName}
          </p>
          <button
            type="button"
            className="text-sm font-medium text-[var(--tint)] hover:underline"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
