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

import { createPayment } from "../actions";
import { emptyPaymentState } from "../action-state";
import { PaymentFormFields } from "./payment-form";
import type { PaymentType } from "@/types/payment";

export function AddPaymentDialog({
  defaultPaymentType,
}: {
  defaultPaymentType: PaymentType;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createPayment, emptyPaymentState);

  useEffect(() => {
    if (state.success) {
      toast.success("Pembayaran berhasil ditambahkan.");
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
          Tambah Pembayaran
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pembayaran</DialogTitle>
          <DialogDescription>
            Catat pembayaran iuran bulanan baru.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <PaymentFormFields
            paymentType={defaultPaymentType}
            submitLabel="Simpan"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
