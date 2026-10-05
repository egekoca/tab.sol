"use client";

import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.15em] text-cloud/40 sm:flex-row">
        <p>tab. · {t("footer.tagline")}</p>
        <div className="flex items-center gap-5">
          <a href="https://github.com/egekoca/tab.sol" className="transition-colors hover:text-cloud" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://colosseum.com/worldsfair" className="transition-colors hover:text-cloud" target="_blank" rel="noreferrer">
            Colosseum
          </a>
        </div>
      </div>
    </footer>
  );
}
