import { createClient } from "@/lib/supabase/server";
import type { Expense, Payment } from "@/types/payment";

import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardClient } from "./_components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  const [paymentsRes, expensesRes] = await Promise.all([
    supabase.from("payments").select("*").order("created_at", { ascending: false }),
    supabase.from("expenses").select("*").order("created_at", { ascending: false }),
  ]);

  const errors = [paymentsRes.error, expensesRes.error].filter(Boolean);

  if (errors.length > 0) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <DashboardHeader email={user?.email ?? null} isAuthenticated={isAuthenticated} />
        <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Gagal memuat data:</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((err, i) => (
              <li key={i}>{err?.message}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs">
            Jika error menyebut tabel <code>expenses</code> tidak ditemukan,
            jalankan SQL terbaru dari <code>SUPABASE_SETUP.md</code> di Supabase SQL Editor.
          </p>
        </div>
      </main>
    );
  }

  const payments = (paymentsRes.data ?? []) as Payment[];
  const expenses = (expensesRes.data ?? []) as Expense[];

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <DashboardHeader email={user?.email ?? null} isAuthenticated={isAuthenticated} />
      <DashboardClient
        payments={payments}
        expenses={expenses}
        isAuthenticated={isAuthenticated}
      />
    </main>
  );
}
