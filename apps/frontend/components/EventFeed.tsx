export interface FeedEvent {
  id: string;
  label: string;
  detail: string;
  tone: "info" | "success" | "danger";
}

const toneDot: Record<FeedEvent["tone"], string> = {
  info: "bg-cloud/50",
  success: "bg-emerald-400",
  danger: "bg-cherry",
};

export function EventFeed({ events }: { events: FeedEvent[] }) {
  return (
    <ul className="space-y-3">
      {events.map((e) => (
        <li key={e.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot[e.tone]}`} />
          <div>
            <p className="text-sm text-cloud">{e.label}</p>
            <p className="text-xs text-cloud/40">{e.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
