import cron from "node-cron";
import { recordSettlements } from "./jobs/recordSettlements.js";
import { checkTopUps } from "./jobs/topUp.js";
import { checkDefaults } from "./jobs/markDefault.js";

// Keeper cron servisi (§7.1): settle takibi, top-up, vade/default kontrolü.
async function tick() {
  await recordSettlements();
  await checkTopUps();
  await checkDefaults();
}

cron.schedule("*/30 * * * * *", () => {
  tick().catch((err) => console.error("[keeper] tick hatası", err));
});

console.log("[keeper] Tab keeper servisi başladı — 30sn aralıkla tarama yapılıyor");
tick().catch((err) => console.error("[keeper] ilk tick hatası", err));
