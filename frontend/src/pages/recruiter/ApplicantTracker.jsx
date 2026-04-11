import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Mail } from 'lucide-react';

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
      <div className="max-w-6xl flex flex-col gap-6">
        <div className="flex justify-between items-center wrap-mobile gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Applicant Tracker</h1>
            <p className="text-slate-500 text-sm">Filter and manage candidates for your jobs</p>
          </div>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)} 
            className="input select-job"
          >
            {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
            {jobs.length === 0 && <option value="">No jobs available</option>}
          </select>
        </div>

        <Card padding={false} className="table-card">
          {loading ? (
             <div className="loading-state">Loading applicants...</div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>College</th>
                    <th>CGPA</th>
                    <th>Match Score</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map(app => (
                    <tr key={app._id}>
                      <td>
                         <div className="font-bold text-slate-800">{app.userId?.name}</div>
                         <div className="text-xs text-slate-400">{app.userId?.email}</div>
                      </td>
                      <td>{app.userId?.college}</td>
                      <td>{app.userId?.cgpa || 'N/A'}</td>
                      <td>
                         <Badge color={app.matchScore >= 75 ? 'emerald' : 'amber'}>{app.matchScore}% Match</Badge>
                      </td>
                      <td className="capitalize font-bold text-slate-700">
                         {app.status}
                      </td>
                      <td className="text-right flex items-center justify-end gap-2">
                         <select 
                            value={app.status} 
                            onChange={(e) => updateStatus(app._id, e.target.value)}
                            className="input-inline-select"
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
                    <tr><td colSpan="6" className="empty-row">No applicants for this job yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <style>{`
        .wrap-mobile { flex-wrap: wrap; }
        .select-job { width: auto; min-width: 240px; }
        .loading-state { padding: 4rem; text-align: center; color: var(--slate-500); }
        .table-card { overflow: hidden; }
        .table-wrapper { width: 100%; overflow-x: auto; }
        .table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
        .table thead { background: var(--slate-50); border-bottom: 1px solid var(--slate-100); color: var(--slate-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; }
        .table th, .table td { padding: 1rem 1.5rem; white-space: nowrap; }
        .table tbody tr { border-bottom: 1px solid var(--slate-50); transition: 0.2s; }
        .table tbody tr:hover { background: var(--slate-50); }
        .empty-row { padding: 3rem !important; text-align: center; color: var(--slate-400); }
        .text-right { text-align: right; }
        
        .input-inline-select { font-size: 0.75rem; border: 1px solid var(--slate-200); background: var(--slate-50); border-radius: 6px; padding: 0.25rem 0.5rem; outline: none; }
        .input-inline-select:focus { border-color: var(--primary); }
      `}</style>
    </AppLayout>
  );
}
