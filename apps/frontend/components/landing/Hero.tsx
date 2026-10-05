"use client";

import { useLang } from "@/lib/i18n";
import { GhostText } from "./GhostText";
import { OrbitDiagram } from "./OrbitDiagram";

export function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(107,29,44,0.25),transparent_60%)]"
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2 sm:px-4">
          <GhostText text="TAB" className="text-[18vw] sm:text-[12vw]" />
          <GhostText text="TAB" className="text-[18vw] sm:text-[12vw]" />
        </div>

        <div className="relative z-10">
          <OrbitDiagram />
        </div>

        <h1 className="relative z-10 mt-10 max-w-3xl font-display text-3xl uppercase leading-[1.05] tracking-tight sm:text-5xl">
          {t("hero.titleLine1")} <span className="text-cherry-bright">{t("hero.titleLine2")}</span>
        </h1>
        <p className="relative z-10 mt-5 max-w-xl text-base text-cloud/60 sm:text-lg">{t("heroSubtitle")}</p>

        <a
          href="#demo"
          className="relative z-10 mt-8 rounded-lg bg-gradient-to-br from-cherry-bright to-cherry px-7 py-3.5 font-mono text-sm uppercase tracking-[0.15em] text-cloud shadow-[0_8px_30px_-8px_rgba(224,69,95,0.6)] transition-transform hover:scale-[1.03]"
        >
          {t("nav.cta")} →
        </a>

        <div className="relative z-10 mt-16 flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cloud/30">
          <span>{t("hero.scroll")}</span>
          <span className="h-8 w-px bg-cloud/20" />
        </div>
      </div>
    </section>
  );
}
