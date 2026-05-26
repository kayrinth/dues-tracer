"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { PAYER_NAMES, PAYMENT_TYPES } from "@/types/payment";
import type { PaymentActionState } from "./action-state";

const paymentSchema = z.object({
  name: z.enum(PAYER_NAMES, { message: "Nama tidak dikenal." }),
  payment_type: z.enum(PAYMENT_TYPES),
  amount: z.coerce.number().nonnegative("Nominal tidak boleh negatif."),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Format bulan harus YYYY-MM."),
});

export async function createPayment(
  _prev: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const parsed = paymentSchema.safeParse({
    name: formData.get("name"),
    payment_type: formData.get("payment_type"),
    amount: formData.get("amount"),
    month: formData.get("month"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Anda belum login." };

  const { error } = await supabase.from("payments").insert({
    user_id: user.id,
    name: parsed.data.name,
    payment_type: parsed.data.payment_type,
    amount: parsed.data.amount,
    total: parsed.data.amount,
    month: parsed.data.month,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePayment(
  id: string,
  _prev: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  if (!id) return { error: "ID pembayaran tidak ditemukan." };

  const parsed = paymentSchema.safeParse({
    name: formData.get("name"),
    payment_type: formData.get("payment_type"),
    amount: formData.get("amount"),
    month: formData.get("month"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda belum login." };

  const { error } = await supabase
    .from("payments")
    .update({
      name: parsed.data.name,
      payment_type: parsed.data.payment_type,
      amount: parsed.data.amount,
      total: parsed.data.amount,
      month: parsed.data.month,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePayment(id: string): Promise<PaymentActionState> {
  if (!id) return { error: "ID pembayaran tidak ditemukan." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda belum login." };

  const { error } = await supabase.from("payments").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
