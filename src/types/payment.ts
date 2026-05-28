export const PAYMENT_TYPES = [
  "Listrik Atas",
  "Listrik Bawah",
  "WiFi + Sampah",
] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYER_NAMES = [
  "Damar",
  "Latif",
  "Rian",
  "Hapid",
  "Atmaja",
  "Tangkas",
  "Muad",
  "Ilham",
  "Fajar",
  "Gondang",
  "Rifqi",
  "Nazriel",
] as const;

export type PayerName = (typeof PAYER_NAMES)[number];

export type Payment = {
  id: string;
  user_id: string;
  name: string;
  payment_type: PaymentType;
  amount: number;
  total: number;
  month: string;
  created_at: string;
};

export const EXPENSE_CATEGORIES = PAYMENT_TYPES;

export type ExpenseCategory = PaymentType;

export type Expense = {
  id: string;
  user_id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  month: string;
  created_at: string;
};
