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
  month text not null,
  created_at timestamptz default now() not null
);

-- Index untuk query per-user dan per-bulan
create index payments_user_id_idx on payments(user_id);
create index payments_user_month_idx on payments(user_id, month);

-- Aktifkan Row Level Security
alter table payments enable row level security;

-- Policy 1: SEMUA orang (termasuk anonymous) boleh BACA payments
create policy "Public read access"
on payments
for select
using (true);

-- Policy 2: hanya authenticated user yang boleh INSERT/UPDATE/DELETE
create policy "Authenticated users can insert"
on payments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Authenticated users can update"
on payments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Authenticated users can delete"
on payments
for delete
to authenticated
using (auth.uid() = user_id);
```

> **Kalau Anda sudah pernah menjalankan SQL versi lama** (dengan policy `"Users can manage their own payments"`), drop dulu policy itu:
>
> ```sql
> drop policy if exists "Users can manage their own payments" on payments;
> ```
>
> baru jalankan policy baru di atas.

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
