import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { Users, Building2, Briefcase, TrendingUp, Plus, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../../services/api';

const placementTrend = [
  { month: 'Aug', placed: 12 },  { month: 'Sep', placed: 28 },
  { month: 'Oct', placed: 45 },  { month: 'Nov', placed: 71 },
  { month: 'Dec', placed: 89 },  { month: 'Jan', placed: 124 },
];

const branchData = [
  { name: 'CS', value: 45 },   { name: 'IT', value: 20 },
  { name: 'ECE', value: 18 },  { name: 'ME', value: 10 }, { name: 'Other', value: 7 },
];
const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#06b6d4', '#94a3b8'];

const pendingCompanies = [
  { id: 'pc1', name: 'Zomato', sector: 'Food Tech', applied: '2024-01-09' },
  { id: 'pc2', name: 'PhonePe', sector: 'Fintech', applied: '2024-01-10' },
  { id: 'pc3', name: 'Meesho', sector: 'E-commerce', applied: '2024-01-11' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStudents: 0, totalCompanies: 0, totalJobs: 0, placed: 0, placementRate: 0 });

  useEffect(() => {
    api.get('/admin/stats').then(setStats).catch(console.error);
  }, []);

  return (
    <AppLayout>
      <div className="dash-container max-w-7xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Placement Cell Dashboard
            </h1>
            <p className="text-slate-500 text-sm">{user?.college} · Academic Year 2023-24</p>
          </div>
          <Button icon={<Plus size={15} />} size="sm">New Announcement</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Students" value={stats.totalStudents.toLocaleString()} icon={<Users size={18} />} color="indigo" trendLabel="+48 this month" trend="up" />
          <StatCard label="Companies" value={stats.totalCompanies} icon={<Building2 size={18} />} color="blue" trendLabel="5 pending approval" trend="up" />
          <StatCard label="Total Jobs" value={stats.totalJobs} icon={<Briefcase size={18} />} color="purple" />
          <StatCard label="Placed" value={stats.placed} icon={<CheckCircle size={18} />} color="emerald" trendLabel="This year" />
          <StatCard label="Placement %" value={`${stats.placementRate || 0}%`} icon={<TrendingUp size={18} />} color="amber" trend="up" trendLabel="+3% vs last year" />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <p className="font-semibold text-slate-800 mb-6">Placement Trend (2023-24)</p>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={placementTrend}>
                    <defs>
                      <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13 }} />
                    <Area type="monotone" dataKey="placed" stroke="var(--primary)" strokeWidth={2.5} fill="url(#placedGrad)" dot={{ r: 4, fill: 'var(--primary)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card>
            <p className="font-semibold text-slate-800 mb-4">Branch-wise Placements</p>
            <div className="chart-container-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={branchData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {branchData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="legend mt-4 flex flex-wrap gap-3">
              {branchData.map((b, i) => (
                <div key={b.name} className="flex items-center gap-1.5">
                  <span className="legend-dot" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-slate-500 font-medium">{b.name} ({b.value}%)</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <p className="font-semibold text-slate-800">Pending Company Approvals</p>
              <Badge color="amber" dot>{pendingCompanies.length} pending</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {pendingCompanies.map(c => (
                <div key={c.id} className="list-item-mini">
                  <div className="item-initials">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.sector} · Applied {c.applied}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="action-btn success">
                      <CheckCircle size={14} />
                    </button>
                    <button className="action-btn error">
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-6">
              <p className="font-semibold text-slate-800">Global Announcements</p>
              <Button size="xs" icon={<Plus size={12} />}>New</Button>
            </div>
            <div className="flex flex-col gap-3">
              {MOCK_ANNOUNCEMENTS.map(a => {
                const tagColor = a.tag === 'urgent' ? 'red' : a.tag === 'event' ? 'purple' : 'blue';
                return (
                  <div key={a.id} className="announcement-mini">
                    <div className="flex justify-between items-start mb-2">
                      <Badge color={tagColor}>{a.tag}</Badge>
                      <span className="text-xs text-slate-400 font-medium">{a.date}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{a.body}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .dash-container { width: 100%; }
        .chart-container-center { display: flex; justify-content: center; margin: 1rem 0; }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .list-item-mini { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: var(--rounded-lg); background: var(--slate-50); }
        .item-initials { width: 36px; height: 36px; background: #fff; border: 1px solid var(--slate-200); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--slate-700); font-size: 0.875rem; flex-shrink: 0; }
        .action-btn { p: 0.5rem; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.2s; }
        .action-btn.success { background: #d1fae5; color: #065f46; }
        .action-btn.success:hover { background: #a7f3d0; }
        .action-btn.error { background: #fee2e2; color: #991b1b; }
        .action-btn.error:hover { background: #fecaca; }
        .announcement-mini { padding: 1rem; background: var(--slate-50); border-radius: var(--rounded-xl); }
      `}</style>
    </AppLayout>
  );
}
