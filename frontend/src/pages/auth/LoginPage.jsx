import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Sparkles, ArrowRight, UserCircle, KeyRound, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Wait for auth state to update, then AppRoutes redirects automatically
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const autoFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123'); // From seed data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative w-full max-w-md">
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

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 p-6 sm:p-8">
          {error && (
             <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
             </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <UserCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="mt-2"
              loading={loading}
              icon={!loading && <ArrowRight size={16} />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400 text-center mb-3 uppercase tracking-wider font-semibold">Demo Auto-Fill</p>
            <div className="grid grid-cols-3 gap-2">
               <Button variant="secondary" size="xs" onClick={() => autoFill('arjun@student.edu')}>Student</Button>
               <Button variant="secondary" size="xs" onClick={() => autoFill('priya@google.com')}>Recruiter</Button>
               <Button variant="secondary" size="xs" onClick={() => autoFill('admin@placement.edu')}>Admin</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
