"use client";

import { ProfilePageHeader, ProfileScreenContent } from "@/components/dashboard";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfilePageHeader />
      <ProfileScreenContent />
    </div>
  );
}
