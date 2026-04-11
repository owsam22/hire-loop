import clsx from 'clsx';

export default function ProgressBar({ value = 0, max = 100, color = 'indigo', size = 'md', showLabel = false, label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="progress-container">
      {(showLabel || label) && (
        <div className="progress-header">
          <span className="text-xs text-slate-500">{label}</span>
          <span className="text-xs font-semibold text-slate-700">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={clsx('progress-track', `track-${size}`)}>
        <div
          className={clsx('progress-bar', `bar-${color}`, `bar-${size}`)}
          style={{ width: `${pct}%` }}
        />
      </div>

      <style>{`
        .progress-container { width: 100%; }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 0.375rem; }
        .progress-track { width: 100%; background: var(--slate-100); border-radius: var(--rounded-full); overflow: hidden; }
        .progress-bar { transition: width 0.7s ease-out; border-radius: var(--rounded-full); }
        
        .track-xs { height: 4px; }
        .track-sm { height: 6px; }
        .track-md { height: 8px; }
        .track-lg { height: 12px; }

        .bar-xs { height: 4px; }
        .bar-sm { height: 6px; }
        .bar-md { height: 8px; }
        .bar-lg { height: 12px; }

        .bar-indigo { background: var(--primary); }
        .bar-emerald { background: var(--success); }
        .bar-amber { background: var(--warning); }
        .bar-red { background: var(--error); }
        .bar-blue { background: var(--info); }
        .bar-gradient { background: linear-gradient(to right, var(--primary), var(--accent)); }
      `}</style>
    </div>
  );
}
