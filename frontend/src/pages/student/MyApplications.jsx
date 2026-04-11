import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';

const STATUS_CONFIG = {
  applied:     { label: 'Applied',     color: 'blue' },
  shortlisted: { label: 'Shortlisted', color: 'indigo' },
  interview:   { label: 'Interview',   color: 'amber' },
  offer:       { label: 'Offer',       color: 'emerald' },
  rejected:    { label: 'Rejected',    color: 'red' },
};

const STEPS = ['applied', 'shortlisted', 'interview', 'offer'];

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await api.get('/applications/mine');
        setApps(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-3xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Applications</h1>
          <p className="text-slate-500 text-sm">{apps.length} applications tracked</p>
        </div>

        <div className="flex flex-col gap-4">
          {apps.map(app => {
            const cfg = STATUS_CONFIG[app.status];
            const stepIdx = STEPS.indexOf(app.status);
            const isRejected = app.status === 'rejected';

            return (
              <Card key={app._id} className="application-card">
                <div className="flex gap-4 mb-6">
                  <div
                    className="item-logo"
                    style={{ backgroundColor: app.jobId?.logoColor || 'var(--primary)' }}
                  >
                    {app.jobId?.logo || '🚀'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800">{app.jobId?.title}</h3>
                        <p className="text-sm text-slate-500">{app.jobId?.company} · {app.jobId?.location}</p>
                      </div>
                      <Badge color={cfg.color}>{cfg.label}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Applied {new Date(app.createdAt).toLocaleDateString()} · {app.matchScore}% match</p>
                  </div>
                </div>

                {/* Progress stepper */}
                {!isRejected ? (
                  <div className="stepper">
                    {STEPS.map((step, i) => {
                      const done = i <= stepIdx;
                      const current = i === stepIdx;
                      const label = STATUS_CONFIG[step]?.label;
                      return (
                        <div key={step} className="step">
                          <div className={clsx('step-bar', done && 'done')} />
                          <span className={clsx('step-label', current && 'current', done && !current && 'done-label')}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rejection-alert">
                    Application rejected · Check feedback in AI tools
                  </div>
                )}
              </Card>
            );
          })}
          
          {apps.length === 0 && !loading && (
            <div className="empty-state">
               <p>No applications to show.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .item-logo { width: 48px; height: 48px; border-radius: var(--rounded-lg); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 18px; flex-shrink: 0; }
        .stepper { display: flex; gap: 0.25rem; }
        .step { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .step-bar { width: 100%; height: 6px; background: var(--slate-100); border-radius: 99px; transition: 0.3s; }
        .step-bar.done { background: var(--primary); }
        .step-label { font-size: 0.75rem; font-weight: 600; color: var(--slate-300); }
        .step-label.current { color: var(--primary); }
        .step-label.done-label { color: var(--slate-600); }
        .rejection-alert { padding: 0.75rem; background: #fee2e2; border-radius: var(--rounded-lg); color: #b91c1c; font-size: 0.75rem; font-weight: 700; text-align: center; }
        .empty-state { padding: 3rem; text-align: center; color: var(--slate-400); background: var(--white); border-radius: var(--rounded-2xl); border: 1px dashed var(--slate-200); }
      `}</style>
    </AppLayout>
  );
}

import clsx from 'clsx';
