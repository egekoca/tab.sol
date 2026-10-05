/**
 * §8.7 — now > due_at + grace olan AgentCredit hesaplarını tespit edip
 * `mark_default` çağırır: açık kanallar kapatılır, slash waterfall
 * (operatör bond → backer stake → senior LP) tetiklenir.
 */
export async function checkDefaults(): Promise<void> {
  console.log("[keeper] default taraması çalıştı (stub)");
}
