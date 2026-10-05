import type { Metadata } from "next";
import { Archivo_Black, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/SolanaProvider";
import { LangProvider } from "@/lib/i18n";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "tab.",
  description: "AI ajanları için payment channel tabanlı kredi protokolü",
  icons: { icon: "/brand/tab-favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body
        className={`${display.variable} ${mono.variable} min-h-screen bg-obsidian text-cloud font-sans text-[17px]`}
      >
        <LangProvider>
          <SolanaProvider>{children}</SolanaProvider>
        </LangProvider>
      </body>
    </html>
  );
}
