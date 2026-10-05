/**
 * §8.6 — settled, ceiling'e yaklaştıysa (watermark > %50) ve borç limitin
 * altındaysa `top_up_credit_channel` çağırarak kanalı küçük artımlarla
 * (varsayılan $5, bkz. §10.3) revolving şekilde besler.
 */
export async function checkTopUps(): Promise<void> {
  console.log("[keeper] top-up taraması çalıştı (stub)");
}
