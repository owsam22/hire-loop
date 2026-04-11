import clsx from 'clsx';

export default function Avatar({ name, size = 'md', color = 'indigo', src }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className={clsx('avatar-container', `avatar-${size}`, `avatar-${color}`)}>
      {src ? (
        <img src={src} alt={name} className="avatar-img" />
      ) : (
        <span className="avatar-initials">{initials}</span>
      )}
      <style>{`
        .avatar-container { border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; position: relative; overflow: hidden; border: 2px solid #fff; }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        
        .avatar-xs { width: 24px; height: 24px; font-size: 10px; }
        .avatar-sm { width: 32px; height: 32px; font-size: 12px; }
        .avatar-md { width: 40px; height: 40px; font-size: 14px; }
        .avatar-lg { width: 48px; height: 48px; font-size: 16px; }
        .avatar-xl { width: 64px; height: 64px; font-size: 20px; }

        .avatar-indigo { background: var(--primary-light); color: var(--primary); }
        .avatar-emerald { background: #d1fae5; color: #059669; }
        .avatar-amber { background: #fef3c7; color: #d97706; }
        .avatar-blue { background: #dbeafe; color: #2563eb; }
        .avatar-purple { background: #f3e8ff; color: #9333ea; }
      `}</style>
    </div>
  );
}
