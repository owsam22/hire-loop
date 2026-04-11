import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Sparkles, ArrowRight, UserCircle, KeyRound, Mail, Building2, School, Rocket } from 'lucide-react';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    name: '', email: '', password: '', 
    college: '', branch: '', company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, role });
      navigate(`/${role}`);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="login-page">
      <div className="blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">HL</div>
          <h1>Join HireLoop</h1>
          <p className="login-subtitle">
            <Sparkles size={13} />
            The AI-powered campus recruitment portal
          </p>
        </div>

        <div className="login-card">
          <div className="role-selector mb-6">
            <button 
              className={role === 'student' ? 'active' : ''} 
              onClick={() => setRole('student')}
            >
              <UserCircle size={16} /> Student
            </button>
            <button 
              className={role === 'recruiter' ? 'active' : ''} 
              onClick={() => setRole('recruiter')}
            >
              <Rocket size={16} /> Recruiter
            </button>
          </div>

          {error && <div className="alert-error mb-4">{error}</div>}

          <form onSubmit={handleRegister} className="login-form flex flex-col gap-4">
            <div className="input-group">
              <label className="label">Full Name</label>
              <div className="input-wrapper">
                <UserCircle size={18} className="input-icon" />
                <input
                  required
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className="input"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
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
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  className="input"
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>
            </div>

            {role === 'student' ? (
              <>
                <div className="input-group">
                  <label className="label">College Name</label>
                  <div className="input-wrapper">
                    <School size={18} className="input-icon" />
                    <input
                      required
                      value={form.college}
                      onChange={e => update('college', e.target.value)}
                      className="input"
                      placeholder="University of Excellence"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Branch / Course</label>
                  <div className="input-wrapper">
                    <School size={18} className="input-icon" />
                    <input
                      required
                      value={form.branch}
                      onChange={e => update('branch', e.target.value)}
                      className="input"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="input-group">
                <label className="label">Company Name</label>
                <div className="input-wrapper">
                  <Building2 size={18} className="input-icon" />
                  <input
                    required
                    value={form.company}
                    onChange={e => update('company', e.target.value)}
                    className="input"
                    placeholder="Tech Corp Inc."
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="mt-4"
              loading={loading}
              icon={!loading && <ArrowRight size={16} />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">Already have an account?</span>{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">Sign In</Link>
          </div>
        </div>
      </div>

      <style>{`
        .login-page { min-height: 100vh; background: var(--slate-50); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; position: relative; overflow-y: auto; }
        .blobs .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; pointer-events: none; }
        .blob-1 { width: 400px; height: 400px; background: var(--primary-light); top: -200px; right: -200px; }
        .blob-2 { width: 400px; height: 400px; background: #ede9fe; bottom: -200px; left: -200px; }
        .login-container { position: relative; width: 100%; max-width: 440px; margin: auto; }
        .login-header { text-align: center; margin-bottom: 2rem; }
        .login-logo { width: 56px; height: 56px; border-radius: var(--rounded-xl); background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 20px; margin: 0 auto 1rem; box-shadow: var(--shadow-indigo); }
        .login-header h1 { font-size: 1.875rem; font-weight: 800; color: var(--slate-800); }
        .login-subtitle { color: var(--slate-500); font-size: 0.875rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.25rem; }
        .login-card { background: var(--white); border-radius: 1.5rem; padding: 2.5rem; border: 1px solid var(--slate-100); box-shadow: var(--shadow-xl); }
        .alert-error { background: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: 0.75rem; font-size: 0.875rem; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--slate-400); }
        .input-wrapper .input { padding-left: 2.5rem; }
        
        .role-selector { display: grid; grid-template-columns: 1fr 1fr; background: var(--slate-50); padding: 4px; border-radius: 12px; border: 1px solid var(--slate-200); }
        .role-selector button { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; border: none; background: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; color: var(--slate-500); cursor: pointer; transition: 0.2s; }
        .role-selector button.active { background: #fff; color: var(--primary); box-shadow: var(--shadow-sm); }
      `}</style>
    </div>
  );
}
