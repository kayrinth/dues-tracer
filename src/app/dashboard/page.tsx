import { createClient } from "@/lib/supabase/server";
import type { Payment } from "@/types/payment";

import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardTabs } from "./_components/dashboard-tabs";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <DashboardHeader email={user?.email ?? null} isAuthenticated={isAuthenticated} />
        <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Gagal memuat data: {error.message}
        </div>
      </main>
    );
  }

  const payments = (data ?? []) as Payment[];

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <DashboardHeader email={user?.email ?? null} isAuthenticated={isAuthenticated} />
      <DashboardTabs payments={payments} isAuthenticated={isAuthenticated} />
    </main>
  );
}
