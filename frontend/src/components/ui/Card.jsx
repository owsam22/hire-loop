import clsx from 'clsx';

export default function Card({ children, className, hover = false, padding = true, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-slate-100 shadow-sm',
        padding && 'p-5',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
