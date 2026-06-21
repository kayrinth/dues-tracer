"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EXPENSE_CATEGORIES, type Expense, type ExpenseCategory } from "@/types/payment";
import { currentDateValue } from "@/lib/format";

type Props = {
  category: ExpenseCategory;
  defaults?: Pick<Expense, "description" | "amount" | "date">;
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

export function ExpenseFormFields({ category, defaults, submitLabel }: Props) {
  const [amountDisplay, setAmountDisplay] = useState(
    defaults?.amount != null ? formatRupiahInput(defaults.amount) : "",
  );
  const amountRaw = stripRupiahFormat(amountDisplay);
  const isValidCategory = (EXPENSE_CATEGORIES as readonly string[]).includes(category);

  return (
    <div className="space-y-4">
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="amount" value={amountRaw} />

      <div className="space-y-2">
        <Label>Kategori</Label>
        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
          {isValidCategory ? category : "—"}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Keterangan</Label>
        <Input
          id="description"
          name="description"
          placeholder="Misal: Bayar PLN, Token listrik, dll."
          defaultValue={defaults?.description ?? ""}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="expense-amount-display">Nominal</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              Rp
            </span>
            <Input
              id="expense-amount-display"
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
          <Label htmlFor="expense-date">Tanggal</Label>
          <Input
            id="expense-date"
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
