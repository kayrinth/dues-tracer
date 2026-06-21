import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDate, formatRupiah } from "@/lib/format";
import type { Payment, PaymentType } from "@/types/payment";

import { AddPaymentDialog } from "./add-payment-dialog";
import { EditPaymentDialog } from "./edit-payment-dialog";
import { DeletePaymentButton } from "./delete-payment-button";

type Props = {
  payments: Payment[];
  categoryLabel: PaymentType;
  defaultPaymentType: PaymentType;
  isAuthenticated: boolean;
};

const cellX = "px-4";

export function PaymentsTable({
  payments,
  categoryLabel,
  defaultPaymentType,
  isAuthenticated,
}: Props) {
  const totalAmount = payments.reduce((s, p) => s + Number(p.amount), 0);
  const totalTotal = payments.reduce((s, p) => s + Number(p.total), 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Pembayaran &mdash; {categoryLabel}</CardTitle>
          <CardDescription>
            Catatan pembayaran untuk kategori {categoryLabel.toLowerCase()}.
          </CardDescription>
        </div>
        {isAuthenticated && (
          <AddPaymentDialog defaultPaymentType={defaultPaymentType} />
        )}
      </CardHeader>
      <CardContent className="p-0">
        {payments.length === 0 ? (
          <div className="m-6 rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
            Belum ada pembayaran untuk {categoryLabel}.
            {isAuthenticated && (
              <> Klik &ldquo;Tambah Pembayaran&rdquo; untuk mulai mencatat.</>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className={`${cellX} h-11 text-xs font-semibold uppercase tracking-wider`}>
                  Nama
                </TableHead>
                <TableHead className={`${cellX} h-11 text-right text-xs font-semibold uppercase tracking-wider`}>
                  Nominal
                </TableHead>
                <TableHead className={`${cellX} h-11 text-xs font-semibold uppercase tracking-wider`}>
                  Tanggal
                </TableHead>
                <TableHead className={`${cellX} h-11 text-right text-xs font-semibold uppercase tracking-wider`}>
                  Total
                </TableHead>
                {isAuthenticated && (
                  <TableHead className={`${cellX} h-11 w-25 text-right text-xs font-semibold uppercase tracking-wider`}>
                    Aksi
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id} className="even:bg-muted/30">
                  <TableCell className={`${cellX} py-3`}>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold uppercase text-primary">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`${cellX} py-3 text-right tabular-nums`}>
                    {formatRupiah(p.amount)}
                  </TableCell>
                  <TableCell className={`${cellX} py-3 text-muted-foreground`}>
                    {formatShortDate(p.date)}
                  </TableCell>
                  <TableCell className={`${cellX} py-3 text-right font-medium tabular-nums`}>
                    {formatRupiah(p.total)}
                  </TableCell>
                  {isAuthenticated && (
                    <TableCell className={`${cellX} py-3 text-right`}>
                      <div className="inline-flex items-center gap-1">
                        <EditPaymentDialog payment={p} />
                        <DeletePaymentButton id={p.id} name={p.name} />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell className={`${cellX} py-3 font-semibold`}>
                  Total ({payments.length})
                </TableCell>
                <TableCell className={`${cellX} py-3 text-right font-semibold tabular-nums`}>
                  {formatRupiah(totalAmount)}
                </TableCell>
                <TableCell className={cellX} />
                <TableCell className={`${cellX} py-3 text-right font-semibold tabular-nums`}>
                  {formatRupiah(totalTotal)}
                </TableCell>
                {isAuthenticated && <TableCell className={cellX} />}
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
