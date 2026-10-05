import express from "express";

/**
 * Mock merchant: paralı inference proxy (§7.1, §15 demo adım 4-7).
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

app.listen(PORT, () => {
  console.log(`[mock-merchant] dinleniyor: http://localhost:${PORT}`);
});
