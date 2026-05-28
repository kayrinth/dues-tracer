import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { HydrationErrorSuppressor } from "@/components/hydration-error-suppressor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iuran Tracker",
  description: "Pelacak pembayaran iuran bulanan rumah tangga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className="min-h-screen bg-muted/30 text-foreground antialiased"
        suppressHydrationWarning
      >
        <HydrationErrorSuppressor />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
