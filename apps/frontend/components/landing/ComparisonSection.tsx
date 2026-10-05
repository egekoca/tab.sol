"use client";

import { Check, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function ComparisonSection() {
  const { t } = useLang();

  const advanceItems = ["advance1", "advance2", "advance3"];
  const tabItems = ["tab1", "tab2", "tab3"];

  return (
    <section id="solution" className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cherry-bright">{t("solution.eyebrow")}</p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] sm:text-6xl">
          {t("solution.headlineLine1")}
          <br />
          <span className="text-cherry-bright">{t("solution.headlineLine2")}</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-7">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cloud/40">{t("solution.advanceLabel")}</p>
            <h3 className="mt-2 text-xl font-semibold text-cloud/80">{t("solution.advanceSubtitle")}</h3>
            <ul className="mt-6 space-y-3">
              {advanceItems.map((k) => (
                <li key={k} className="flex items-start gap-3 text-sm text-cloud/55">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-cloud/30" strokeWidth={2} />
                  {t(`solution.${k}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-cherry-bright/40 bg-cherry/[0.07] p-7">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cherry-bright">{t("solution.tabLabel")}</p>
            <h3 className="mt-2 text-xl font-semibold text-cloud">{t("solution.tabSubtitle")}</h3>
            <ul className="mt-6 space-y-3">
              {tabItems.map((k) => (
                <li key={k} className="flex items-start gap-3 text-sm text-cloud/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cherry-bright" strokeWidth={2.5} />
                  {t(`solution.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center font-display text-lg uppercase tracking-tight text-cloud/70 sm:text-2xl">
          {t("solution.footnote")}
        </p>
      </div>
    </section>
  );
}
