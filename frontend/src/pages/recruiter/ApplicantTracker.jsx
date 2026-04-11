import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

import api from '../../services/api';
import { Mail, CheckSquare, XSquare, MessageSquare } from 'lucide-react';

export default function ApplicantTracker() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all recruiter jobs
    api.get('/jobs/mine').then(data => {
      setJobs(data);
      if (data.length > 0) {
         setSelectedJobId(data[0]._id);
      } else {
         setLoading(false);
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;
    setLoading(true);
    // Note: ensure getApplicantsForJob is working correctly in backend
    api.get(`/applications/job/${selectedJobId}`)
      .then(data => setApplicants(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedJobId]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplicants(apps => apps.map(a => a._id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Applicant Tracker</h1>
            <p className="text-slate-500 text-sm mt-0.5">Filter and manage candidates for your jobs</p>
          </div>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)} 
            className="bg-white border border-slate-200 text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-300 outline-none shadow-sm"
          >
            {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
            {jobs.length === 0 && <option value="">No jobs available</option>}
          </select>
        </div>

        <Card padding={false} className="overflow-hidden">
          {loading ? (
             <div className="p-12 text-center text-slate-500">Loading applicants...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">College</th>
                    <th className="px-6 py-4">CGPA</th>
                    <th className="px-6 py-4">Match Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applicants.map(app => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="font-semibold text-slate-800">{app.userId?.name}</div>
                         <div className="text-xs text-slate-500">{app.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4">{app.userId?.college}</td>
                      <td className="px-6 py-4">{app.userId?.cgpa || 'N/A'}</td>
                      <td className="px-6 py-4">
                         <Badge color={app.matchScore >= 75 ? 'emerald' : 'amber'}>{app.matchScore}% Match</Badge>
                      </td>
                      <td className="px-6 py-4 capitalize font-semibold">
                         {app.status}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <select 
                            value={app.status} 
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 outline-none mr-2"
                         >
                            <option value="applied">Applied</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                         </select>
                         <Button size="xs" variant="outline" icon={<Mail size={12} />}>Email</Button>
                      </td>
                    </tr>
                  ))}
                  {applicants.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No applicants for this job yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
