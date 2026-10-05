"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

require("@solana/wallet-adapter-react-ui/styles.css");

const RPC_URL = process.env.NEXT_PUBLIC_TAB_RPC_URL ?? "http://127.0.0.1:8899";

/**
 * Cüzdan bağlantısı. `wallets` boş bırakıldı — Wallet Standard uyumlu
 * cüzdanlar (Phantom, Backpack, Solflare vb.) otomatik algılanır.
 */
export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
