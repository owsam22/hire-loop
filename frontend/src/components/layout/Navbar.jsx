import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  
  return (
    <header className="navbar">
      <button onClick={onMenuClick} className="btn-menu lg-hidden">
        <Menu size={20} />
      </button>

      <div className="nav-search hidden-mobile">
        <div className="input-with-icon">
          <Search size={16} className="icon" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            className="input"
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <button className="btn-icon">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="avatar">
            {user?.name?.[0].toUpperCase()}
          </div>
          <div className="hidden-mobile">
            <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
