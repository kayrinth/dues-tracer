"use client";

import { useMemo, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PAYMENT_TYPES, type Payment } from "@/types/payment";
import { currentMonthValue, formatMonthLabel } from "@/lib/format";

import { SummaryCards } from "./summary-cards";
import { PaymentsTable } from "./payments-table";

const ALL_MONTHS = "__all__";

type Props = {
  payments: Payment[];
  isAuthenticated: boolean;
};

export function DashboardTabs({ payments, isAuthenticated }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<string>(ALL_MONTHS);

  const availableMonths = useMemo(() => {
    const set = new Set<string>(payments.map((p) => p.month));
    set.add(currentMonthValue());
    return Array.from(set).sort().reverse();
  }, [payments]);

  const filterLabel =
    selectedMonth === ALL_MONTHS ? "Semua bulan" : formatMonthLabel(selectedMonth);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:max-w-xs">
        <Label htmlFor="month-filter">Filter Bulan</Label>
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
      </div>

      <Tabs defaultValue={PAYMENT_TYPES[0]} className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:inline-flex sm:w-auto sm:grid-cols-none">
          {PAYMENT_TYPES.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAYMENT_TYPES.map((type) => {
          const byCategory = payments.filter((p) => p.payment_type === type);
          const filtered =
            selectedMonth === ALL_MONTHS
              ? byCategory
              : byCategory.filter((p) => p.month === selectedMonth);
          const totalFiltered = filtered.reduce((s, p) => s + Number(p.total), 0);
          const totalAll = byCategory.reduce((s, p) => s + Number(p.total), 0);

          return (
            <TabsContent key={type} value={type} className="space-y-6">
              <SummaryCards
                totalFiltered={totalFiltered}
                totalAll={totalAll}
                totalRecords={filtered.length}
                filterLabel={filterLabel}
              />
              <PaymentsTable
                payments={filtered}
                categoryLabel={type}
                defaultPaymentType={type}
                isAuthenticated={isAuthenticated}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
