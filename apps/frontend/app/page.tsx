"use client";

import Image from "next/image";
import { StatCard } from "@/components/StatCard";
import { EventFeed } from "@/components/EventFeed";
import { DemoControls } from "@/components/DemoControls";
import { useDemoState } from "@/lib/useDemoState";

const usd = (n: number) => `$${n.toFixed(2)}`;

export default function DashboardPage() {
  const { state, connected, dispatch } = useDemoState();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex items-center justify-between">
        <Image src="/brand/tab-wordmark-white.svg" alt="tab." width={120} height={48} priority />
        <div className="flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : "bg-cherry"}`}
            title={connected ? "mock-merchant bağlı" : "mock-merchant'a bağlanılamıyor"}
          />
          <p className="text-sm text-cloud/50">AI ajanları için payment channel tabanlı kredi protokolü</p>
        </div>
      </header>

      <section className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-cherry/20 to-transparent p-8">
        <h1 className="max-w-2xl text-3xl font-semibold leading-tight">
          Your agent runs a tab. <span className="text-cherry">LPs earn the yield.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-cloud/60">
          Para sadece onaylı merchant&apos;lara akar · harcanmayan kısım otomatik olarak LP&apos;lere
          geri döner · ajan ele geçirilse bile kredi çalınamaz.
        </p>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Havuz TVL" value={usd(state.pool.tvl)} hint="tUSDC" />
        <StatCard label="Açık Maruziyet" value={usd(state.pool.openExposure)} hint={state.channel.open ? "1 aktif kanal" : "0 aktif kanal"} />
        <StatCard label="Ajan Limiti" value={usd(state.agent.limit)} hint={`bond ${usd(state.agent.bond)}`} />
        <StatCard label="Protokol Skoru" value={`${state.agent.score} / 1000`} hint={state.agent.status === "none" ? "kayıtsız" : state.agent.status} />
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-1">
          <h2 className="text-sm font-medium text-cloud/70">Ajan Durumu</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-cloud/50">Durum</span><span>{state.agent.status === "none" ? "—" : state.agent.status}</span></div>
            <div className="flex justify-between"><span className="text-cloud/50">Bond</span><span>{usd(state.agent.bond)}</span></div>
            <div className="flex justify-between"><span className="text-cloud/50">Açık Borç</span><span>{usd(state.agent.debt)}</span></div>
            <div className="flex justify-between"><span className="text-cloud/50">Cüzdan Bakiyesi</span><span className="font-semibold text-cherry">$0.00</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-1">
          <h2 className="text-sm font-medium text-cloud/70">Kanal Durumu</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-cloud/50">Deposit</span><span>{usd(state.channel.deposit)}</span></div>
            <div className="flex justify-between"><span className="text-cloud/50">Settled</span><span>{usd(state.channel.settled)}</span></div>
            <div className="flex justify-between">
              <span className="text-cloud/50">Durum</span>
              <span className={state.channel.open ? "text-emerald-400" : "text-cloud/40"}>
                {state.channel.open ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-1">
          <h2 className="text-sm font-medium text-cloud/70">Olay Akışı</h2>
          <div className="mt-3 max-h-64 overflow-y-auto">
            {state.events.length === 0 ? (
              <p className="text-xs text-cloud/40">Henüz olay yok — demoyu başlatmak için sağdaki adımları kullanın.</p>
            ) : (
              <EventFeed events={state.events} />
            )}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <DemoControls onDispatch={dispatch} onReset={() => dispatch("reset")} />
      </section>
    </main>
  );
}
