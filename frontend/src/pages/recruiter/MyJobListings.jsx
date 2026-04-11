import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Eye, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';

export default function MyJobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/mine')
      .then(data => setJobs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div className="p-8 text-center text-slate-500">Loading your jobs...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Job Listings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your postings and track their approval status.</p>
        </div>

        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map(job => (
                  <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{job.title}</td>
                    <td className="px-6 py-4">{job.applicants || 0}</td>
                    <td className="px-6 py-4">
                      {job.paymentStatus === 'paid' ? (
                        <Badge color="emerald"><CheckCircle size={12} className="mr-1" /> Paid</Badge>
                      ) : (
                        <Badge color="amber"><Clock size={12} className="mr-1" /> Pending</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {job.isApprovedByAdmin ? (
                        <Badge color="blue">Live</Badge>
                      ) : (
                        <Badge color="slate">Awaiting Approval</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <Button size="xs" variant="outline" icon={<Eye size={12} />}>View</Button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">You haven't posted any jobs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
