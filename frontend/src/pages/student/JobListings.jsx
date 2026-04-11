import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { MapPin, Clock, DollarSign, Users, TrendingUp, Search, SlidersHorizontal, Bookmark } from 'lucide-react';

const FILTERS = ['All', 'High Match', 'Remote', 'Bangalore', 'Hyderabad'];

export default function JobListings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.get('/jobs');
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Browse Jobs</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} opportunities matching your profile</p>
        </div>

        {/* Search + filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search role or company..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700"
            />
          </div>
          <Button variant="secondary" icon={<SlidersHorizontal size={15} />}>Filters</Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="space-y-3">
          {filtered.map(job => (
            <Card key={job.id} hover className="!p-0 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: job.logoColor }}
                  >
                    {job.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">{job.title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
                      </div>
                      <button className="text-slate-300 hover:text-indigo-500 transition-colors flex-shrink-0 mt-0.5">
                        <Bookmark size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign size={12} />{job.salary}</span>
                      <span className="flex items-center gap-1"><Users size={12} />{job.applicants} applicants</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map(s => <Badge key={s} color="slate">{s}</Badge>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match score footer */}
              <div className="border-t border-slate-50 bg-slate-50/60 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className={job.matchScore >= 75 ? 'text-emerald-500' : 'text-amber-500'} />
                  <span className="text-xs text-slate-500">Match score</span>
                  <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${job.matchScore >= 75 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      style={{ width: `${job.matchScore}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${job.matchScore >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {job.matchScore}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="xs">View Details</Button>
                  <Button size="xs">Apply Now</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
