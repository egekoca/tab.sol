interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-wide text-cloud/50">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-cloud">{value}</p>
      {hint && <p className="mt-1 text-xs text-cloud/40">{hint}</p>}
    </div>
  );
}
