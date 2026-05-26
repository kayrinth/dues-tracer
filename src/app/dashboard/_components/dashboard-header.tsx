import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  email: string | null;
  isAuthenticated: boolean;
};

export function DashboardHeader({ email, isAuthenticated }: Props) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Iuran Tracker</h1>
        <p className="text-sm text-muted-foreground">
          {isAuthenticated ? (
            <>
              Masuk sebagai <span className="font-medium">{email}</span>
            </>
          ) : (
            <>
              Anda melihat sebagai <span className="font-medium">tamu</span>{" "}
              (read-only)
            </>
          )}
        </p>
      </div>
      {isAuthenticated ? (
        <form action="/auth/logout" method="post">
          <Button type="submit" variant="outline" size="sm">
            Keluar
          </Button>
        </form>
      ) : (
        <Button asChild variant="default" size="sm">
          <Link href="/login">Masuk</Link>
        </Button>
      )}
    </header>
  );
}
