import clsx from 'clsx';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-95',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 active:scale-95',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 active:scale-95',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm active:scale-95',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm active:scale-95',
  outline: 'bg-transparent border border-indigo-300 text-indigo-600 hover:bg-indigo-50 active:scale-95',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-xl',
};

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
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
