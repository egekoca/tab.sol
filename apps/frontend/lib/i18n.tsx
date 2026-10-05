"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "tr" | "en";

type Dict = Record<string, string>;

const tr: Dict = {
  tagline: "AI ajanları için payment channel tabanlı kredi protokolü",
  heroSubtitle:
    "Para sadece onaylı merchant'lara akar · harcanmayan kısım otomatik olarak LP'lere geri döner · ajan ele geçirilse bile kredi çalınamaz.",

  "nav.problem": "Problem",
  "nav.solution": "Çözüm",
  "nav.demo": "Demo",
  "nav.cta": "Demoyu Aç",

  "hero.titleLine1": "Your agent runs a tab.",
  "hero.titleLine2": "LPs earn the yield.",
  "hero.scroll": "Kaydır",

  "orbit.payer": "Havuz",
  "orbit.signer": "Ajan",
  "orbit.payee": "Merchant",

  "problem.eyebrow": "Problem",
  "problem.headlineLine1": "Sermaye",
  "problem.headlineLine2": "kilitleniyor.",
  "problem.p1.title": "Her merchant için ayrı kilit",
  "problem.p1.desc": "Ajan 10 API kullanıyorsa 10 ayrı kilitli bakiye açmak zorunda.",
  "problem.p2.title": "Ön fonlama zorunlu",
  "problem.p2.desc": "Harcamadan önce nakit bulmalı — gelir sonra gelir, gider önce.",
  "problem.p3.title": "Yield yok, kredi yok",
  "problem.p3.desc": "Kilitli paraya ne faiz işler ne de kredi imkanı tanınır.",

  "solution.eyebrow": "Çözüm",
  "solution.headlineLine1": "Çalınamaz",
  "solution.headlineLine2": "kredi.",
  "solution.advanceLabel": "Rakip Model",
  "solution.advanceSubtitle": "Ajana nakit verir",
  "solution.advance1": "Para karta/cüzdana gider — geniş erişim",
  "solution.advance2": "Ele geçirilirse para her yere gidebilir",
  "solution.advance3": "Harcanmayan kısım ajanda kalır",
  "solution.tabLabel": "Tab",
  "solution.tabSubtitle": "Ajana hesap açar",
  "solution.tab1": "Para sadece onaylı merchant'a akabilir",
  "solution.tab2": "Ele geçirilse bile kredi çalınamaz",
  "solution.tab3": "Harcanmayan kısım otomatik LP'ye döner",
  "solution.footnote": "“Advance gives agents cash. Tab gives agents a tab.”",

  "demo.eyebrow": "Canlı Demo",
  "demo.headlineLine1": "Tıkla,",
  "demo.headlineLine2": "akışı izle.",
  "demo.subtitle":
    "Aşağıdaki adımlar gerçek program mantığını simüle eder — LP yatırımından temerrüt senaryosuna kadar.",

  "footer.tagline": "Solana Payment Channels üzerinde kredi protokolü",

  statPoolTvl: "Havuz TVL",
  statPoolTvlHint: "tUSDC",
  statExposure: "Açık Maruziyet",
  statExposureHintOpen: "1 aktif kanal",
  statExposureHintClosed: "0 aktif kanal",
  statLimit: "Ajan Limiti",
  statScore: "Protokol Skoru",

  statusNone: "kayıtsız",
  statusActive: "Active",
  statusDefaulted: "Defaulted",

  panelAgent: "Ajan Durumu",
  fieldStatus: "Durum",
  fieldBond: "Bond",
  fieldDebt: "Açık Borç",
  fieldWallet: "Cüzdan Bakiyesi",

  panelChannel: "Kanal Durumu",
  fieldDeposit: "Deposit",
  fieldSettled: "Settled",
  channelOpen: "Open",
  channelClosed: "Closed",

  panelEvents: "Olay Akışı",
  eventsEmpty: "Henüz olay yok — demoyu başlatmak için aşağıdaki adımları kullanın.",

  panelControls: "Demo Kontrolü",
  reset: "Sıfırla",
  progress: "adım tamamlandı",

  sectionSetupTitle: "1 · Kurulum",
  sectionSetupDesc: "Havuzu fonla, ajanı kaydet, krediyi aç.",
  sectionUsageTitle: "2 · Kullanım",
  sectionUsageDesc: "Ajan sıfır bakiyeyle harcar, kanal kapanır, iade döner.",
  sectionRiskTitle: "3 · Risk ve Güvenlik",
  sectionRiskDesc: "Kötü ajan temerrüde düşerse ve saldırı denenirse ne olur.",

  step1Label: "LP yatırır",
  step1Desc: "$1.000 USDC → havuz TVL artar",
  step2Label: "Ajanı kaydet",
  step2Desc: "$50 bond → $50 limit (1.0x)",
  step3Label: "Kanal aç",
  step3Desc: "$5 tavan · payer = Pool PDA",
  step4Label: "Ajan tüketir",
  step4Desc: "Sıfır bakiyeyle inference ödemesi",
  step5Label: "Settle + kapat",
  step5Desc: "AHA: harcanmayan kısım havuza döner",
  step6Label: "Geri öde",
  step6Desc: "Borç kapanır, skor ve LP yield artar",
  step7Label: "Kötü ajan tüketir",
  step7Desc: "Öder gibi görünür ama ödemez",
  step8Label: "Temerrüt + slash",
  step8Desc: "Vade geçer, bond slash edilir, LP zararsız",
  step9Label: "Saldırı denemesi",
  step9Desc: "Allowlist dışı merchant'a kanal → RED",

  "event.reset": "Demo sıfırlandı||Tüm durum başlangıç değerlerine döndü",
  "event.lpDeposit": "LP ${amount} USDC yatırdı||tUSDC mint edildi · havuz TVL güncellendi",
  "event.registerAgent": "Operatör ajanı kaydetti||bond ${bond} → limit ${limit} (1.0x) · cüzdan bakiyesi $0",
  "event.openChannel": "Kredili kanal açıldı||tavan ${ceiling} · payer = Pool PDA · signer = Ajan · payee = Merchant",
  "event.consume": "Ajan inference ödemesi yaptı||tüketilen: ${consumed} / ${deposit}",
  "event.settleClose": "Kanal kapandı, iade havuza döndü||${settled} merchant'a · ${refund} havuza geri — AHA anı",
  "event.repay": "Operatör borcu ödedi||${amount} repay · LP share fiyatı artar · skor +50",
  "event.badAgentConsume": "İkinci ajan tüketti, ödemedi||${debt} borç · vade + grace dolmak üzere",
  "event.markDefault": "mark_default tetiklendi||vade + grace geçti · kanallar kapatıldı · ${slashed} operatör bond'u slash edildi · LP zararsız",
  "event.blockedAttack": "Allowlist dışı kanal denemesi reddedildi||RED: merchant allowlist'te değil — para asla ajan cüzdanına ulaşmadı",
};

