export const PAYMENT_TYPES = [
  "Listrik Atas",
  "Listrik Bawah",
  "WiFi + Sampah",
] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];

// Nominal iuran wajib per orang per bulan untuk tiap kategori.
// Hanya kategori yang ada di sini yang akan dicek "Iuran Kurang"-nya.
// Ubah angka di sini jika tarif iuran berubah.
export const EXPECTED_DUES: Partial<Record<PaymentType, number>> = {
  "Listrik Atas": 60000,
  "WiFi + Sampah": 49000,
};

// Daftar nama yang wajib bayar per kategori.
// Jika sebuah kategori tidak di-list di sini, default = semua PAYER_NAMES.
// Listrik Atas hanya untuk penghuni lantai atas; sisanya tidak diharapkan bayar.
export const EXPECTED_PAYERS_BY_CATEGORY: Partial<Record<PaymentType, readonly PayerName[]>> = {
  "Listrik Atas": [
    "Damar",
    "Latif",
    "Hapid",
    "Rian",
    "Atmaja",
    "Tangkas",
    "Muad",
  ],
};

// Override nominal iuran per orang per kategori.
// Jika ada entry di sini, nilai itu yang dipakai (bukan EXPECTED_DUES).
// Contoh: Rifqi hanya Rp 14.000 untuk WiFi + Sampah (bagi yang lain tetap 49.000).
export const EXPECTED_DUES_OVERRIDES: Partial<
  Record<PaymentType, Partial<Record<PayerName, number>>>
> = {
  "WiFi + Sampah": {
    Rifqi: 14000,
  },
};

// Bulan yang dikecualikan total dari pengecekan "Iuran Kurang" per kategori.
// Format: "YYYY-MM". Pakai ini hanya kalau ingin SKIP bulan itu sepenuhnya.
export const SHORTAGE_EXEMPT_MONTHS: Partial<Record<PaymentType, readonly string[]>> = {
  "WiFi + Sampah": ["2026-05"],
};

// Override tarif per bulan (jika tarif bulan tertentu beda dari EXPECTED_DUES).
// Format: { "YYYY-MM": { Kategori: nominal } }
// Contoh: Listrik Atas Mei 2026 tarifnya 50k (bukan 60k), jadi yang bayar 50k
// tidak akan flagged kurang, tapi yang bayar < 50k tetap flagged.
export const EXPECTED_DUES_BY_MONTH: Partial<
  Record<string, Partial<Record<PaymentType, number>>>
> = {
  "2026-05": {
    "Listrik Atas": 50000,
  },
};

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
  date: string;
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
  date: string;
  created_at: string;
};
