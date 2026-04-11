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
      <div className="max-w-5xl flex flex-col gap-6">
        {/* Header */}
        <div className="page-header">
          <h1 className="text-2xl font-bold text-slate-800">Browse Jobs</h1>
          <p className="text-slate-500 text-sm">{filtered.length} opportunities matching your profile</p>
        </div>

        {/* Search + filters */}
        <div className="filter-controls flex gap-3">
          <div className="input-with-icon flex-1">
            <Search size={16} className="icon" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search role or company..."
              className="input"
            />
          </div>
          <Button variant="secondary" icon={<SlidersHorizontal size={15} />}>Filters</Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={clsx('filter-tab', activeFilter === f && 'active')}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="job-list flex flex-col gap-3">
          {filtered.map(job => (
            <Card key={job.id} hover padding={false} className="job-item-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="item-logo"
                    style={{ backgroundColor: job.logoColor || 'var(--primary)' }}
                  >
                    {job.logo || '🚀'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">{job.title}</h3>
                        <p className="text-sm text-slate-500">{job.company}</p>
                      </div>
                      <button className="btn-bookmark">
                        <Bookmark size={18} />
                      </button>
                    </div>

                    <div className="item-meta flex flex-wrap gap-4 mt-3">
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
              <div className="card-footer px-5 py-3 border-t flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className={job.matchScore >= 75 ? 'text-success' : 'text-warning'} />
                  <span className="text-xs text-slate-500">Match score</span>
                  <div className="score-track">
                    <div
                      className={clsx('score-bar', job.matchScore >= 75 ? 'success' : 'warning')}
                      style={{ width: `${job.matchScore}%` }}
                    />
                  </div>
                  <span className={clsx('text-xs font-bold', job.matchScore >= 75 ? 'text-success' : 'text-warning')}>
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

      <style>{`
        .input-with-icon { position: relative; width: 100%; }
        .input-with-icon .icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--slate-400); }
        .input-with-icon .input { padding-left: 2.5rem; width: 100%; }
        
        .filter-tab { padding: 0.375rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 500; border: 1px solid var(--slate-200); background: var(--white); color: var(--slate-600); transition: 0.2s; }
        .filter-tab:hover { border-color: var(--primary); color: var(--primary); }
        .filter-tab.active { background: var(--primary); color: var(--white); border-color: var(--primary); box-shadow: var(--shadow-sm); }
        
        .job-item-card { display: flex; flex-direction: column; }
        .item-logo { width: 48px; height: 48px; border-radius: var(--rounded-lg); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 18px; flex-shrink: 0; }
        .btn-bookmark { color: var(--slate-300); transition: color 0.2s; }
        .btn-bookmark:hover { color: var(--primary); }
        .item-meta { font-size: 0.75rem; color: var(--slate-500); }
        .score-track { width: 80px; height: 6px; background: var(--slate-100); border-radius: 99px; overflow: hidden; }
        .score-bar { height: 100%; border-radius: 99px; }
        .score-bar.success { background: var(--success); }
        .score-bar.warning { background: var(--warning); }
        .text-success { color: var(--success); }
        .text-warning { color: var(--warning); }
        .card-footer { background: var(--slate-50); }
      `}</style>
    </AppLayout>
  );
}

import clsx from 'clsx';
