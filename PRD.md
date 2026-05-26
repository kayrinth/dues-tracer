# Iuran Tracker Website — Product Requirements Document (PRD)

---

# 1. Product Overview

## Purpose

To develop a modern web application for tracking monthly household payments efficiently using Next.js and Supabase.

---

# 2. Tech Stack

## Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn UI

---

## Backend

- Supabase

---

## Database

- PostgreSQL (Supabase Database)

---

## Authentication

- Supabase Auth

---

## Deployment

- Vercel

---

# 3. Functional Requirements

---

# 3.1 Authentication

## Features

Users can:

- Register
- Login
- Logout

Authentication handled using Supabase Auth.

---

# 3.2 Dashboard

## Dashboard Features

Display:

- Total monthly payments
- Total overall payments
- Total records
- Recent payments

---

# 3.3 Payment Management

## Add Payment

User inputs:

- Name
- Payment Type
- Amount
- Month

System automatically generates:

- Total

---

## Edit Payment

User can update:

- Name
- Payment type
- Amount
- Month

---

## Delete Payment

User can remove payment records.

---

## Payment Table

Display all payment records.

Example:

| Name  | Payment Type         | Amount    | Month    | Total     |
| ----- | -------------------- | --------- | -------- | --------- |
| Damar | Waste + WiFi         | Rp100.000 | May 2026 | Rp100.000 |
| Damar | Electricity Upstairs | Rp250.000 | May 2026 | Rp250.000 |

---

# 4. Payment Categories

## Available Categories

```ts
["Waste + WiFi", "Electricity Upstairs", "Electricity Downstairs"];
```

---

# 5. Database Schema

## Table: payments

| Column       | Type      |
| ------------ | --------- |
| id           | uuid      |
| user_id      | uuid      |
| name         | text      |
| payment_type | text      |
| amount       | numeric   |
| total        | numeric   |
| month        | text      |
| created_at   | timestamp |

---

## SQL Schema

```sql
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  payment_type text not null,
  amount numeric not null,
  total numeric not null,
  month text not null,
  created_at timestamp default now()
);
```

---

# 6. Application Pages

---

## 6.1 Login Page

Features:

- Email login
- Password login

---

## 6.2 Dashboard Page

Contains:

- Summary cards
- Payment table
- Add payment button

---

## 6.3 Add Payment Modal/Form

Fields:

- Name
- Payment Type
- Amount
- Month

---

## 6.4 Edit Payment Modal/Form

Same fields as add payment form.

---

# 7. UI/UX Requirements

## Design Style

- Minimalist
- Clean dashboard UI
- Responsive layout
- Modern card-based design

---

## Suggested Components

- Table
- Modal
- Dropdown
- Toast notification
- Summary cards

---

# 8. Non-Functional Requirements

---

## Performance

- Fast loading
- Optimized queries
- Real-time updates support

---

## Security

- Protected routes
- Row Level Security (RLS)
- Input validation

---

## Scalability

The architecture should support:

- Multiple users
- Additional payment categories
- Future analytics features

---

# 9. Supabase Requirements

## Enable Authentication

- Email/password auth

---

## Enable Row Level Security

Example Policy:

```sql
create policy "Users can manage their own payments"
on payments
for all
using (auth.uid() = user_id);
```

---

# 10. Suggested Folder Structure

```bash
src/
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   └── forms/
│
├── lib/
│   ├── supabase/
│   └── utils/
│
├── types/
│
└── hooks/
```

---

# 11. Future Improvements

Potential future features:

- Payment status (Paid/Unpaid)
- Export PDF/Excel
- Charts & analytics
- Monthly reminder notifications
- Dark mode
- Multi-property support

---

# 12. Success Metrics

The project is successful if:

- Users can manage payments easily
- Totals are calculated correctly
- The dashboard is responsive and fast
- Data is securely stored in Supabase

---
