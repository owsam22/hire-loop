import { useState } from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    { id: 1, text: 'Google shortlisted you for SDE role', time: '2h ago', unread: true },
    { id: 2, text: 'New job matching your profile: Razorpay', time: '5h ago', unread: true },
    { id: 3, text: 'Your resume score improved to 72', time: '1d ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-20">

      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-slate-700 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 lg:hidden" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="font-semibold text-slate-800">Notifications</p>
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{unreadCount} new</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${n.unread ? 'bg-indigo-50/40' : ''}`}>
                  {n.unread && <span className="mt-1.5 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 pulse-dot" />}
                  <div className={n.unread ? '' : 'pl-3'}>
                    <p className="text-sm text-slate-700">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <Avatar name={user?.name} size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name?.split(' ')[0]}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
