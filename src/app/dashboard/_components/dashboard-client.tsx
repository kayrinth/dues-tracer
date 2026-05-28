"use client";

import { useMemo, useState } from "react";

import { CalendarDays, Plug, Wifi, type LucideIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  PAYMENT_TYPES,
  type Expense,
  type Payment,
  type PaymentType,
} from "@/types/payment";
import { currentMonthValue, formatMonthLabel } from "@/lib/format";

import { BalanceSummary } from "./balance-summary";
import { PaymentsTable } from "./payments-table";
import { ExpensesTable } from "./expenses-table";

const ALL_MONTHS = "__all__";

const TAB_ICONS: Record<PaymentType, LucideIcon> = {
  "Listrik Atas": Plug,
  "Listrik Bawah": Plug,
  "WiFi + Sampah": Wifi,
};

type Props = {
  payments: Payment[];
  expenses: Expense[];
  isAuthenticated: boolean;
};

export function DashboardClient({ payments, expenses, isAuthenticated }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<string>(ALL_MONTHS);

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    payments.forEach((p) => set.add(p.month));
    expenses.forEach((e) => set.add(e.month));
    set.add(currentMonthValue());
    return Array.from(set).sort().reverse();
  }, [payments, expenses]);

  const filterLabel =
    selectedMonth === ALL_MONTHS ? "Semua bulan" : formatMonthLabel(selectedMonth);

  const matchesMonth = (m: string) =>
    selectedMonth === ALL_MONTHS || m === selectedMonth;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:max-w-xs">
        <Label htmlFor="month-filter" className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 text-muted-foreground" />
          Filter Bulan
        </Label>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger id="month-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_MONTHS}>Semua bulan</SelectItem>
            {availableMonths.map((m) => (
              <SelectItem key={m} value={m}>
                {formatMonthLabel(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Total Pemasukan &amp; Pengeluaran mengikuti pilihan ini. Sisa Saldo
          selalu dihitung dari semua bulan.
        </p>
      </div>

      <Tabs defaultValue={PAYMENT_TYPES[0]} className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 sm:inline-flex sm:w-auto">
          {PAYMENT_TYPES.map((type) => {
            const Icon = TAB_ICONS[type];
            return (
              <TabsTrigger
                key={type}
                value={type}
                className="flex-col gap-1 px-2 py-2 text-xs sm:flex-row sm:gap-1.5 sm:px-3 sm:text-sm"
              >
                <Icon className="size-4 shrink-0" />
                <span className="leading-tight">{type}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {PAYMENT_TYPES.map((type) => {
          const paymentsForCat = payments.filter((p) => p.payment_type === type);
          const expensesForCat = expenses.filter((e) => e.category === type);

          // Saldo = akumulasi seluruh bulan (uang yang benar-benar tersisa)
          const incomeAllTime = paymentsForCat.reduce((s, p) => s + Number(p.total), 0);
          const expenseAllTime = expensesForCat.reduce((s, e) => s + Number(e.amount), 0);
          const balance = incomeAllTime - expenseAllTime;

          // Pemasukan & Pengeluaran pada kartu mengikuti filter bulan
          const filteredPayments = paymentsForCat.filter((p) => matchesMonth(p.month));
          const filteredExpenses = expensesForCat.filter((e) => matchesMonth(e.month));
          const incomeFiltered = filteredPayments.reduce((s, p) => s + Number(p.total), 0);
          const expenseFiltered = filteredExpenses.reduce((s, e) => s + Number(e.amount), 0);

          return (
            <TabsContent key={type} value={type} className="space-y-6">
              <BalanceSummary
                totalIncome={incomeFiltered}
                totalExpense={expenseFiltered}
                balance={balance}
                filterLabel={filterLabel}
              />
              <PaymentsTable
                payments={filteredPayments}
                categoryLabel={type}
                defaultPaymentType={type}
                isAuthenticated={isAuthenticated}
              />
              <ExpensesTable
                expenses={filteredExpenses}
                category={type}
                isAuthenticated={isAuthenticated}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
