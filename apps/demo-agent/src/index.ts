/**
 * Demo ajanı (§15 Demo Senaryosu): sıfır cüzdan bakiyesiyle, Tab'ın açtığı
 * kredili kanal üzerinden mock-merchant'a inference ödemesi yapar.
 *
 * Akış:
 *   1. Tab programında open_credit_channel çağrılmış olmalı (operatör/keeper).
 *   2. Ajan, pay-kit ile her istekte kümülatif imzalı voucher üretir.
 *   3. mock-merchant'a POST /v1/inference/summarize ile istek atar.
 *
 * TODO: pay-kit entegrasyonu + gerçek authorizedSigner imzası.
 */

const MERCHANT_URL = process.env.TAB_MERCHANT_URL ?? "http://localhost:4001";

async function run() {
  const channelId = process.env.TAB_DEMO_CHANNEL_ID ?? "demo-channel";
  const articles = [
    "Solana Payment Channels tanıtıldı...",
    "AI ajanları artık API'lere kendileri ödüyor...",
  ];

  let cumulative = 0n;
  for (const text of articles) {
    cumulative += 140_000n; // mock: $0.14 (6 ondalık USDC)

    const res = await fetch(`${MERCHANT_URL}/v1/inference/summarize`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        channelId,
        voucherAmount: cumulative.toString(),
        text,
      }),
    });

    const body = await res.json();
    console.log(`[agent] tüketilen: $${Number(cumulative) / 1e6} →`, body);
  }
}

run().catch((err) => {
  console.error("[agent] hata", err);
  process.exit(1);
});
