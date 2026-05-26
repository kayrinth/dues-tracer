# Iuran Tracker

Aplikasi web pelacak pembayaran iuran bulanan (WiFi + Sampah, Listrik Atas, Listrik Bawah) berbasis Next.js 15 + Supabase.

## Quickstart

1. Install dependensi:
   ```bash
   npm install
   ```
2. Salin `.env.example` ke `.env.local`, isi dengan kredensial Supabase Anda.
3. Jalankan SQL dari [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) di Supabase SQL Editor.
4. Buat user pertama via **Supabase Dashboard → Authentication → Users → Add user**.
5. Jalankan dev server:
   ```bash
   npm run dev
   ```

Buka [http://localhost:3000](http://localhost:3000) — akan redirect ke `/login`.

## Tech Stack

- Next.js 15 (App Router, Server Actions)
- TypeScript
- Tailwind CSS v4
- Shadcn UI (new-york style)
- Supabase (Auth + Postgres + RLS)

## Struktur

```
src/
├── app/
│   ├── dashboard/     # halaman dashboard + komponen CRUD
│   ├── login/         # halaman login + server action
│   ├── auth/logout/   # route handler untuk sign-out
│   └── layout.tsx
├── components/ui/     # Shadcn components
├── lib/
│   ├── supabase/      # client (browser/server/middleware)
│   └── utils.ts
└── types/
```
