"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { updateExpense } from "../expense-actions";
import { emptyExpenseState } from "../expense-action-state";
import { ExpenseFormFields } from "./expense-form";
import type { Expense } from "@/types/payment";

export function EditExpenseDialog({ expense }: { expense: Expense }) {
  const [open, setOpen] = useState(false);
  const action = updateExpense.bind(null, expense.id);
  const [state, formAction] = useActionState(action, emptyExpenseState);

  useEffect(() => {
    if (state.success) {
      toast.success("Pengeluaran berhasil diperbarui.");
      setOpen(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengeluaran</DialogTitle>
          <DialogDescription>Perbarui detail pengeluaran.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <ExpenseFormFields
            category={expense.category}
            defaults={expense}
            submitLabel="Simpan Perubahan"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
