import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tab.",
  description: "AI ajanları için payment channel tabanlı kredi protokolü",
  icons: { icon: "/brand/tab-favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-obsidian text-cloud font-sans">{children}</body>
    </html>
  );
}
