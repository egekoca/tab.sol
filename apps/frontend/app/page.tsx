"use client";

import { useState } from "react";
import Image from "next/image";
import { StatCard } from "@/components/StatCard";
import { EventFeed } from "@/components/EventFeed";
import { DemoControls } from "@/components/DemoControls";
import { useDemoState } from "@/lib/useDemoState";
import { useLang } from "@/lib/i18n";

const usd = (n: number) => `$${n.toFixed(2)}`;

export default function DashboardPage() {
  const { state, connected, dispatch } = useDemoState();
  const { t, lang, setLang } = useLang();
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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Image src="/brand/tab-wordmark-white.svg" alt="tab." width={140} height={56} priority />
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-400" : "bg-cherry"}`}
              title={connected ? t("connected") : t("disconnected")}
            />
            <p className="text-base text-cloud/60">{t("tagline")}</p>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-white/15 text-sm font-medium">
            <button
              onClick={() => setLang("tr")}
              className={`px-3 py-1.5 ${lang === "tr" ? "bg-cherry text-cloud" : "text-cloud/50 hover:bg-white/5"}`}
            >
              TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 ${lang === "en" ? "bg-cherry text-cloud" : "text-cloud/50 hover:bg-white/5"}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <section className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-cherry/20 to-transparent p-8 sm:p-10">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          {t("heroTitlePrefix")} <span className="text-cherry">{t("heroTitleHighlight")}</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-cloud/65">{t("heroSubtitle")}</p>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-cloud">{t("panelAgent")}</h2>
          <div className="mt-4 space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-cloud/50">{t("fieldStatus")}</span>
              <span className="font-medium">{state.agent.status === "none" ? "—" : t(`status${state.agent.status}`)}</span>
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
              <span className="font-semibold text-cherry">$0.00</span>
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
      </section>

      <section className="mt-6">
        <DemoControls onDispatch={handleDispatch} onReset={() => handleDispatch("reset")} completed={completed} />
      </section>
    </main>
  );
}
