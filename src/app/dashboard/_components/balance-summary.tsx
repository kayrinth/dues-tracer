import { ArrowDownLeft, ArrowUpRight, CalendarDays, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  filterLabel: string;
};

function PeriodBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <CalendarDays className="size-3" />
      {label}
    </span>
  );
}

export function BalanceSummary({
  totalIncome,
  totalExpense,
  balance,
  filterLabel,
}: Props) {
  const isNegative = balance < 0;

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <Card className="border-emerald-200/70 bg-linear-to-br from-emerald-50 to-card dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardDescription>Pemasukan</CardDescription>
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <ArrowDownLeft className="size-4" />
            </span>
          </div>
          <CardTitle className="text-2xl tabular-nums text-emerald-600 dark:text-emerald-500">
            {formatRupiah(totalIncome)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PeriodBadge
            label={filterLabel}
            className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
          />
        </CardContent>
      </Card>

      <Card className="border-rose-200/70 bg-linear-to-br from-rose-50 to-card dark:border-rose-900/50 dark:from-rose-950/30 dark:to-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardDescription>Pengeluaran</CardDescription>
            <span className="flex size-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <CardTitle className="text-2xl tabular-nums text-rose-600 dark:text-rose-500">
            {formatRupiah(totalExpense)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PeriodBadge
            label={filterLabel}
            className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
          />
        </CardContent>
      </Card>

      <Card
        className={cn(
          "bg-linear-to-br to-card",
          isNegative
            ? "border-rose-300/70 from-rose-50 dark:border-rose-800/60 dark:from-rose-950/30"
            : "border-primary/20 from-primary/5 dark:from-primary/10",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardDescription>Sisa Saldo</CardDescription>
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full",
                isNegative
                  ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
                  : "bg-primary/10 text-primary",
              )}
            >
              <Wallet className="size-4" />
            </span>
          </div>
          <CardTitle
            className={cn(
              "text-2xl tabular-nums",
              isNegative ? "text-rose-600 dark:text-rose-500" : "text-foreground",
            )}
          >
            {formatRupiah(balance)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PeriodBadge label="Semua bulan" className="bg-muted/50 text-muted-foreground" />
        </CardContent>
      </Card>
    </section>
  );
}
