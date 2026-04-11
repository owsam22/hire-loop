import clsx from 'clsx';

export default function Card({ children, className, hover = false, padding = true, ...props }) {
  return (
    <div
      className={clsx(
        'card',
        !padding && 'p-0',
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
