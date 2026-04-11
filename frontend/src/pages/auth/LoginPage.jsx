import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const autoFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div className="login-page">
      <div className="blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">HL</div>
          <h1>HireLoop</h1>
          <p className="login-subtitle">
            <Sparkles size={13} />
            AI-Powered Campus Recruitment
          </p>
        </div>

        <div className="login-card">
          {error && (
             <div className="alert-error">
                <AlertCircle size={16} /> {error}
             </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="input-wrapper">
                <UserCircle size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <div className="input-wrapper">
                <KeyRound size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="mt-6"
              loading={loading}
              icon={!loading && <ArrowRight size={16} />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">Don't have an account?</span>{' '}
            <Link to="/signup" className="font-bold text-primary hover:underline">Create Account</Link>
          </div>

          <div className="demo-footer">
            <p className="demo-title">Demo Auto-Fill</p>
            <div className="demo-grid">
               <Button variant="secondary" size="sm" onClick={() => autoFill('arjun@student.edu')}>Student</Button>
               <Button variant="secondary" size="sm" onClick={() => autoFill('priya@google.com')}>Recruiter</Button>
               <Button variant="secondary" size="sm" onClick={() => autoFill('admin@placement.edu')}>Admin</Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page { min-height: 100vh; background: var(--slate-50); display: flex; align-items: center; justify-content: center; padding: 1rem; position: relative; overflow: hidden; }
        .blobs .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; pointer-events: none; }
        .blob-1 { width: 400px; height: 400px; background: var(--primary-light); top: -200px; right: -200px; }
        .blob-2 { width: 400px; height: 400px; background: #ede9fe; bottom: -200px; left: -200px; }
        .login-container { position: relative; width: 100%; max-width: 440px; }
        .login-header { text-align: center; margin-bottom: 2rem; }
        .login-logo { width: 56px; height: 56px; border-radius: var(--rounded-xl); background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 20px; margin: 0 auto 1rem; box-shadow: var(--shadow-indigo); }
        .login-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--slate-800); }
        .login-subtitle { color: var(--slate-500); font-size: 0.875rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.25rem; }
        .login-card { background: var(--white); border-radius: 1.5rem; padding: 2.5rem; border: 1px solid var(--slate-100); box-shadow: var(--shadow-xl); }
        .alert-error { background: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: 0.75rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--slate-400); }
        .input-wrapper .input { padding-left: 2.5rem; }
        .demo-footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--slate-100); }
        .demo-title { font-size: 0.75rem; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; text-align: center; }
        .demo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
      `}</style>
    </div>
  );
}
