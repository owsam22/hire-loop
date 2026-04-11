import clsx from 'clsx';

export default function StatCard({ label, value, icon, trend, trendLabel, color = 'indigo' }) {
  return (
    <div className="card card-hover stat-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="stat-value">{value}</p>
          {trendLabel && (
            <p className={clsx(
              'stat-trend',
              trend === 'up' && 'text-emerald',
              trend === 'down' && 'text-red'
            )}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendLabel}
            </p>
          )}
        </div>
        <div className={clsx('stat-icon', `bg-${color}`)}>
          {icon}
        </div>
      </div>
      
      <style>{`
        .stat-card { padding: 1.25rem; }
        .stat-value { font-size: 1.875rem; font-weight: 800; color: var(--slate-800); margin-top: 0.25rem; }
        .stat-trend { font-size: 0.75rem; font-weight: 600; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.25rem; }
        .stat-icon { width: 44px; height: 44px; border-radius: var(--rounded-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .bg-indigo { background: var(--primary-light); color: var(--primary); }
        .bg-emerald { background: #d1fae5; color: #059669; }
        .bg-amber { background: #fef3c7; color: #d97706; }
        .bg-blue { background: #dbeafe; color: #2563eb; }
        .bg-purple { background: #f3e8ff; color: #9333ea; }
        .bg-red { background: #fee2e2; color: #dc2626; }
        .text-emerald { color: #059669; }
      `}</style>
    </div>
  );
}
