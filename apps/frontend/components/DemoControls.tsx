"use client";

interface Step {
  action: string;
  label: string;
  tone?: "default" | "danger";
}

const STEPS: Step[] = [
  { action: "lp_deposit", label: "1. LP $1.000 yatırır" },
  { action: "register_agent", label: "2. Ajanı kaydet + bond" },
  { action: "open_channel", label: "3. Kredili kanal aç ($5)" },
  { action: "consume", label: "4. Ajan inference tüketir" },
  { action: "settle_close", label: "5. Settle + kapat (AHA)" },
  { action: "repay", label: "6. Operatör geri öder" },
  { action: "bad_agent_consume", label: "7. Kötü ajan: tüket, ödeme" },
  { action: "bad_agent_default", label: "8. mark_default + slash", tone: "danger" },
  { action: "blocked_attack", label: "9. Saldırı denemesi → RED", tone: "danger" },
];

export function DemoControls({ onDispatch, onReset }: { onDispatch: (action: string) => void; onReset: () => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-cloud/70">Demo Kontrolü</h2>
        <button
          onClick={onReset}
          className="rounded-md border border-white/10 px-2 py-1 text-xs text-cloud/50 hover:bg-white/5"
        >
          Sıfırla
        </button>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {STEPS.map((s) => (
          <button
            key={s.action}
            onClick={() => onDispatch(s.action)}
            className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
              s.tone === "danger"
                ? "border-cherry/40 bg-cherry/10 text-cloud hover:bg-cherry/20"
                : "border-white/10 bg-white/[0.02] text-cloud hover:bg-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
