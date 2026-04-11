import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare,
  Users, Settings, LogOut, ChevronRight, BookOpen,
  BarChart3, Building2, Megaphone
} from 'lucide-react';

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

const Building2Placeholder = ({ ...props }) => <Users {...props} />; // Placeholder as fallback if needed

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = NAV[user?.role] || [];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="sidebar-header">
        <div className="flex items-center gap-3">
          <div className="avatar">HL</div>
          <div>
            <p className="font-bold text-slate-800">HireLoop</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {nav.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 2}
            onClick={onClose}
            className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="chevron" />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar sm">
            {user?.name?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout flex items-center gap-3 w-full mt-2 text-sm text-red">
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sidebar hidden-mobile">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="mobile-overlay" onClick={onClose}>
          <aside className="sidebar mobile-sidebar" onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
