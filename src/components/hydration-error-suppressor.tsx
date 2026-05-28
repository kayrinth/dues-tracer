"use client";

// Browser extensions seperti Bitdefender menambahkan atribut (bis_skin_checked,
// __processed_*) ke elemen DOM SEBELUM React hydrate, sehingga memicu hydration
// mismatch yang berisik di console — padahal bukan bug aplikasi. Filter ini hanya
// menelan pesan yang berkaitan dengan atribut extension tersebut; hydration error
// asli tetap muncul.
if (typeof window !== "undefined") {
  const markers = ["bis_skin_checked", "bis_register", "__processed_"];
  const original = console.error;
  console.error = (...args: unknown[]) => {
    const text = args
      .map((a) => (typeof a === "string" ? a : ""))
      .join(" ");
    if (markers.some((m) => text.includes(m))) return;
    original.apply(console, args as Parameters<typeof console.error>);
  };
}

export function HydrationErrorSuppressor() {
  return null;
}
