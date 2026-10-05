import Image from "next/image";
import { StatCard } from "@/components/StatCard";
import { EventFeed, type FeedEvent } from "@/components/EventFeed";

// TODO: aşağıdaki mock veriler Tab programından (Anchor Program istemcisi /
// keeper API'si) okunacak. Bkz. docs/Tab_Proje_Dokumani.md §15 Demo Senaryosu.
const mockEvents: FeedEvent[] = [
  { id: "1", label: "LP $1.000 USDC yatırdı", detail: "tUSDC mint edildi · havuz TVL güncellendi", tone: "info" },
  { id: "2", label: "Operatör ajanı kaydetti", detail: "bond $50 → limit $50 (1.0x)", tone: "info" },
  { id: "3", label: "Kredili kanal açıldı", detail: "tavan $5 · payer = Pool PDA · signer = Ajan", tone: "info" },
  { id: "4", label: "Kanal kapandı, iade havuza döndü", detail: "$2.80 merchant'a · $2.20 havuza — AHA anı", tone: "success" },
  { id: "5", label: "Allowlist dışı kanal denemesi reddedildi", detail: "merchant onaylı değil", tone: "danger" },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex items-center justify-between">
        <Image src="/brand/tab-wordmark-white.svg" alt="tab." width={120} height={48} priority />
        <p className="text-sm text-cloud/50">AI ajanları için payment channel tabanlı kredi protokolü</p>
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
        <StatCard label="Havuz TVL" value="$1.000" hint="tUSDC" />
        <StatCard label="Açık Maruziyet" value="$5.00" hint="1 aktif kanal" />
        <StatCard label="Ajan Limiti" value="$50.00" hint="bond × 1.0x" />
        <StatCard label="Protokol Skoru" value="0 / 1000" hint="yeni ajan" />
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-1">
          <h2 className="text-sm font-medium text-cloud/70">Ajan Terminali</h2>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-emerald-300">
{`$ pnpm dev:agent
[agent] tüketilen: $0.14 → {...}
[agent] tüketilen: $0.28 → {...}`}
          </pre>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-1">
          <h2 className="text-sm font-medium text-cloud/70">Kanal Durumu</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-cloud/50">Deposit</span><span>$5.00</span></div>
            <div className="flex justify-between"><span className="text-cloud/50">Settled</span><span>$2.80</span></div>
            <div className="flex justify-between"><span className="text-cloud/50">Durum</span><span className="text-emerald-400">Open</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-1">
          <h2 className="text-sm font-medium text-cloud/70">Olay Akışı</h2>
          <div className="mt-3">
            <EventFeed events={mockEvents} />
          </div>
        </div>
      </section>
    </main>
  );
}
