import clsx from 'clsx';

const colors = {
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
};

export default function Badge({ children, color = 'indigo', className, dot = false }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colors[color],
        className
      )}
    >
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full pulse-dot',
          color === 'emerald' && 'bg-emerald-500',
          color === 'amber' && 'bg-amber-500',
          color === 'red' && 'bg-red-500',
          color === 'indigo' && 'bg-indigo-500',
          color === 'blue' && 'bg-blue-500',
          !['emerald','amber','red','indigo','blue'].includes(color) && 'bg-slate-500',
        )} />
      )}
      {children}
    </span>
  );
}
