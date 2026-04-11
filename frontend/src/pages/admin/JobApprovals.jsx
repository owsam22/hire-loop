import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Building2, ExternalLink, CheckCircle } from 'lucide-react';

export default function JobApprovals() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = () => {
    setLoading(true);
    api.get('/admin/jobs/pending')
      .then(data => setPendingJobs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (jobId) => {
    try {
      await api.patch(`/admin/jobs/${jobId}/approve`);
      setPendingJobs(jobs => jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert('Failed to approve job');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Approvals</h1>
          <p className="text-slate-500 text-sm">Review and approve new job postings & payments</p>
        </div>

        {loading ? (
           <Card className="loading-card">Loading pending jobs...</Card>
        ) : pendingJobs.length === 0 ? (
           <Card className="empty-state-card">
             <div className="empty-icon-container">
                <CheckCircle size={32} />
             </div>
             <p className="empty-title">All caught up!</p>
             <p className="empty-subtitle">No pending jobs to approve at the moment.</p>
           </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingJobs.map(job => (
              <Card key={job._id} className="approval-card">
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <div className="item-logo" style={{ backgroundColor: job.logoColor || 'var(--primary)' }}>
                    {job.logo || '🚀'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-slate-800 text-lg truncate">{job.title}</h3>
                      {job.paymentStatus === 'pending' && <Badge color="amber">Payment Pending</Badge>}
                      {job.paymentStatus === 'paid' && <Badge color="emerald">Paid ($250)</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><Building2 size={16} />{job.company}</span>
                      <span className="dot-sep" />
                      <span>{job.location}</span>
                      <span className="dot-sep" />
                      <span className="font-bold text-slate-700">{job.salary}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                       {job.skills.map(s => <Badge key={s} color="indigo">{s}</Badge>)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm-col-actions">
                  <Button onClick={() => handleApprove(job._id)} icon={<CheckCircle size={15} />}>
                    Approve
                  </Button>
                  <Button variant="outline" icon={<ExternalLink size={15} />}>
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .loading-card { padding: 4rem; text-align: center; color: var(--slate-500); }
        .empty-state-card { padding: 5rem 2rem; text-align: center; border: 1px dashed var(--slate-200); }
        .empty-icon-container { width: 64px; height: 64px; background: var(--slate-50); color: var(--slate-300); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .empty-title { font-size: 1.25rem; font-weight: 800; color: var(--slate-800); }
        .empty-subtitle { color: var(--slate-500); font-size: 0.875rem; margin-top: 0.5rem; }
        
        .approval-card { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
        @media (max-width: 640px) { .approval-card { flex-direction: column; align-items: flex-start; } }
        
        .item-logo { width: 56px; height: 56px; border-radius: var(--rounded-lg); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 20px; flex-shrink: 0; }
        .dot-sep { width: 4px; height: 4px; border-radius: 50%; background: var(--slate-200); }
        .sm-col-actions { flex-shrink: 0; }
        @media (max-width: 640px) { .sm-col-actions { width: 100%; } .sm-col-actions button { flex: 1; justify-content: center; } }
      `}</style>
    </AppLayout>
  );
}
