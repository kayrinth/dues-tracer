import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  filterLabel: string;
};

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
        <CardContent className="text-xs text-muted-foreground">
          Iuran masuk &mdash; {filterLabel}
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
        <CardContent className="text-xs text-muted-foreground">
          Uang keluar &mdash; {filterLabel}
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
        <CardContent className="text-xs text-muted-foreground">
          Total uang tersisa (semua bulan)
        </CardContent>
      </Card>
    </section>
  );
}
