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

import { updatePayment } from "../actions";
import { emptyPaymentState } from "../action-state";
import { PaymentFormFields } from "./payment-form";
import type { Payment } from "@/types/payment";

export function EditPaymentDialog({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false);
  const action = updatePayment.bind(null, payment.id);
  const [state, formAction] = useActionState(action, emptyPaymentState);

  useEffect(() => {
    if (state.success) {
      toast.success("Pembayaran berhasil diperbarui.");
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
          <DialogTitle>Edit Pembayaran</DialogTitle>
          <DialogDescription>
            Perbarui detail pembayaran iuran ini.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <PaymentFormFields
            paymentType={payment.payment_type}
            defaults={payment}
            submitLabel="Simpan Perubahan"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
