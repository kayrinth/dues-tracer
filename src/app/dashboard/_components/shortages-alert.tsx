import { TriangleAlert } from "lucide-react";

import { formatMonthLabel, formatRupiah, monthFromDate } from "@/lib/format";
import {
  EXPECTED_DUES,
  EXPECTED_DUES_BY_MONTH,
  EXPECTED_DUES_OVERRIDES,
  EXPECTED_PAYERS_BY_CATEGORY,
  PAYER_NAMES,
  PAYMENT_TYPES,
  SHORTAGE_EXEMPT_MONTHS,
  type Payment,
  type PayerName,
  type PaymentType,
} from "@/types/payment";

type Shortage = {
  payer: PayerName;
  category: PaymentType;
  month: string;
  paid: number;
  expected: number;
  shortage: number;
};

function computeShortages(payments: Payment[]): Shortage[] {
  const result: Shortage[] = [];

  for (const category of PAYMENT_TYPES) {
    const baseExpected = EXPECTED_DUES[category];
    if (!baseExpected) continue;

    const payersForCategory =
      EXPECTED_PAYERS_BY_CATEGORY[category] ?? PAYER_NAMES;
    const exemptMonths = SHORTAGE_EXEMPT_MONTHS[category] ?? [];

    // Bulan-bulan yang sudah punya minimal 1 pembayaran untuk kategori ini
    const monthsInCategory = new Set<string>();
    for (const p of payments) {
      if (p.payment_type !== category) continue;
      const m = monthFromDate(p.date);
      if (m) monthsInCategory.add(m);
    }

    for (const month of monthsInCategory) {
      if (exemptMonths.includes(month)) continue;
      const monthRate = EXPECTED_DUES_BY_MONTH[month]?.[category];
      const expectedForMonth = monthRate ?? baseExpected;
      for (const payer of payersForCategory) {
        const expected =
          EXPECTED_DUES_OVERRIDES[category]?.[payer] ?? expectedForMonth;

        const paid = payments
          .filter(
            (p) =>
              p.payment_type === category &&
              p.name === payer &&
              monthFromDate(p.date) === month,
          )
          .reduce((s, p) => s + Number(p.total), 0);

        if (paid < expected) {
          result.push({
            payer,
            category,
            month,
            paid,
            expected,
            shortage: expected - paid,
          });
        }
      }
    }
  }

  // Urut: bulan terbaru dulu, lalu kategori, lalu nama
  result.sort(
    (a, b) =>
      b.month.localeCompare(a.month) ||
      a.category.localeCompare(b.category) ||
      a.payer.localeCompare(b.payer),
  );

  return result;
}

export function ShortagesAlert({ payments }: { payments: Payment[] }) {
  const shortages = computeShortages(payments);

  if (shortages.length === 0) return null;

  const totalShortage = shortages.reduce((s, x) => s + x.shortage, 0);

  return (
    <section className="overflow-hidden rounded-xl border-2 border-amber-300 bg-linear-to-br from-amber-50 to-card shadow-sm dark:border-amber-900/60 dark:from-amber-950/30">
      <div className="border-b border-amber-200/70 bg-amber-100/40 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/40">
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-5 shrink-0 text-amber-600 dark:text-amber-500" />
          <h2 className="text-base font-semibold text-amber-900 dark:text-amber-100">
            Iuran Kurang ({shortages.length})
          </h2>
          <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
            Total: -{formatRupiah(totalShortage)}
          </span>
        </div>
      </div>
      <ul className="divide-y divide-amber-200/50 dark:divide-amber-900/30">
        {shortages.map((s, i) => (
          <li
            key={`${s.month}-${s.category}-${s.payer}-${i}`}
            className="flex flex-col gap-1 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-200/60 text-xs font-semibold uppercase text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {s.payer.charAt(0)}
              </span>
              <span className="font-medium">{s.payer}</span>
              <span className="rounded-full border bg-background/70 px-2 py-0.5 text-xs">
                {s.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatMonthLabel(s.month)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground tabular-nums">
                {formatRupiah(s.paid)} / {formatRupiah(s.expected)}
              </span>
              <span className="rounded-md bg-rose-100 px-2 py-0.5 text-sm font-semibold tabular-nums text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                -{formatRupiah(s.shortage)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
