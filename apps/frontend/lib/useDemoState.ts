"use client";

import { useEffect, useState } from "react";

const MERCHANT_URL = process.env.NEXT_PUBLIC_TAB_MERCHANT_URL ?? "http://localhost:4001";

export interface DemoEvent {
  id: string;
  label: string;
  detail: string;
  tone: "info" | "success" | "danger";
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

const EMPTY_STATE: DemoState = {
  pool: { tvl: 0, openExposure: 0 },
  agent: { bond: 0, limit: 0, debt: 0, score: 0, status: "none" },
  channel: { deposit: 0, settled: 0, open: false },
  events: [],
};

export function useDemoState(pollMs = 1000) {
  const [state, setState] = useState<DemoState>(EMPTY_STATE);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`${MERCHANT_URL}/v1/demo/state`, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data: DemoState = await res.json();
        if (!cancelled) {
          setState(data);
          setConnected(true);
        }
      } catch {
        if (!cancelled) setConnected(false);
      }
    }

    poll();
    const interval = setInterval(poll, pollMs);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pollMs]);

  async function dispatch(action: string) {
    await fetch(`${MERCHANT_URL}/v1/demo/action`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
  }

  return { state, connected, dispatch };
}
