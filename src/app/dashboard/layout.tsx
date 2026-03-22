import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950 p-6 md:p-10">
          {children}
        </main>
      </div>
      <OnboardingModal />
    </div>
  );
}
