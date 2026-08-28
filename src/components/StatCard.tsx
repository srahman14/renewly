interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-line bg-white px-4 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-medium tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}