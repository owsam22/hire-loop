import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Eye, Clock, CheckCircle } from 'lucide-react';

export default function MyJobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/mine')
      .then(data => setJobs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div className="loading-state">Loading your jobs...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-5xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Job Listings</h1>
          <p className="text-slate-500 text-sm">Manage your postings and track their approval status.</p>
        </div>

        <Card padding={false} className="table-card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Applicants</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td className="font-bold text-slate-800">{job.title}</td>
                    <td>{job.applicants || 0}</td>
                    <td>
                      {job.paymentStatus === 'paid' ? (
                        <Badge color="emerald"><CheckCircle size={12} /> Paid</Badge>
                      ) : (
                        <Badge color="amber"><Clock size={12} /> Pending</Badge>
                      )}
                    </td>
                    <td>
                      {job.isApprovedByAdmin ? (
                        <Badge color="blue">Live</Badge>
                      ) : (
                        <Badge color="slate">Awaiting Approval</Badge>
                      )}
                    </td>
                    <td className="text-right">
                       <Button size="xs" variant="outline" icon={<Eye size={12} />}>View</Button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr><td colSpan="5" className="empty-row">You haven't posted any jobs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <style>{`
        .loading-state { padding: 4rem; text-align: center; color: var(--slate-500); }
        .table-card { overflow: hidden; }
        .table-wrapper { width: 100%; overflow-x: auto; }
        .table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
        .table thead { background: var(--slate-50); border-bottom: 1px solid var(--slate-100); color: var(--slate-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; }
        .table th, .table td { padding: 1rem 1.5rem; }
        .table tbody tr { border-bottom: 1px solid var(--slate-50); transition: 0.2s; }
        .table tbody tr:hover { background: var(--slate-50) !important; }
        .empty-row { padding: 3rem !important; text-align: center; color: var(--slate-400); }
        .text-right { text-align: right; }
      `}</style>
    </AppLayout>
  );
}
