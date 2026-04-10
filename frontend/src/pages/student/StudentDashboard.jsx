import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ScoreRing from '../../components/ui/ScoreRing';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { MOCK_STATS, MOCK_APPLICATIONS, MOCK_JOBS, MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { Briefcase, CheckCircle, Clock, XCircle, TrendingUp, ArrowRight, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const stats = MOCK_STATS.student;

  const skills = ['React', 'Node.js', 'Python', 'SQL'];
  const missingSkills = ['TypeScript', 'Docker', 'System Design', 'Redis'];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Good evening, <span className="gradient-text">{user?.name?.split(' ')[0]} 👋</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{user?.college} · {user?.branch} · CGPA {user?.cgpa}</p>
          </div>
          <Button onClick={() => navigate('/student/resume')} icon={<Zap size={15} />} size="sm">
            Analyze Resume
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Applied" value={stats.appliedJobs} icon={<Briefcase size={18} />} color="blue" trendLabel="This month" trend="up" />
          <StatCard label="Shortlisted" value={stats.shortlisted} icon={<Star size={18} />} color="indigo" trendLabel="+1 this week" trend="up" />
          <StatCard label="Interviews" value={stats.interviews} icon={<Zap size={18} />} color="amber" />
          <StatCard label="Offers" value={stats.offers} icon={<CheckCircle size={18} />} color="emerald" />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Resume Score + Profile */}
          <div className="space-y-4">
            <Card>
              <p className="text-sm font-semibold text-slate-700 mb-4">Resume Score</p>
              <div className="flex items-center gap-5">
                <ScoreRing score={stats.resumeScore} size={100} />
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">ATS Compatibility</p>
                    <ProgressBar value={72} color="indigo" size="sm" showLabel />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Keyword Match</p>
                    <ProgressBar value={58} color="amber" size="sm" showLabel />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Formatting</p>
                    <ProgressBar value={90} color="emerald" size="sm" showLabel />
                  </div>
                </div>
              </div>
              <Button
                fullWidth
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/student/resume')}
                icon={<ArrowRight size={14} />}
              >
                View Full Analysis
              </Button>
            </Card>

            {/* Profile completion */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Profile</p>
                <Badge color="amber">{stats.profileCompletion}% done</Badge>
              </div>
              <ProgressBar value={stats.profileCompletion} color="gradient" size="md" />
              <ul className="mt-3 space-y-1.5">
                {['Add 2 projects', 'Complete skills section', 'Add internship experience'].map(t => (
                  <li key={t} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2 space-y-4">
            <Card padding={false}>
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <p className="font-semibold text-slate-800">My Applications</p>
                <Button variant="ghost" size="xs" onClick={() => navigate('/student/applications')}>View all</Button>
              </div>
              <div className="divide-y divide-slate-50">
                {MOCK_APPLICATIONS.map(app => {
                  const cfg = STATUS_CONFIG[app.status];
                  const IconComp = cfg.icon;
                  return (
                    <div key={app.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      {/* Company logo pill */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: app.job.logoColor }}
                      >
                        {app.job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{app.job.title}</p>
                        <p className="text-xs text-slate-400">{app.job.company} · {app.job.location}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${app.matchScore}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-indigo-600">{app.matchScore}%</span>
                        </div>
                        <Badge color={cfg.color}>
                          <IconComp size={11} />
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Skill Gap */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-slate-800">Skill Gap Analysis</p>
                <Badge color="red">{missingSkills.length} missing</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-emerald-600 mb-2 flex items-center gap-1"><CheckCircle size={12} /> Your Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => <Badge key={s} color="emerald">{s}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-500 mb-2 flex items-center gap-1"><XCircle size={12} /> Missing Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map(s => <Badge key={s} color="red">{s}</Badge>)}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Top Matching Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-800">Top Matching Jobs</p>
            <Button variant="ghost" size="xs" onClick={() => navigate('/student/jobs')} icon={<ArrowRight size={14} />}>Browse all</Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_JOBS.slice(0, 3).map(job => (
              <div key={job.id} onClick={() => navigate(`/student/jobs`)} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 card-hover cursor-pointer">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: job.logoColor }}>
                    {job.logo}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-tight truncate">{job.title}</p>
                    <p className="text-xs text-slate-400">{job.company} · {job.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">{job.salary}</span>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={12} className={job.matchScore >= 75 ? 'text-emerald-500' : 'text-amber-500'} />
                    <span className={`text-xs font-bold ${job.matchScore >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>{job.matchScore}% match</span>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${job.matchScore >= 75 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <Card>
          <p className="font-semibold text-slate-800 mb-4">📢 Announcements</p>
          <div className="space-y-3">
            {MOCK_ANNOUNCEMENTS.map(a => {
              const tagColor = a.tag === 'urgent' ? 'red' : a.tag === 'event' ? 'purple' : 'blue';
              return (
                <div key={a.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                      <Badge color={tagColor}>{a.tag}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{a.body}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{a.date}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
