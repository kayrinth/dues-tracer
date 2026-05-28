import Link from "next/link";
import { LogIn, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  email: string | null;
  isAuthenticated: boolean;
};

export function DashboardHeader({ email, isAuthenticated }: Props) {
  return (
    <header className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Wallet className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Iuran Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAuthenticated ? (
              <>
                Masuk sebagai <span className="font-medium">{email}</span>
              </>
            ) : (
              <>
                Mode <span className="font-medium">tamu</span> &mdash; hanya bisa
                melihat
              </>
            )}
          </p>
        </div>
      </div>
      {isAuthenticated ? (
        <form action="/auth/logout" method="post">
          <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
            Keluar
          </Button>
        </form>
      ) : (
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/login">
            <LogIn />
            Masuk
          </Link>
        </Button>
      )}
    </header>
  );
}
