/**
 * Demo motoru (§15 Demo Senaryosu): gerçek zincir yerine, demo günü için
 * eksiksiz ve güvenilir çalışan simüle edilmiş durum makinesi. Plan B
 * (§6.2): CPI tamamlanana kadar aynı arayüzü taklit eden akış — demo yine
 * de akıcı olur.
 */

export type EventTone = "info" | "success" | "danger";

export interface DemoEvent {
  id: string;
  label: string;
  detail: string;
  tone: EventTone;
  at: number;
}

export interface DemoState {
  pool: { tvl: number; openExposure: number };
  agent: {
    bond: number;
    limit: number;
    debt: number;
    score: number;
    status: "none" | "Active" | "Defaulted";
  };
  channel: { deposit: number; settled: number; open: boolean };
  events: DemoEvent[];
}

const USDC = (n: number) => Math.round(n * 1_000_000) / 1_000_000;

function initialState(): DemoState {
  return {
    pool: { tvl: 0, openExposure: 0 },
    agent: { bond: 0, limit: 0, debt: 0, score: 0, status: "none" },
    channel: { deposit: 0, settled: 0, open: false },
    events: [],
  };
}

let state: DemoState = initialState();

function pushEvent(label: string, detail: string, tone: EventTone) {
  state.events = [
    { id: crypto.randomUUID(), label, detail, tone, at: Date.now() },
    ...state.events,
  ].slice(0, 30);
}

export function getState(): DemoState {
  return state;
}

export type DemoAction =
  | "reset"
  | "lp_deposit"
  | "register_agent"
  | "open_channel"
  | "consume"
  | "settle_close"
  | "repay"
  | "bad_agent_consume"
  | "bad_agent_default"
  | "blocked_attack";

export function applyAction(action: DemoAction): DemoState {
  switch (action) {
    case "reset": {
      state = initialState();
      pushEvent("Demo sıfırlandı", "Tüm durum başlangıç değerlerine döndü", "info");
      break;
    }

    case "lp_deposit": {
      state.pool.tvl = USDC(state.pool.tvl + 1000);
      pushEvent("LP $1.000 USDC yatırdı", "tUSDC mint edildi · havuz TVL güncellendi", "info");
      break;
    }

    case "register_agent": {
      state.agent.bond = 50;
      state.agent.limit = 50; // bond × 1.0x (yeni ajan çarpanı)
      state.agent.status = "Active";
      state.agent.score = 0;
      pushEvent("Operatör ajanı kaydetti", "bond $50 → limit $50 (1.0x) · cüzdan bakiyesi $0", "info");
      break;
    }

    case "open_channel": {
      if (state.agent.status !== "Active") break;
      state.channel = { deposit: 5, settled: 0, open: true };
      state.pool.openExposure = USDC(state.pool.openExposure + 5);
      pushEvent(
        "Kredili kanal açıldı",
        "tavan $5 · payer = Pool PDA · signer = Ajan · payee = Merchant",
        "info"
      );
      break;
    }

    case "consume": {
      if (!state.channel.open) break;
      const next = Math.min(state.channel.deposit, USDC(state.channel.settled + 0.7));
      state.channel.settled = next;
      pushEvent("Ajan inference ödemesi yaptı", `tüketilen: $${next.toFixed(2)} / $${state.channel.deposit.toFixed(2)}`, "info");
      break;
    }

    case "settle_close": {
      if (!state.channel.open) break;
      const settled = state.channel.settled;
      const refund = USDC(state.channel.deposit - settled);
      state.pool.tvl = USDC(state.pool.tvl + refund);
      state.pool.openExposure = USDC(state.pool.openExposure - state.channel.deposit);
      state.agent.debt = USDC(state.agent.debt + settled);
      state.channel.open = false;
      pushEvent(
        "Kanal kapandı, iade havuza döndü",
        `$${settled.toFixed(2)} merchant'a · $${refund.toFixed(2)} havuza geri — AHA anı`,
        "success"
      );
      break;
    }

    case "repay": {
      if (state.agent.debt === 0) break;
      const amount = state.agent.debt;
      state.agent.debt = 0;
      state.agent.score = Math.min(1000, state.agent.score + 50);
      pushEvent("Operatör borcu ödedi", `$${amount.toFixed(2)} repay · LP share fiyatı artar · skor +50`, "success");
      break;
    }

    case "bad_agent_consume": {
      state.channel = { deposit: 5, settled: 5, open: true };
      state.agent.debt = USDC(state.agent.debt + 5);
      state.pool.openExposure = USDC(state.pool.openExposure + 5);
      pushEvent("İkinci ajan tüketti, ödemedi", "$5.00 borç · vade + grace dolmak üzere", "info");
      break;
    }

    case "bad_agent_default": {
      const loss = state.agent.debt;
      const fromBond = Math.min(loss, state.agent.bond);
      state.agent.bond = USDC(state.agent.bond - fromBond);
      state.agent.debt = 0;
      state.agent.status = "Defaulted";
      state.agent.score = 0;
      state.channel.open = false;
      state.pool.openExposure = USDC(Math.max(0, state.pool.openExposure - 5));
      pushEvent(
        "mark_default tetiklendi",
        `vade + grace geçti · kanallar kapatıldı · $${fromBond.toFixed(2)} operatör bond'u slash edildi · LP zararsız`,
        "danger"
      );
      break;
    }

    case "blocked_attack": {
      pushEvent(
        "Allowlist dışı kanal denemesi reddedildi",
        "RED: merchant allowlist'te değil — para asla ajan cüzdanına ulaşmadı",
        "danger"
      );
      break;
    }
  }

  return state;
}
