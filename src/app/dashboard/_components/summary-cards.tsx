import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";

type Props = {
  totalFiltered: number;
  totalAll: number;
  totalRecords: number;
  filterLabel: string;
};

export function SummaryCards({
  totalFiltered,
  totalAll,
  totalRecords,
  filterLabel,
}: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Tampilan</CardDescription>
          <CardTitle className="text-2xl">{formatRupiah(totalFiltered)}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {filterLabel}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Keseluruhan</CardDescription>
          <CardTitle className="text-2xl">{formatRupiah(totalAll)}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Akumulasi seluruh pembayaran (semua bulan)
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Jumlah Catatan</CardDescription>
          <CardTitle className="text-2xl">{totalRecords}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Record sesuai filter
        </CardContent>
      </Card>
    </section>
  );
}