const en: Dict = {
  tagline: "A payment-channel-native credit protocol for AI agents",
  heroSubtitle:
    "Funds can only flow to approved merchants · unspent credit auto-returns to LPs · credit can't be stolen even if the agent is compromised.",

  "nav.problem": "Problem",
  "nav.solution": "Solution",
  "nav.demo": "Demo",
  "nav.cta": "Enter Demo",

  "hero.titleLine1": "Your agent runs a tab.",
  "hero.titleLine2": "LPs earn the yield.",
  "hero.scroll": "Scroll",

  "orbit.payer": "Pool",
  "orbit.signer": "Agent",
  "orbit.payee": "Merchant",

  "problem.eyebrow": "Problem",
  "problem.headlineLine1": "Capital",
  "problem.headlineLine2": "gets locked.",
  "problem.p1.title": "A separate lock per merchant",
  "problem.p1.desc": "An agent using 10 APIs has to lock 10 separate balances.",
  "problem.p2.title": "Pre-funding required",
  "problem.p2.desc": "Cash has to be found before spending — revenue comes later, cost comes first.",
  "problem.p3.title": "No yield, no credit",
  "problem.p3.desc": "Locked funds earn no interest and unlock no credit.",

  "solution.eyebrow": "Solution",
  "solution.headlineLine1": "Credit that",
  "solution.headlineLine2": "can't be stolen.",
  "solution.advanceLabel": "Competing model",
  "solution.advanceSubtitle": "Gives the agent cash",
  "solution.advance1": "Funds land on a card/wallet — broad reach",
  "solution.advance2": "If compromised, funds can go anywhere",
  "solution.advance3": "Unspent balance stays with the agent",
  "solution.tabLabel": "Tab",
  "solution.tabSubtitle": "Gives the agent a tab",
  "solution.tab1": "Funds can only flow to an approved merchant",
  "solution.tab2": "Credit can't be stolen, even if compromised",
  "solution.tab3": "Unspent balance auto-returns to LPs",
  "solution.footnote": "“Advance gives agents cash. Tab gives agents a tab.”",

  "demo.eyebrow": "Live Demo",
  "demo.headlineLine1": "Click through,",
  "demo.headlineLine2": "watch it flow.",
  "demo.subtitle": "The steps below simulate the real program logic — from an LP deposit to a default scenario.",

  "footer.tagline": "A credit protocol on Solana Payment Channels",

  statPoolTvl: "Pool TVL",
  statPoolTvlHint: "tUSDC",
  statExposure: "Open Exposure",
  statExposureHintOpen: "1 active channel",
  statExposureHintClosed: "0 active channels",
  statLimit: "Agent Limit",
  statScore: "Protocol Score",

  statusNone: "unregistered",
  statusActive: "Active",
  statusDefaulted: "Defaulted",

  panelAgent: "Agent Status",
  fieldStatus: "Status",
  fieldBond: "Bond",
  fieldDebt: "Outstanding Debt",
  fieldWallet: "Wallet Balance",

  panelChannel: "Channel Status",
  fieldDeposit: "Deposit",
  fieldSettled: "Settled",
  channelOpen: "Open",
  channelClosed: "Closed",

  panelEvents: "Event Feed",
  eventsEmpty: "No events yet — use the steps below to start the demo.",

  panelControls: "Demo Controls",
  reset: "Reset",
  progress: "steps completed",

  sectionSetupTitle: "1 · Setup",
  sectionSetupDesc: "Fund the pool, register the agent, open credit.",
  sectionUsageTitle: "2 · Usage",
  sectionUsageDesc: "Agent spends with a zero balance, channel closes, refund returns.",
  sectionRiskTitle: "3 · Risk & Security",
  sectionRiskDesc: "What happens when a bad agent defaults, or an attack is attempted.",

  step1Label: "LP deposits",
  step1Desc: "$1,000 USDC → pool TVL increases",
  step2Label: "Register agent",
  step2Desc: "$50 bond → $50 limit (1.0x)",
  step3Label: "Open channel",
  step3Desc: "$5 ceiling · payer = Pool PDA",
  step4Label: "Agent spends",
  step4Desc: "Pays for inference with a zero balance",
  step5Label: "Settle + close",
  step5Desc: "AHA: unspent balance returns to the pool",
  step6Label: "Repay",
  step6Desc: "Debt clears, score and LP yield go up",
  step7Label: "Bad agent spends",
  step7Desc: "Looks like it'll pay, but doesn't",
  step8Label: "Default + slash",
  step8Desc: "Due date passes, bond is slashed, LPs stay whole",
  step9Label: "Attack attempt",
  step9Desc: "Channel to a non-allowlisted merchant → DENIED",

  "event.reset": "Demo reset||All state returned to its initial values",
  "event.lpDeposit": "LP deposited $${amount} USDC||tUSDC minted · pool TVL updated",
  "event.registerAgent": "Operator registered the agent||bond $${bond} → limit $${limit} (1.0x) · wallet balance $0",
  "event.openChannel": "Credit channel opened||ceiling $${ceiling} · payer = Pool PDA · signer = Agent · payee = Merchant",
  "event.consume": "Agent paid for inference||consumed: $${consumed} / $${deposit}",
  "event.settleClose": "Channel closed, refund returned to pool||$${settled} to merchant · $${refund} back to pool — the AHA moment",
  "event.repay": "Operator repaid the debt||$${amount} repaid · LP share price rises · score +50",
  "event.badAgentConsume": "Second agent spent, didn't pay||$${debt} debt · due date + grace period closing in",
  "event.markDefault": "mark_default triggered||due date + grace elapsed · channels closed · $${slashed} of operator bond slashed · LPs unharmed",
  "event.blockedAttack": "Non-allowlisted channel attempt denied||DENIED: merchant not on allowlist — funds never reached the agent's wallet",
};

const dicts: Record<Lang, Dict> = { tr, en };

function interpolate(template: string, params: Record<string, string | number>) {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  tEvent: (key: string, params: Record<string, string | number>) => { label: string; detail: string };
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tab-lang");
      if (saved === "tr" || saved === "en") setLangState(saved);
    } catch {
      // localStorage unavailable — stick with default
    }
  }, []);

  useEffect(() => {
    // `lang="tr"` makes CSS `uppercase` apply Turkish dotted-I rules even to
    // English text (e.g. "Limit" -> "LİMİT") — keep it in sync with the
    // active language so uppercase labels render correctly in both.
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem("tab-lang", l);
    } catch {
      // ignore
    }
  }

  function t(key: string): string {
    return dicts[lang][key] ?? key;
  }

  function tEvent(key: string, params: Record<string, string | number>) {
    const raw = dicts[lang][key] ?? `${key}||`;
    const [label, detail] = raw.split("||");
    return { label: interpolate(label ?? "", params), detail: interpolate(detail ?? "", params) };
  }

  return <LangContext.Provider value={{ lang, setLang, t, tEvent }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
