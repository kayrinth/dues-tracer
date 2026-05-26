const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number | string | null | undefined): string {
  const numeric = typeof value === "string" ? Number(value) : value ?? 0;
  if (!Number.isFinite(numeric)) return "Rp0";
  return rupiahFormatter.format(numeric as number);
}

export function formatMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  if (!year || !m) return month;
  const date = new Date(Number(year), Number(m) - 1, 1);
  if (Number.isNaN(date.getTime())) return month;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function currentMonthValue(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}
