import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ScoreRing from '../../components/ui/ScoreRing';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { Briefcase, CheckCircle, Clock, XCircle, TrendingUp, ArrowRight, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const STATUS_CONFIG = {
  applied:     { label: 'Applied',     color: 'blue',   icon: Clock },
  shortlisted: { label: 'Shortlisted', color: 'indigo', icon: Star },
  interview:   { label: 'Interview',   color: 'amber',  icon: Zap },
  offer:       { label: 'Offer',       color: 'emerald',icon: CheckCircle },
  rejected:    { label: 'Rejected',    color: 'red',    icon: XCircle },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/applications/mine'),
      api.get('/jobs')
    ]).then(([appsData, jobsData]) => {
      setApps(appsData);
      setJobs(jobsData);
    }).catch(err => console.error(err));
  }, []);

  const appliedJobs = apps.length;
  const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
  const interviews = apps.filter(a => a.status === 'interview').length;
  const offers = apps.filter(a => a.status === 'offer').length;

  const skills = user?.skills || [];
  const missingSkills = ['TypeScript', 'Docker', 'System Design', 'Redis'];

  return (
    <AppLayout>
      <div className="dash-container">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Good evening, <span className="gradient-text">{user?.name?.split(' ')[0]} 👋</span>
            </h1>
            <p className="text-slate-500 text-sm">{user?.college} · {user?.branch} · CGPA {user?.cgpa}</p>
          </div>
          <Button onClick={() => navigate('/student/resume')} icon={<Zap size={15} />} size="sm">
            Analyze Resume
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Applied" value={appliedJobs} icon={<Briefcase size={18} />} color="blue" trendLabel="This month" trend="up" />
          <StatCard label="Shortlisted" value={shortlisted} icon={<Star size={18} />} color="indigo" trendLabel="+1 this week" trend="up" />
          <StatCard label="Interviews" value={interviews} icon={<Zap size={18} />} color="amber" />
          <StatCard label="Offers" value={offers} icon={<CheckCircle size={18} />} color="emerald" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col gap-6">
            <Card className="score-card">
              <p className="text-sm font-semibold text-slate-700 mb-4">Resume Score</p>
              <div className="flex items-center gap-6">
                <ScoreRing score={user?.resumeScore || 0} size={100} />
                <div className="flex-1 flex flex-col gap-3">
                  <ProgressBar label="ATS Compatibility" value={72} color="indigo" size="sm" showLabel />
                  <ProgressBar label="Keyword Match" value={58} color="amber" size="sm" showLabel />
                  <ProgressBar label="Formatting" value={90} color="emerald" size="sm" showLabel />
                </div>
              </div>
              <Button fullWidth variant="outline" size="sm" className="mt-6" onClick={() => navigate('/student/resume')} icon={<ArrowRight size={14} />}>
                View Full Analysis
              </Button>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-semibold text-slate-700">Profile Completion</p>
                <Badge color="amber">85% done</Badge>
              </div>
              <ProgressBar value={85} color="gradient" size="md" />
              <ul className="todo-list mt-4">
                {['Add 2 projects', 'Complete skills section', 'Add internship experience'].map(t => (
                  <li key={t} className="todo-item">
                    <span className="todo-dot" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card padding={false}>
              <div className="card-header flex justify-between items-center p-5 border-b">
                <p className="font-semibold text-slate-800">Recent Applications</p>
                <Button variant="ghost" size="xs" onClick={() => navigate('/student/applications')}>View all</Button>
              </div>
              <div className="list-container">
                {apps.slice(0, 3).map(app => {
                  const cfg = STATUS_CONFIG[app.status];
                  const IconComp = cfg.icon;
                  return (
                    <div key={app._id} className="list-item p-4 flex items-center gap-4 border-b">
                      <div className="item-logo" style={{ backgroundColor: app.jobId?.logoColor || 'var(--primary)' }}>
                        {app.jobId?.logo || '🚀'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{app.jobId?.title}</p>
                        <p className="text-xs text-slate-400">{app.jobId?.company} · {app.jobId?.location}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden-mobile flex items-center gap-2">
                           <div className="mini-track">
                             <div className="mini-bar" style={{ width: `${app.matchScore}%` }} />
                           </div>
                           <span className="text-xs font-bold text-primary">{app.matchScore}%</span>
                        </div>
                        <Badge color={cfg.color}>
                          <IconComp size={11} />
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                {apps.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No applications yet.</div>}
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-slate-800">Skill Gap Analysis</p>
                <Badge color="red">{missingSkills.length} missing</Badge>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="skill-label text-success mb-2"><CheckCircle size={12} /> Your Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => <Badge key={s} color="emerald">{s}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="skill-label text-error mb-2"><XCircle size={12} /> Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map(s => <Badge key={s} color="red">{s}</Badge>)}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Top Matching Opportunities</h3>
            <Button variant="ghost" size="xs" onClick={() => navigate('/student/jobs')} icon={<ArrowRight size={14} />}>Browse all</Button>
          </div>
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
            {jobs.slice(0, 3).map(job => {
              const matchScore = 85; 
              return (
                <Card key={job._id} hover className="mini-job-card" onClick={() => navigate(`/student/jobs`)}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="item-logo sm" style={{ backgroundColor: job.logoColor || 'var(--primary)' }}>
                      {job.logo || '🚀'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 truncate">{job.title}</p>
                      <p className="text-xs text-slate-500 truncate">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 font-medium">{job.salary}</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className="text-success" />
                      <span className="text-xs font-bold text-success">{matchScore}%</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      <style>{`
        .dash-container { max-width: 1200px; margin: 0 auto; }
        .todo-list { list-style: none; }
        .todo-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--slate-500); margin-bottom: 0.5rem; }
        .todo-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--warning); }
        .item-logo { width: 40px; height: 40px; border-radius: var(--rounded-lg); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0; }
        .item-logo.sm { width: 32px; height: 32px; font-size: 14px; }
        .mini-track { width: 60px; height: 4px; background: var(--slate-100); border-radius: 99px; overflow: hidden; }
        .mini-bar { height: 100%; background: var(--primary); }
        .skill-label { font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem; }
        .text-success { color: var(--success); }
        .text-error { color: var(--error); }
        .mini-job-card { padding: 1.25rem; cursor: pointer; }
      `}</style>
    </AppLayout>
  );
}
