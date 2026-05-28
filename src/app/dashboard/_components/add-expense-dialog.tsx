"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";
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

import { createExpense } from "../expense-actions";
import { emptyExpenseState } from "../expense-action-state";
import { ExpenseFormFields } from "./expense-form";
import type { ExpenseCategory } from "@/types/payment";

export function AddExpenseDialog({
  defaultCategory,
}: {
  defaultCategory: ExpenseCategory;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createExpense, emptyExpenseState);

  useEffect(() => {
    if (state.success) {
      toast.success("Pengeluaran berhasil dicatat.");
      setOpen(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Tambah Pengeluaran
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pengeluaran</DialogTitle>
          <DialogDescription>
            Catat uang yang dikeluarkan dari kas {defaultCategory}.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <ExpenseFormFields category={defaultCategory} submitLabel="Simpan" />
        </form>
      </DialogContent>
    </Dialog>
  );
}
