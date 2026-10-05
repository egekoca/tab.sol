/**
 * Tab programının on-chain hesap şekilleriyle bire bir eşleşen TS tipleri.
 * Kaynak: apps/program/programs/tab/src/state.rs — docs §9.1.
 * Tutarları USDC base unit (6 ondalık) cinsinden tutun.
 */

export type AgentStatus = "Active" | "Frozen" | "Defaulted";
export type MerchantStatus = "Pending" | "Approved" | "Slashed";

export interface Pool {
  authority: string;
  usdcMint: string;
  vault: string;
  shareMint: string;
  totalAssets: bigint;
  totalBorrowed: bigint;
  totalOpenExposure: bigint;
  protocolFeeBps: number;
  seniorShareBps: number;
  juniorShareBps: number;
  maxUtilizationBps: number;
}

export interface AgentCredit {
  operator: string;
  agentSigner: string;
  bond: bigint;
  backerStake: bigint;
  multiplierBps: number;
  score: number;
  debt: bigint;
  openExposure: bigint;
  dueAt: number;
  status: AgentStatus;
  dailyLimit: bigint;
}

export interface Merchant {
  payee: string;
  bond: bigint;
  exposureCap: bigint;
  currentExposure: bigint;
  mdrBps: number;
  settleSlaSecs: number;
  status: MerchantStatus;
}

export interface CreditChannel {
  channel: string;
  agent: string;
  merchant: string;
  deposit: bigint;
  lastSeenSettled: bigint;
  open: boolean;
}

/** limit = bond * multiplier(score) + backerStake — bkz. docs §10.1 */
export function creditLimit(agent: Pick<AgentCredit, "bond" | "multiplierBps" | "backerStake">): bigint {
  return (agent.bond * BigInt(agent.multiplierBps)) / 10_000n + agent.backerStake;
}
