/**
 * Demo engine (doc §15 Demo Senaryosu): a pure, framework-agnostic state
 * machine that mimics the full Tab credit flow without needing a real
 * chain. Plan B (§6.2) — until the real Payment Channels CPI lands, this
 * keeps the demo smooth and deterministic.
 *
 * Pure reducer: (state, action) -> state. Used two ways in this repo:
 *   - apps/mock-merchant wraps it with a mutable module-level state + REST
 *     API, for local multi-process demos (agent CLI hitting a real server).
 *   - apps/frontend uses it directly inside a React useReducer, so the
 *     publicly deployed dashboard works standalone with no backend.
 *
 * Events carry an i18n key + params instead of rendered text so either
 * consumer can render them in whichever language the presenter picked.
 */

export type EventTone = "info" | "success" | "danger";

export interface DemoEvent {
  id: string;
  key: string;
  params: Record<string, string | number>;
  tone: EventTone;
  at: number;
}

export type DemoAgentStatus = "none" | "Active" | "Defaulted";

export interface DemoState {
  pool: { tvl: number; openExposure: number };
  agent: {
    bond: number;
    limit: number;
    debt: number;
    score: number;
    status: DemoAgentStatus;
  };
  channel: { deposit: number; settled: number; open: boolean };
  events: DemoEvent[];
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

const round2 = (n: number) => Math.round(n * 1_000_000) / 1_000_000;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function initialDemoState(): DemoState {
  return {
    pool: { tvl: 0, openExposure: 0 },
    agent: { bond: 0, limit: 0, debt: 0, score: 0, status: "none" },
    channel: { deposit: 0, settled: 0, open: false },
    events: [],
  };
}

function withEvent(state: DemoState, key: string, params: Record<string, string | number>, tone: EventTone): DemoState {
  const event: DemoEvent = { id: newId(), key, params, tone, at: Date.now() };
  return { ...state, events: [event, ...state.events].slice(0, 30) };
}

/** Pure reducer — never mutates the input state. */
export function applyDemoAction(prev: DemoState, action: DemoAction): DemoState {
  switch (action) {
    case "reset": {
      return withEvent(initialDemoState(), "event.reset", {}, "info");
    }

    case "lp_deposit": {
      const next: DemoState = { ...prev, pool: { ...prev.pool, tvl: round2(prev.pool.tvl + 1000) } };
      return withEvent(next, "event.lpDeposit", { amount: "1,000" }, "info");
    }

    case "register_agent": {
      const next: DemoState = {
        ...prev,
        agent: { ...prev.agent, bond: 50, limit: 50, status: "Active", score: 0 },
      };
      return withEvent(next, "event.registerAgent", { bond: 50, limit: 50 }, "info");
    }

    case "open_channel": {
      if (prev.agent.status !== "Active") return prev;
      const next: DemoState = {
        ...prev,
        channel: { deposit: 5, settled: 0, open: true },
        pool: { ...prev.pool, openExposure: round2(prev.pool.openExposure + 5) },
      };
      return withEvent(next, "event.openChannel", { ceiling: 5 }, "info");
    }

    case "consume": {
      if (!prev.channel.open) return prev;
      const settled = Math.min(prev.channel.deposit, round2(prev.channel.settled + 0.7));
      const next: DemoState = { ...prev, channel: { ...prev.channel, settled } };
      return withEvent(
        next,
        "event.consume",
        { consumed: settled.toFixed(2), deposit: prev.channel.deposit.toFixed(2) },
        "info"
      );
    }

    case "settle_close": {
      if (!prev.channel.open) return prev;
      const settled = prev.channel.settled;
      const refund = round2(prev.channel.deposit - settled);
      const next: DemoState = {
        ...prev,
        pool: {
          tvl: round2(prev.pool.tvl + refund),
          openExposure: round2(prev.pool.openExposure - prev.channel.deposit),
        },
        agent: { ...prev.agent, debt: round2(prev.agent.debt + settled) },
        channel: { ...prev.channel, open: false },
      };
      return withEvent(next, "event.settleClose", { settled: settled.toFixed(2), refund: refund.toFixed(2) }, "success");
    }

    case "repay": {
      if (prev.agent.debt === 0) return prev;
      const amount = prev.agent.debt;
      const next: DemoState = {
        ...prev,
        agent: { ...prev.agent, debt: 0, score: Math.min(1000, prev.agent.score + 50) },
      };
      return withEvent(next, "event.repay", { amount: amount.toFixed(2) }, "success");
    }

    case "bad_agent_consume": {
      const next: DemoState = {
        ...prev,
        channel: { deposit: 5, settled: 5, open: true },
        agent: { ...prev.agent, debt: round2(prev.agent.debt + 5) },
        pool: { ...prev.pool, openExposure: round2(prev.pool.openExposure + 5) },
      };
      return withEvent(next, "event.badAgentConsume", { debt: "5.00" }, "info");
    }

    case "bad_agent_default": {
      const loss = prev.agent.debt;
      const fromBond = Math.min(loss, prev.agent.bond);
      const next: DemoState = {
        ...prev,
        agent: { ...prev.agent, bond: round2(prev.agent.bond - fromBond), debt: 0, status: "Defaulted", score: 0 },
        channel: { ...prev.channel, open: false },
        pool: { ...prev.pool, openExposure: round2(Math.max(0, prev.pool.openExposure - 5)) },
      };
      return withEvent(next, "event.markDefault", { slashed: fromBond.toFixed(2) }, "danger");
    }

    case "blocked_attack": {
      return withEvent(prev, "event.blockedAttack", {}, "danger");
    }

    default:
      return prev;
  }
}
