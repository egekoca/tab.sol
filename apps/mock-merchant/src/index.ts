import express from "express";
import type { DemoAction } from "./demoState.js";
import { applyAction, getState } from "./demoState.js";

/**
 * Mock merchant: paralı inference proxy (§7.1, §15 demo adım 4-7) + demo
 * motoru API'si. Gün 2 Plan B (§6.2): gerçek Payment Channels CPI'si
 * tamamlanana kadar demo bu simüle edilmiş durum üzerinden akıcı çalışır.
 * pay-kit'in high-throughput proxy şablonu temel alınacak:
 * https://solana.com/developers/templates/pay-high-throughput-proxy
 *
 * Akış: ajan her istekte kümülatif imzalı voucher gönderir (§8.5). Bu
 * merchant voucher'ı doğrular, isteği "işler" (burada mock), watermark
 * eşiğini (>%50) veya zaman SLA'sını (6 saat, §10.3) geçince Payment
 * Channels'a `settle` çağırır.
 */
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const PORT = process.env.PORT ?? 4001;

interface ChannelState {
  deposit: bigint;
  cumulativeVoucher: bigint;
}

const channels = new Map<string, ChannelState>();

app.post("/v1/inference/summarize", (req, res) => {
  const { channelId, voucherAmount, text } = req.body as {
    channelId: string;
    voucherAmount: string;
    text: string;
  };

  if (!channelId || !voucherAmount) {
    return res.status(400).json({ error: "channelId ve voucherAmount zorunlu" });
  }

  // TODO: pay-kit ile voucher imzasını (authorizedSigner) doğrula.
  const state = channels.get(channelId) ?? { deposit: 0n, cumulativeVoucher: 0n };
  state.cumulativeVoucher = BigInt(voucherAmount);
  channels.set(channelId, state);

  // TODO: watermark > %50 veya 6 saat SLA dolunca PC `settle` CPI'sini tetikle.

  res.json({
    summary: `(mock) ${(text ?? "").slice(0, 80)}...`,
    channelId,
    settledSoFar: state.cumulativeVoucher.toString(),
  });
});

app.get("/healthz", (_req, res) => res.json({ ok: true }));

const DEMO_ACTIONS: DemoAction[] = [
  "reset",
  "lp_deposit",
  "register_agent",
  "open_channel",
  "consume",
  "settle_close",
  "repay",
  "bad_agent_consume",
  "bad_agent_default",
  "blocked_attack",
];

app.get("/v1/demo/state", (_req, res) => {
  res.json(getState());
});

app.post("/v1/demo/action", (req, res) => {
  const { action } = req.body as { action?: string };
  if (!action || !DEMO_ACTIONS.includes(action as DemoAction)) {
    return res.status(400).json({ error: `geçersiz action. Beklenen: ${DEMO_ACTIONS.join(", ")}` });
  }
  const state = applyAction(action as DemoAction);
  res.json(state);
});

app.listen(PORT, () => {
  console.log(`[mock-merchant] dinleniyor: http://localhost:${PORT}`);
});
