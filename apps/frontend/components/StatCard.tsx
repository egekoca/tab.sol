interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm font-medium uppercase tracking-wide text-cloud/60">{label}</p>
      <p className="mt-2 text-4xl font-semibold text-cloud">{value}</p>
      {hint && <p className="mt-1.5 text-sm text-cloud/45">{hint}</p>}
    </div>
  );
}
