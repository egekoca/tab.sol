"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";

export function SiteNav() {
  const { t, lang, setLang } = useLang();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-obsidian/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top">
          <Image src="/brand/tab-wordmark-white.svg" alt="tab." width={92} height={36} priority />
        </a>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.2em] text-cloud/60 md:flex">
          <a href="#problem" className="transition-colors hover:text-cloud">
            {t("nav.problem")}
          </a>
          <a href="#solution" className="transition-colors hover:text-cloud">
            {t("nav.solution")}
          </a>
          <a href="#demo" className="transition-colors hover:text-cloud">
            {t("nav.demo")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-white/15 font-mono text-xs font-medium">
            <button
              onClick={() => setLang("tr")}
              className={`px-2.5 py-1.5 ${lang === "tr" ? "bg-cherry text-cloud" : "text-cloud/50 hover:bg-white/5"}`}
            >
              TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 ${lang === "en" ? "bg-cherry text-cloud" : "text-cloud/50 hover:bg-white/5"}`}
            >
              EN
            </button>
          </div>
          <a
            href="#demo"
            className="hidden rounded-lg border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-cloud transition-colors hover:border-cherry-bright/60 hover:text-cherry-bright sm:block"
          >
            {t("nav.cta")} →
          </a>
        </div>
      </div>
    </header>
  );
}
