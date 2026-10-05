// Kaynak: docs/Tab_Proje_Dokumani.md §1.4, §10.3

export const PAYMENT_CHANNELS_PROGRAM_ID = "CHNLxYvVA28MJP9PrFuDXccuoGXAx7jBacfLEkahyGsX";

export const DEFAULT_PARAMS = {
  ceilingIncrementUsd: 5,
  dueDays: 7,
  graceHours: 48,
  maxUtilizationBps: 8_000,
  newAgentMultiplierBps: 10_000,
  maxMultiplierBps: 30_000,
  merchantSettleSlaHours: 6,
  backerCooldownDays: 7,
} as const;

export const BRAND = {
  darkCherry: "#6B1D2C",
  obsidian: "#0E0E10",
  cloud: "#F5F5F7",
} as const;
