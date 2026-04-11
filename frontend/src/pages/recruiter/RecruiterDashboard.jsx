import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import api from '../../services/api';
import { Users, Briefcase, TrendingUp, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const pipelineData = [
  { stage: 'Applied', count: 134 },
  { stage: 'Screened', count: 67 },
  { stage: 'Shortlisted', count: 28 },
  { stage: 'Interview', count: 12 },
  { stage: 'Offer', count: 5 },
];

const topCandidates = [
  { id: 'c1', name: 'Arjun Mehta', branch: 'CS · IIT Bombay', cgpa: 8.7, match: 94, skills: ['React', 'Node.js'] },
  { id: 'c2', name: 'Priya Patel', branch: 'CS · IIT Delhi', cgpa: 9.1, match: 91, skills: ['Python', 'ML'] },
  { id: 'c3', name: 'Rohan Singh', branch: 'IT · BITS Pilani', cgpa: 8.4, match: 87, skills: ['React', 'TypeScript'] },
  { id: 'c4', name: 'Neha Gupta', branch: 'CS · NIT Trichy', cgpa: 8.9, match: 83, skills: ['Node.js', 'SQL'] },
];

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs').then(res => setJobs(res)).catch(console.error);
  }, []);

  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicants || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'open').length;

  return (
    <AppLayout>
      <div className="dash-container max-w-7xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]} 👋</span>
            </h1>
            <p className="text-slate-500 text-sm">{user?.company} · {user?.designation}</p>
          </div>
          <Button onClick={() => navigate('/recruiter/post-job')} icon={<Plus size={15} />} size="sm">
            Post a Job
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Jobs" value={activeJobs} icon={<Briefcase size={18} />} color="blue" trend="up" trendLabel="Latest jobs live" />
          <StatCard label="Total Applicants" value={totalApplicants} icon={<Users size={18} />} color="indigo" trend="up" trendLabel="+5 today" />
          <StatCard label="Shortlisted" value={28} icon={<CheckCircle size={18} />} color="emerald" />
          <StatCard label="Interviewed" value={12} icon={<TrendingUp size={18} />} color="amber" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Hiring pipeline chart */}
          <div className="lg:col-span-2">
            <Card>
              <p className="font-semibold text-slate-800 mb-6">Hiring Pipeline</p>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={pipelineData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      cursor={{ fill: 'var(--slate-50)' }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* My Active Jobs */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <p className="font-semibold text-slate-800">Active Jobs</p>
              <Button variant="ghost" size="xs" onClick={() => navigate('/recruiter/jobs')}>View all</Button>
            </div>
            <div className="flex flex-col gap-3">
              {jobs.slice(0, 3).map(job => (
                <div key={job._id} className="list-item-mini" onClick={() => navigate('/recruiter/jobs')}>
                  <div className="item-logo sm" style={{ backgroundColor: job.logoColor || 'var(--primary)' }}>
                    {job.logo || '🚀'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{job.title}</p>
                    <p className="text-xs text-slate-400">{job.applicants} applicants</p>
                  </div>
                  <Badge color="emerald" dot>Open</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Candidates */}
        <Card padding={false}>
          <div className="card-header p-5 border-b flex justify-between items-center">
            <p className="font-semibold text-slate-800">Top Candidates</p>
            <Button variant="ghost" size="xs" onClick={() => navigate('/recruiter/applicants')} icon={<ArrowRight size={14} />}>All applicants</Button>
          </div>
          <div className="list-container">
            {topCandidates.map((c, i) => (
              <div key={c.id} className="list-item p-4 flex items-center gap-4 border-b">
                <span className="text-xs font-black text-slate-200 w-6 text-center">0{i+1}</span>
                <Avatar name={c.name} size="sm" color={['indigo','blue','purple','emerald'][i % 4]} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.branch} · CGPA {c.cgpa}</p>
                </div>
                <div className="hidden-mobile flex gap-1">
                  {c.skills.map(s => <Badge key={s} color="slate">{s}</Badge>)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="mini-track">
                     <div className="mini-bar" style={{ width: `${c.match}%` }} />
                  </div>
                  <span className="text-xs font-bold text-primary">{c.match}%</span>
                </div>
                <Button size="xs" variant="outline">Shortlist</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        .dash-container { width: 100%; }
        .chart-container { margin-bottom: -10px; }
        .list-item-mini { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: var(--rounded-lg); background: var(--slate-50); cursor: pointer; transition: 0.2s; }
        .list-item-mini:hover { background: var(--slate-100); }
        .item-logo.sm { width: 36px; height: 36px; border-radius: 8px; font-size: 14px; }
        .mini-track { width: 60px; height: 4px; background: var(--slate-100); border-radius: 99px; overflow: hidden; }
        .mini-bar { height: 100%; background: var(--primary); }
      `}</style>
    </AppLayout>
  );
}
