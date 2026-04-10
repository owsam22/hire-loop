import clsx from 'clsx';

export default function StatCard({ label, value, icon, trend, trendLabel, color = 'indigo' }) {
  const bgColors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          {trendLabel && (
            <p className={clsx(
              'text-xs font-medium mt-1 flex items-center gap-1',
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400'
            )}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendLabel}
            </p>
          )}
        </div>
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0', bgColors[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
