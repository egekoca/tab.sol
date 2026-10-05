import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/components/SolanaProvider";

export const metadata: Metadata = {
  title: "tab.",
  description: "AI ajanları için payment channel tabanlı kredi protokolü",
  icons: { icon: "/brand/tab-favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-obsidian text-cloud font-sans">
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}
