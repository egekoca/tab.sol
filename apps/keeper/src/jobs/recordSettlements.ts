/**
 * §8.5 — açık her CreditChannel için Payment Channels kanalının `settled`
 * alanını okur ve Tab programının `record_settlement` instruction'ını
 * permissionless olarak çağırır.
 *
 * TODO: Tab programı IDL'i hazır olunca Anchor Program istemcisiyle
 * gerçek hesap taraması + ix çağrısı eklenecek.
 */
export async function recordSettlements(): Promise<void> {
  console.log("[keeper] record_settlement taraması çalıştı (stub)");
}
