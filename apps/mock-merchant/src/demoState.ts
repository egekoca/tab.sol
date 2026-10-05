/**
 * Demo engine (doc §15 Demo Senaryosu): instead of the real chain, a
 * reliable simulated state machine for demo day. Plan B (§6.2): until the
 * real Payment Channels CPI is wired up, mimic the same interface so the
 * demo stays smooth.
 *
 * Events carry an i18n key + params instead of rendered text — the
 * frontend renders them in whichever language the presenter picked.
 */

export type EventTone = "info" | "success" | "danger";

export interface DemoEvent {
  id: string;
  key: string;
  params: Record<string, string | number>;
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

function pushEvent(key: string, params: Record<string, string | number>, tone: EventTone) {
  state.events = [
    { id: crypto.randomUUID(), key, params, tone, at: Date.now() },
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
      pushEvent("event.reset", {}, "info");
      break;
    }

    case "lp_deposit": {
      state.pool.tvl = USDC(state.pool.tvl + 1000);
      pushEvent("event.lpDeposit", { amount: "1,000" }, "info");
      break;
    }

    case "register_agent": {
      state.agent.bond = 50;
      state.agent.limit = 50; // bond × 1.0x (new-agent multiplier)
      state.agent.status = "Active";
      state.agent.score = 0;
      pushEvent("event.registerAgent", { bond: 50, limit: 50 }, "info");
      break;
    }

    case "open_channel": {
      if (state.agent.status !== "Active") break;
      state.channel = { deposit: 5, settled: 0, open: true };
      state.pool.openExposure = USDC(state.pool.openExposure + 5);
      pushEvent("event.openChannel", { ceiling: 5 }, "info");
      break;
    }

    case "consume": {
      if (!state.channel.open) break;
      const next = Math.min(state.channel.deposit, USDC(state.channel.settled + 0.7));
      state.channel.settled = next;
      pushEvent("event.consume", { consumed: next.toFixed(2), deposit: state.channel.deposit.toFixed(2) }, "info");
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
      pushEvent("event.settleClose", { settled: settled.toFixed(2), refund: refund.toFixed(2) }, "success");
      break;
    }

    case "repay": {
      if (state.agent.debt === 0) break;
      const amount = state.agent.debt;
      state.agent.debt = 0;
      state.agent.score = Math.min(1000, state.agent.score + 50);
      pushEvent("event.repay", { amount: amount.toFixed(2) }, "success");
      break;
    }

    case "bad_agent_consume": {
      state.channel = { deposit: 5, settled: 5, open: true };
      state.agent.debt = USDC(state.agent.debt + 5);
      state.pool.openExposure = USDC(state.pool.openExposure + 5);
      pushEvent("event.badAgentConsume", { debt: "5.00" }, "info");
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
      pushEvent("event.markDefault", { slashed: fromBond.toFixed(2) }, "danger");
      break;
    }

    case "blocked_attack": {
      pushEvent("event.blockedAttack", {}, "danger");
      break;
    }
  }

  return state;
}
