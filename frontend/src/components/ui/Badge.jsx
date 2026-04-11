import clsx from 'clsx';

export default function Badge({ children, color = 'indigo', className, dot = false }) {
  return (
    <span
      className={clsx(
        'badge',
        `badge-${color}`,
        className
      )}
    >
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
