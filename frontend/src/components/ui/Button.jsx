import clsx from 'clsx';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  danger: 'btn-danger', // need to add these to index.css if used
};

// We will handle sizes and other utilities via standard classes or index.css
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading,
  icon,
  fullWidth,
  ...props
}) {
  return (
    <button
      className={clsx(
        'btn',
        variants[variant],
        `btn-${size}`, // sm, md, lg
        fullWidth && 'w-full',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="spinner"></span>
      ) : icon ? (
        <span className="flex items-center justify-center flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
