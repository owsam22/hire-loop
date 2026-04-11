import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import api from '../services/api';
import { MapPin, Clock, DollarSign, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch public jobs
    api.get('/jobs')
      .then(setJobs)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="landing-page">
      {/* Public Header */}
      <header className="public-header">
        <div className="max-w-7xl flex justify-between items-center h-full">
          <div className="flex items-center gap-2">
            <div className="avatar">HL</div>
            <span className="font-bold text-slate-800 text-lg">HireLoop</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
            <Button size="sm" onClick={() => navigate('/signup')} icon={<ArrowRight size={14}/>}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-3xl space-y-6">
          <Badge color="indigo" className="hero-badge">
            <Sparkles size={14} className="text-primary" />
            AI-Powered Campus Recruitment
          </Badge>
          <h1 className="hero-title">
            Find your dream role.
            <br />
            <span className="gradient-text">Zero friction.</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Browse active listings, get matched using AI, and land your next role at top-tier companies.
          </p>
        </div>
      </section>

      {/* Job Feed */}
      <main className="max-w-5xl px-4 pb-20 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Latest Openings</h2>
          <span className="text-sm font-medium text-slate-500">{jobs.length} jobs available</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {jobs.map(job => (
            <Card key={job._id} hover padding={false} className="job-card">
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="job-logo" style={{ backgroundColor: job.logoColor || 'var(--primary)' }}>
                    {job.logo || '🚀'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.company}</p>
                    
                    <div className="job-meta">
                      <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salary}</span>
                    </div>

                    <div className="flex gap-1 mt-4">
                       {job.skills.slice(0, 3).map(s => <Badge key={s} color="slate">{s}</Badge>)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer p-4 border-t">
                <Button fullWidth onClick={() => navigate('/login')}>
                  Login to Apply
                </Button>
              </div>
            </Card>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl">
              No public jobs available right now.
            </div>
          )}
        </div>
      </main>
      
      <style>{`
        .landing-page { min-height: 100vh; background: var(--slate-50); }
        .public-header { background: var(--white); border-bottom: 1px solid var(--slate-100); height: 64px; padding: 0 var(--sp-6); sticky; top: 0; z-index: 50; }
        .hero-section { background: linear-gradient(to bottom, #eff6ff, var(--slate-50)); padding: 4rem var(--sp-4) 3rem; text-align: center; display: flex; justify-content: center; }
        .hero-badge { background: var(--white); border: 1px solid var(--primary-light); box-shadow: var(--shadow-sm); padding: 0.5rem 1rem; }
        .hero-title { font-size: 3rem; font-weight: 800; color: var(--slate-800); line-height: 1.1; margin-bottom: 1rem; }
        .job-card { display: flex; flex-direction: column; }
        .job-logo { width: 48px; height: 48px; border-radius: var(--rounded-xl); display: flex; align-items: center; justify-content: center; color: var(--white); font-weight: bold; font-size: 20px; flex-shrink: 0; }
        .job-meta { display: flex; gap: 1rem; margin-top: 0.75rem; font-size: 0.75rem; color: var(--slate-500); }
        .card-footer { background: var(--slate-50); border-top: 1px solid var(--slate-100); }
      `}</style>
    </div>
  );
}
