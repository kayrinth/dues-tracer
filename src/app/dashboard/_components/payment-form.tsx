"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  PAYER_NAMES,
  PAYMENT_TYPES,
  type Payment,
  type PaymentType,
} from "@/types/payment";
import { currentDateValue } from "@/lib/format";

const selectClasses =
  "flex h-9 w-full appearance-none rounded-md border border-input bg-transparent bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat px-3 py-1 pr-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')]";

type Props = {
  paymentType: PaymentType;
  defaults?: Pick<Payment, "name" | "amount" | "date">;
  submitLabel: string;
};

function SubmitButton({ submitLabel }: { submitLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : submitLabel}
    </Button>
  );
}

function formatRupiahInput(value: string | number): string {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

function stripRupiahFormat(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

export function PaymentFormFields({ paymentType, defaults, submitLabel }: Props) {
  const [amountDisplay, setAmountDisplay] = useState(
    defaults?.amount != null ? formatRupiahInput(defaults.amount) : "",
  );

  const amountRaw = stripRupiahFormat(amountDisplay);
  const isValidCategory = (PAYMENT_TYPES as readonly string[]).includes(paymentType);

  return (
    <div className="space-y-4">
      <input type="hidden" name="payment_type" value={paymentType} />
      <input type="hidden" name="amount" value={amountRaw} />

      <div className="space-y-2">
        <Label>Jenis Pembayaran</Label>
        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
          {isValidCategory ? paymentType : "—"}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <select
          id="name"
          name="name"
          defaultValue={defaults?.name ?? ""}
          required
          className={selectClasses}
        >
          <option value="" disabled>
            Pilih nama
          </option>
          {PAYER_NAMES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount-display">Nominal</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              Rp
            </span>
            <Input
              id="amount-display"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="100.000"
              className="pl-9"
              value={amountDisplay}
              onChange={(e) => setAmountDisplay(formatRupiahInput(e.target.value))}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Tanggal</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={defaults?.date ?? currentDateValue()}
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton submitLabel={submitLabel} />
      </div>
    </div>
  );
}
