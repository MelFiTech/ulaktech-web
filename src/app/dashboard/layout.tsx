import { DashboardAuthGuard, DashboardLayout } from "@/components/dashboard";
import { DashboardUserProvider } from "@/contexts/DashboardUserContext";
import { ProfilePrefsProvider } from "@/contexts/ProfilePrefsContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardUserProvider>
      <ProfilePrefsProvider>
        <DashboardAuthGuard>
          <DashboardLayout>{children}</DashboardLayout>
        </DashboardAuthGuard>
      </ProfilePrefsProvider>
    </DashboardUserProvider>
  );
}
