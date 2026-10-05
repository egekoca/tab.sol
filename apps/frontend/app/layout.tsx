import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/components/SolanaProvider";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "tab.",
  description: "AI ajanları için payment channel tabanlı kredi protokolü",
  icons: { icon: "/brand/tab-favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-obsidian text-cloud font-sans text-[17px]">
        <LangProvider>
          <SolanaProvider>{children}</SolanaProvider>
        </LangProvider>
      </body>
    </html>
  );
}
