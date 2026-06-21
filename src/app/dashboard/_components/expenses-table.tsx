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
import type { Expense, ExpenseCategory } from "@/types/payment";

import { AddExpenseDialog } from "./add-expense-dialog";
import { EditExpenseDialog } from "./edit-expense-dialog";
import { DeleteExpenseButton } from "./delete-expense-button";

type Props = {
  expenses: Expense[];
  category: ExpenseCategory;
  isAuthenticated: boolean;
};

const cellX = "px-4";

export function ExpensesTable({ expenses, category, isAuthenticated }: Props) {
  const totalAmount = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Pengeluaran &mdash; {category}</CardTitle>
          <CardDescription>
            Uang keluar dari kas {category.toLowerCase()}.
          </CardDescription>
        </div>
        {isAuthenticated && <AddExpenseDialog defaultCategory={category} />}
      </CardHeader>
      <CardContent className="p-0">
        {expenses.length === 0 ? (
          <div className="m-6 rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
            Belum ada pengeluaran untuk {category}.
            {isAuthenticated && (
              <> Klik &ldquo;Tambah Pengeluaran&rdquo; untuk mulai mencatat.</>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className={`${cellX} h-11 text-xs font-semibold uppercase tracking-wider`}>
                  Keterangan
                </TableHead>
                <TableHead className={`${cellX} h-11 text-xs font-semibold uppercase tracking-wider`}>
                  Tanggal
                </TableHead>
                <TableHead className={`${cellX} h-11 text-right text-xs font-semibold uppercase tracking-wider`}>
                  Nominal
                </TableHead>
                {isAuthenticated && (
                  <TableHead className={`${cellX} h-11 w-25 text-right text-xs font-semibold uppercase tracking-wider`}>
                    Aksi
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id} className="even:bg-muted/30">
                  <TableCell className={`${cellX} py-3 font-medium`}>
                    {e.description}
                  </TableCell>
                  <TableCell className={`${cellX} py-3 text-muted-foreground`}>
                    {formatShortDate(e.date)}
                  </TableCell>
                  <TableCell className={`${cellX} py-3 text-right font-medium tabular-nums text-rose-600 dark:text-rose-500`}>
                    {formatRupiah(e.amount)}
                  </TableCell>
                  {isAuthenticated && (
                    <TableCell className={`${cellX} py-3 text-right`}>
                      <div className="inline-flex items-center gap-1">
                        <EditExpenseDialog expense={e} />
                        <DeleteExpenseButton id={e.id} description={e.description} />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell className={`${cellX} py-3 font-semibold`}>
                  Total ({expenses.length})
                </TableCell>
                <TableCell className={cellX} />
                <TableCell className={`${cellX} py-3 text-right font-semibold tabular-nums`}>
                  {formatRupiah(totalAmount)}
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
