"use client";

import { Lock, Clock, TrendingDown } from "lucide-react";
import { useLang } from "@/lib/i18n";

const cards = [
  { key: "p1", icon: Lock },
  { key: "p2", icon: Clock },
  { key: "p3", icon: TrendingDown },
];

export function ProblemSection() {
  const { t } = useLang();

  return (
    <section id="problem" className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cherry-bright">{t("problem.eyebrow")}</p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] sm:text-6xl">
          {t("problem.headlineLine1")}
          <br />
          <span className="text-cherry-bright">{t("problem.headlineLine2")}</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {cards.map(({ key, icon: Icon }) => (
            <div key={key} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <Icon className="h-6 w-6 text-cherry-bright" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-semibold">{t(`problem.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cloud/55">{t(`problem.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
