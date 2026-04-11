import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import api from '../services/api';
import { MapPin, Clock, DollarSign, Users, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Public Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs">HL</span>
            </div>
            <span className="font-bold text-slate-800 text-lg">HireLoop</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
            <Button onClick={() => navigate('/login')} icon={<ArrowRight size={14}/>}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50/50 to-slate-50 pt-16 pb-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <Badge color="indigo" className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-white border border-indigo-100 shadow-sm">
            <Sparkles size={14} className="text-indigo-500" />
            AI-Powered Campus Recruitment
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight text-balance">
            Find your dream role.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Zero friction.
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Browse active listings, get matched using AI, and land your next role at top-tier companies.
          </p>
        </div>
      </section>

      {/* Job Feed */}
      <main className="max-w-5xl mx-auto px-4 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Latest Openings</h2>
          <span className="text-sm font-medium text-slate-500">{jobs.length} jobs available</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <Card key={job._id} hover className="flex flex-col h-full !p-0">
              <div className="p-5 flex-1">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: job.logoColor || '#6366f1' }}>
                    {job.logo || '🚀'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{job.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400"/> {job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} className="text-slate-400"/> {job.salary}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                       {job.skills.slice(0, 3).map(s => <Badge key={s} color="slate">{s}</Badge>)}
                       {job.skills.length > 3 && <Badge color="slate">+{job.skills.length - 3}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-50 bg-slate-50/50 p-4">
                <Button fullWidth onClick={() => navigate('/login')}>
                  Login to Apply
                </Button>
              </div>
            </Card>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
              No public jobs available right now.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
