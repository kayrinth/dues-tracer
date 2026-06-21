# Supabase Setup

Panduan setup Supabase untuk Iuran Tracker.

## 1. Buat Project

1. Login ke [supabase.com](https://supabase.com), klik **New project**.
2. Catat **Project URL** dan **anon public key** dari **Settings → API**.

## 2. Isi `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## 3. Jalankan SQL Schema

Buka **SQL Editor** di Supabase, jalankan:

```sql
-- Tabel payments
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  payment_type text not null,
  amount numeric not null check (amount >= 0),
  total numeric not null check (total >= 0),
  date date not null,
  created_at timestamptz default now() not null
);

create index payments_user_id_idx on payments(user_id);
create index payments_user_date_idx on payments(user_id, date);

alter table payments enable row level security;

create policy "Public read access" on payments
  for select using (true);
create policy "Authenticated users can insert" on payments
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Authenticated users can update" on payments
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Authenticated users can delete" on payments
  for delete to authenticated using (auth.uid() = user_id);

-- Tabel expenses (pengeluaran)
create table expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  description text not null,
  category text not null,
  amount numeric not null check (amount >= 0),
  date date not null,
  created_at timestamptz default now() not null
);

create index expenses_user_id_idx on expenses(user_id);
create index expenses_user_date_idx on expenses(user_id, date);

alter table expenses enable row level security;

create policy "Public read access expenses" on expenses
  for select using (true);
create policy "Authenticated users can insert expenses" on expenses
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Authenticated users can update expenses" on expenses
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Authenticated users can delete expenses" on expenses
  for delete to authenticated using (auth.uid() = user_id);
```

## 3a. Migrasi (jika Anda sudah punya data versi lama)

Skema lama memakai kolom `month` (text, format `YYYY-MM`). Versi terbaru memakai
kolom `date` (tipe date, format `YYYY-MM-DD`). Jalankan ini untuk migrasi
in-place:

```sql
-- payments
alter table payments rename column month to date;
update payments set date = date || '-01' where length(date) = 7;
alter table payments alter column date type date using date::date;
drop index if exists payments_user_month_idx;
create index if not exists payments_user_date_idx on payments(user_id, date);

-- expenses
alter table expenses rename column month to date;
update expenses set date = date || '-01' where length(date) = 7;
alter table expenses alter column date type date using date::date;
drop index if exists expenses_user_month_idx;
create index if not exists expenses_user_date_idx on expenses(user_id, date);
```

Tanggal-tanggal lama yang sebelumnya hanya `YYYY-MM` jadi diasumsikan tanggal 1
bulan tersebut. Anda boleh ubah manual per-record sesuai tanggal aslinya.

## 4. Aktifkan Email/Password Auth

**Authentication → Providers → Email** → aktifkan.

> Karena halaman register tidak disediakan, buat user pertama secara manual via:
> **Authentication → Users → Add user → Create new user**
> Isi email + password, centang **Auto Confirm User**.

## 5. Jalankan App

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — sekarang **siapa pun bisa lihat dashboard** (read-only). Klik **Masuk** di pojok kanan atas untuk login dan dapat akses tambah/edit/hapus.

## 6. Deploy ke Vercel

1. Push repo ke GitHub.
2. Di Vercel: **New Project → Import** repo.
3. Tambahkan environment variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.
