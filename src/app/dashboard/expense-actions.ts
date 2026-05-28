"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { EXPENSE_CATEGORIES } from "@/types/payment";
import type { ExpenseActionState } from "./expense-action-state";

const expenseSchema = z.object({
  description: z.string().min(1, "Keterangan wajib diisi.").max(200),
  category: z.enum(EXPENSE_CATEGORIES),
  amount: z.coerce.number().nonnegative("Nominal tidak boleh negatif."),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Format bulan harus YYYY-MM."),
});

export async function createExpense(
  _prev: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const parsed = expenseSchema.safeParse({
    description: formData.get("description"),
    category: formData.get("category"),
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

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    description: parsed.data.description,
    category: parsed.data.category,
    amount: parsed.data.amount,
    month: parsed.data.month,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateExpense(
  id: string,
  _prev: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  if (!id) return { error: "ID pengeluaran tidak ditemukan." };

  const parsed = expenseSchema.safeParse({
    description: formData.get("description"),
    category: formData.get("category"),
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
    .from("expenses")
    .update({
      description: parsed.data.description,
      category: parsed.data.category,
      amount: parsed.data.amount,
      month: parsed.data.month,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteExpense(id: string): Promise<ExpenseActionState> {
  if (!id) return { error: "ID pengeluaran tidak ditemukan." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda belum login." };

  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
