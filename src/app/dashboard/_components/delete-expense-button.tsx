"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteExpense } from "../expense-actions";

export function DeleteExpenseButton({
  id,
  description,
}: {
  id: string;
  description: string;
}) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Hapus pengeluaran "${description}"?`)) return;
    startTransition(async () => {
      const result = await deleteExpense(id);
      if (result.error) toast.error(result.error);
      else toast.success("Pengeluaran dihapus.");
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Hapus"
      onClick={handleClick}
      disabled={pending}
    >
      <Trash2 className="text-destructive" />
    </Button>
  );
}
