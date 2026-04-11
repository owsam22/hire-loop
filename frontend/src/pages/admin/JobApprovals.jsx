import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Briefcase, Building2, ExternalLink, CheckCircle } from 'lucide-react';

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
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Approvals</h1>
          <p className="text-slate-500 text-sm mt-0.5">Review and approve new job postings & payments</p>
        </div>

        {loading ? (
           <Card className="p-12 text-center text-slate-500">Loading pending jobs...</Card>
        ) : pendingJobs.length === 0 ? (
           <Card className="p-12 text-center text-slate-500">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-slate-300" />
             </div>
             No pending jobs to approve.
           </Card>
        ) : (
          <div className="grid gap-4">
            {pendingJobs.map(job => (
              <Card key={job._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: job.logoColor || '#6366f1' }}>
                    {job.logo || '🚀'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      {job.title}
                      {job.paymentStatus === 'pending' && <Badge color="amber">Payment Pending ($250)</Badge>}
                      {job.paymentStatus === 'paid' && <Badge color="emerald">Paid ($250)</Badge>}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><Building2 size={16} className="text-slate-400" />{job.company}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-600">{job.salary}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                       {job.skills.map(s => <Badge key={s} color="indigo">{s}</Badge>)}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <Button onClick={() => handleApprove(job._id)} icon={<CheckCircle size={15} />}>
                    Approve Payment & Job
                  </Button>
                  <Button variant="outline" icon={<ExternalLink size={15} />}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
