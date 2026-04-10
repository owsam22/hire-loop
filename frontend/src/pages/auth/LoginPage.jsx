import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { GraduationCap, Building2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    subtitle: 'Find jobs, analyze resume, practice interviews',
    icon: GraduationCap,
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'hover:border-indigo-300 hover:bg-indigo-50/50',
    active: 'border-indigo-400 bg-indigo-50',
    iconBg: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: 'recruiter',
    label: 'Recruiter',
    subtitle: 'Post jobs, review candidates, manage pipeline',
    icon: Building2,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'hover:border-blue-300 hover:bg-blue-50/50',
    active: 'border-blue-400 bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'admin',
    label: 'Placement Cell',
    subtitle: 'Manage campus drives and platform data',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'hover:border-emerald-300 hover:bg-emerald-50/50',
    active: 'border-emerald-400 bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleLogin = async () => {
    if (!selected) return;
    await login(selected);
    const routes = { student: '/student', recruiter: '/recruiter', admin: '/admin' };
    navigate(routes[selected]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-200 mb-4">
            <span className="text-white font-bold text-xl">HL</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">HireLoop</h1>
          <p className="text-slate-500 mt-1 text-sm flex items-center gap-1">
            <Sparkles size={13} className="text-indigo-400" />
            AI-Powered Campus Recruitment
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 p-6">
          <p className="text-center text-slate-700 font-semibold mb-5">Sign in as</p>

          <div className="space-y-3">
            {ROLES.map(role => {
              const Icon = role.icon;
              const isActive = selected === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelected(role.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-150 text-left ${
                    isActive ? role.active : `border-slate-100 ${role.bg}`
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${role.iconBg}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{role.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{role.subtitle}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isActive ? 'border-indigo-500 bg-indigo-500' : 'border-slate-200'
                  }`}>
                    {isActive && <span className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            fullWidth
            size="lg"
            className="mt-5"
            loading={loading}
            disabled={!selected}
            onClick={handleLogin}
            icon={!loading && <ArrowRight size={16} />}
          >
            {loading ? 'Signing in...' : 'Continue'}
          </Button>

          <p className="text-center text-xs text-slate-400 mt-4">
            Demo mode — no credentials required
          </p>
        </div>

        {/* Features hint */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {['AI Resume Analysis', 'Job Matching', 'Mock Interviews'].map(f => (
            <span key={f} className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1 h-1 bg-indigo-400 rounded-full" />
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
