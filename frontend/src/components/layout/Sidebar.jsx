import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare,
  Users, Settings, LogOut, ChevronRight, BookOpen,
  BarChart3, Bell, Building2, Megaphone,
} from 'lucide-react';

// Navigation configs per role
const NAV = {
  student: [
    { label: 'Dashboard', to: '/student', icon: LayoutDashboard },
    { label: 'Browse Jobs', to: '/student/jobs', icon: Briefcase },
    { label: 'My Applications', to: '/student/applications', icon: FileText },
    { label: 'Resume Analyzer', to: '/student/resume', icon: BookOpen },
    { label: 'Mock Interview', to: '/student/interview', icon: MessageSquare },
    { label: 'Profile', to: '/student/profile', icon: Users },
  ],
  recruiter: [
    { label: 'Dashboard', to: '/recruiter', icon: LayoutDashboard },
    { label: 'Post a Job', to: '/recruiter/post-job', icon: Briefcase },
    { label: 'My Jobs', to: '/recruiter/jobs', icon: FileText },
    { label: 'Applicants', to: '/recruiter/applicants', icon: Users },
    { label: 'Analytics', to: '/recruiter/analytics', icon: BarChart3 },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Students', to: '/admin/students', icon: Users },
    { label: 'Companies', to: '/admin/companies', icon: Building2 },
    { label: 'Jobs', to: '/admin/jobs', icon: Briefcase },
    { label: 'Announcements', to: '/admin/announcements', icon: Megaphone },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ],
};

const ROLE_THEME = {
  student: { accent: 'indigo', label: 'Student', gradient: 'from-indigo-500 to-violet-500' },
  recruiter: { accent: 'blue', label: 'Recruiter', gradient: 'from-blue-500 to-cyan-500' },
  admin: { accent: 'emerald', label: 'Admin', gradient: 'from-emerald-500 to-teal-500' },
};

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = NAV[user?.role] || [];
  const theme = ROLE_THEME[user?.role] || ROLE_THEME.student;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
            <span className="text-white font-bold text-sm">HL</span>
          </div>
          <div>
            <p className="font-bold text-slate-800 leading-tight">HireLoop</p>
            <p className="text-xs text-slate-400">{theme.label} Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {nav.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 2}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? `bg-indigo-50 text-indigo-700`
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-indigo-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-1 flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 h-full bg-white border-r border-slate-100 fixed left-0 top-0 bottom-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative w-72 bg-white h-full z-10 shadow-2xl slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
