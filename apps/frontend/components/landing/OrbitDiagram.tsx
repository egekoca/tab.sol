"use client";

import Image from "next/image";
import { Lock, Bot, Store } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface Node {
  key: "payer" | "signer" | "payee";
  icon: typeof Lock;
  top: string;
  left: string;
}

const nodes: Node[] = [
  { key: "payer", icon: Lock, top: "6%", left: "18%" },
  { key: "signer", icon: Bot, top: "10%", left: "78%" },
  { key: "payee", icon: Store, top: "82%", left: "14%" },
];

export function OrbitDiagram() {
  const { t } = useLang();

  return (
    <div className="relative mx-auto h-[280px] w-[280px] sm:h-[340px] sm:w-[340px]">
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-[10%] rounded-full border border-dashed border-cherry-bright/40" />

      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-cherry shadow-[0_0_60px_-10px_rgba(224,69,95,0.6)] sm:h-24 sm:w-24">
        <Image
          src="/brand/tab-wordmark-white.svg"
          alt="tab."
          width={56}
          height={24}
          className="absolute left-1/2 top-1/2 h-auto w-12 -translate-x-1/2 -translate-y-1/2 sm:w-14"
        />
      </div>

      {nodes.map(({ key, icon: Icon, top, left }) => (
        <div key={key} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top, left }}>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cherry-bright/50 bg-obsidian shadow-[0_0_24px_-6px_rgba(224,69,95,0.5)] sm:h-12 sm:w-12">
            <Icon className="h-4 w-4 text-cherry-bright sm:h-5 sm:w-5" strokeWidth={1.75} />
          </div>
          <p className="mt-1.5 whitespace-nowrap text-center font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/50">
            {t(`orbit.${key}`)}
          </p>
        </div>
      ))}
    </div>
  );
}
