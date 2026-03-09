import { DashboardAuthGuard, DashboardLayout } from "@/components/dashboard";
import { CardsScreenProvider } from "@/contexts/CardsScreenContext";
import { DashboardUserProvider } from "@/contexts/DashboardUserContext";
import { ProfilePrefsProvider } from "@/contexts/ProfilePrefsContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardUserProvider>
      <ProfilePrefsProvider>
        <DashboardAuthGuard>
          <CardsScreenProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </CardsScreenProvider>
        </DashboardAuthGuard>
      </ProfilePrefsProvider>
    </DashboardUserProvider>
  );
}
