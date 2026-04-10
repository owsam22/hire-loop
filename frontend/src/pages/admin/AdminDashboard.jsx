import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { MOCK_STATS, MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { Users, Building2, Briefcase, TrendingUp, Plus, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

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
  const stats = MOCK_STATS.admin;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Placement Cell Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{user?.college} · Academic Year 2023-24</p>
          </div>
          <Button icon={<Plus size={15} />} size="sm">New Announcement</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Students" value={stats.totalStudents.toLocaleString()} icon={<Users size={18} />} color="indigo" trendLabel="+48 this month" trend="up" />
          <StatCard label="Companies" value={stats.totalCompanies} icon={<Building2 size={18} />} color="blue" trendLabel="5 pending approval" trend="up" />
          <StatCard label="Total Jobs" value={stats.totalJobs} icon={<Briefcase size={18} />} color="purple" />
          <StatCard label="Placed" value={stats.placed} icon={<CheckCircle size={18} />} color="emerald" trendLabel="This year" />
          <StatCard label="Placement %" value={`${stats.placementRate}%`} icon={<TrendingUp size={18} />} color="amber" trend="up" trendLabel="+3% vs last year" />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Placement trend */}
          <div className="lg:col-span-2">
            <Card>
              <p className="font-semibold text-slate-800 mb-4">Placement Trend (2023-24)</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={placementTrend}>
                  <defs>
                    <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13 }} />
                  <Area type="monotone" dataKey="placed" stroke="#6366f1" strokeWidth={2.5} fill="url(#placedGrad)" dot={{ r: 4, fill: '#6366f1' }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Branch distribution */}
          <Card>
            <p className="font-semibold text-slate-800 mb-4">Branch-wise Placements</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={branchData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {branchData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2">
              {branchData.map((b, i) => (
                <div key={b.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-slate-500">{b.name} ({b.value}%)</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Pending company approvals */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-slate-800">Pending Approvals</p>
              <Badge color="amber" dot>{pendingCompanies.length} pending</Badge>
            </div>
            <div className="space-y-3">
              {pendingCompanies.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.sector} · Applied {c.applied}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                      <CheckCircle size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Announcements */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-slate-800">Announcements</p>
              <Button size="xs" icon={<Plus size={12} />}>New</Button>
            </div>
            <div className="space-y-3">
              {MOCK_ANNOUNCEMENTS.map(a => {
                const tagColor = a.tag === 'urgent' ? 'red' : a.tag === 'event' ? 'purple' : 'blue';
                return (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge color={tagColor}>{a.tag}</Badge>
                      <span className="text-xs text-slate-400">{a.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{a.body}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
