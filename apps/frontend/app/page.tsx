"use client";

import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { EventFeed } from "@/components/EventFeed";
import { DemoControls } from "@/components/DemoControls";
import { useDemoState } from "@/lib/useDemoState";
import { useLang } from "@/lib/i18n";
import { SiteNav } from "@/components/landing/SiteNav";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { SiteFooter } from "@/components/landing/SiteFooter";

const usd = (n: number) => `$${n.toFixed(2)}`;

export default function DashboardPage() {
  const { state, dispatch } = useDemoState();
  const { t } = useLang();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  function handleDispatch(action: string) {
    if (action === "reset") {
      setCompleted(new Set());
    } else {
      setCompleted((prev) => new Set(prev).add(action));
    }
    dispatch(action);
  }

  return (
    <>
      <SiteNav />
      <Hero />
      <ProblemSection />
      <ComparisonSection />

      <section id="demo" className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cherry-bright">{t("demo.eyebrow")}</p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] sm:text-6xl">
            {t("demo.headlineLine1")}
            <br />
            <span className="text-cherry-bright">{t("demo.headlineLine2")}</span>
          </h2>
          <p className="mt-5 max-w-xl text-base text-cloud/55">{t("demo.subtitle")}</p>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={t("statPoolTvl")} value={usd(state.pool.tvl)} hint={t("statPoolTvlHint")} />
            <StatCard
              label={t("statExposure")}
              value={usd(state.pool.openExposure)}
              hint={state.channel.open ? t("statExposureHintOpen") : t("statExposureHintClosed")}
            />
            <StatCard label={t("statLimit")} value={usd(state.agent.limit)} hint={`bond ${usd(state.agent.bond)}`} />
            <StatCard
              label={t("statScore")}
              value={`${state.agent.score} / 1000`}
              hint={state.agent.status === "none" ? t("statusNone") : t(`status${state.agent.status}`)}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-1">
              <h2 className="text-lg font-semibold text-cloud">{t("panelAgent")}</h2>
              <div className="mt-4 space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-cloud/50">{t("fieldStatus")}</span>
                  <span className="font-medium">
                    {state.agent.status === "none" ? "—" : t(`status${state.agent.status}`)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cloud/50">{t("fieldBond")}</span>
                  <span className="font-medium">{usd(state.agent.bond)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cloud/50">{t("fieldDebt")}</span>
                  <span className="font-medium">{usd(state.agent.debt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cloud/50">{t("fieldWallet")}</span>
                  <span className="font-semibold text-cherry-bright">$0.00</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-1">
              <h2 className="text-lg font-semibold text-cloud">{t("panelChannel")}</h2>
              <div className="mt-4 space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-cloud/50">{t("fieldDeposit")}</span>
                  <span className="font-medium">{usd(state.channel.deposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cloud/50">{t("fieldSettled")}</span>
                  <span className="font-medium">{usd(state.channel.settled)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cloud/50">{t("fieldStatus")}</span>
                  <span className={`font-medium ${state.channel.open ? "text-emerald-400" : "text-cloud/40"}`}>
                    {state.channel.open ? t("channelOpen") : t("channelClosed")}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-1">
              <h2 className="text-lg font-semibold text-cloud">{t("panelEvents")}</h2>
              <div className="mt-4 h-72 overflow-y-auto">
                {state.events.length === 0 ? (
                  <p className="text-sm text-cloud/40">{t("eventsEmpty")}</p>
                ) : (
                  <EventFeed events={state.events} />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <DemoControls onDispatch={handleDispatch} onReset={() => handleDispatch("reset")} completed={completed} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
