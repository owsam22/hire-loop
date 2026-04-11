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
    // Ideally we would fetch /jobs?recruiterId=${user._id}
    api.get('/jobs').then(res => setJobs(res)).catch(console.error);
  }, []);

  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicants || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'open').length;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]} 👋</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{user?.company} · {user?.designation}</p>
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
              <p className="font-semibold text-slate-800 mb-4">Hiring Pipeline</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pipelineData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* My Active Jobs */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-slate-800">Active Jobs</p>
              <Button variant="ghost" size="xs" onClick={() => navigate('/recruiter/jobs')}>View all</Button>
            </div>
            <div className="space-y-3">
              {jobs.slice(0, 3).map(job => (
                <div key={job._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ backgroundColor: job.logoColor || '#6366f1' }}>
                    {job.logo || '🚀'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{job.title}</p>
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
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-slate-800">Top Candidates</p>
            <Button variant="ghost" size="xs" onClick={() => navigate('/recruiter/applicants')} icon={<ArrowRight size={14} />}>All applicants</Button>
          </div>
          <div className="divide-y divide-slate-50">
            {topCandidates.map((c, i) => (
              <div key={c.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-300 w-5 text-center flex-shrink-0">#{i+1}</span>
                <Avatar name={c.name} size="sm" color={['indigo','blue','purple','emerald'][i % 4]} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.branch} · CGPA {c.cgpa}</p>
                </div>
                <div className="hidden sm:flex gap-1">
                  {c.skills.map(s => <Badge key={s} color="slate">{s}</Badge>)}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${c.match}%` }} />
                  </div>
                  <span className="text-xs font-bold text-indigo-600">{c.match}%</span>
                </div>
                <Button size="xs" variant="outline">Shortlist</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
