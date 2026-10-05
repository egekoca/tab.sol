"use client";

import { useLang } from "@/lib/i18n";

export interface FeedEvent {
  id: string;
  key: string;
  params: Record<string, string | number>;
  tone: "info" | "success" | "danger";
}

const toneDot: Record<FeedEvent["tone"], string> = {
  info: "bg-cloud/50",
  success: "bg-emerald-400",
  danger: "bg-cherry",
};

export function EventFeed({ events }: { events: FeedEvent[] }) {
  const { tEvent } = useLang();

  return (
    <ul className="space-y-3">
      {events.map((e) => {
        const { label, detail } = tEvent(e.key, e.params);
        return (
          <li key={e.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${toneDot[e.tone]}`} />
            <div>
              <p className="text-base font-medium text-cloud">{label}</p>
              <p className="mt-0.5 text-sm text-cloud/50">{detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
