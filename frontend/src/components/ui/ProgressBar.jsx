export default function ProgressBar({ value = 0, max = 100, color = 'indigo', size = 'md', showLabel = false, label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-indigo-500 to-violet-500',
  };

  const heights = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-slate-500">{label}</span>
          <span className="text-xs font-semibold text-slate-700">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
