"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deletePayment } from "../actions";

export function DeletePaymentButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Hapus pembayaran "${name}"?`)) return;
    startTransition(async () => {
      const result = await deletePayment(id);
      if (result.error) toast.error(result.error);
      else toast.success("Pembayaran dihapus.");
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
