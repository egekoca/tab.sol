import { Connection, Keypair } from "@solana/web3.js";
import fs from "node:fs";

const RPC_URL = process.env.TAB_RPC_URL ?? "http://127.0.0.1:8899";
const KEEPER_KEYPAIR_PATH = process.env.TAB_KEEPER_KEYPAIR ?? `${process.env.HOME}/.config/solana/id.json`;

export const connection = new Connection(RPC_URL, "confirmed");

export function loadKeeperKeypair(): Keypair {
  const raw = JSON.parse(fs.readFileSync(KEEPER_KEYPAIR_PATH, "utf-8"));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}
