import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { MOCK_APPLICATIONS } from '../../data/mockData';

const STATUS_CONFIG = {
  applied:     { label: 'Applied',     color: 'blue' },
  shortlisted: { label: 'Shortlisted', color: 'indigo' },
  interview:   { label: 'Interview',   color: 'amber' },
  offer:       { label: 'Offer',       color: 'emerald' },
  rejected:    { label: 'Rejected',    color: 'red' },
};

const STEPS = ['applied', 'shortlisted', 'interview', 'offer'];

export default function MyApplications() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Applications</h1>
          <p className="text-slate-500 text-sm mt-0.5">{MOCK_APPLICATIONS.length} applications tracked</p>
        </div>

        <div className="space-y-4">
          {MOCK_APPLICATIONS.map(app => {
            const cfg = STATUS_CONFIG[app.status];
            const stepIdx = STEPS.indexOf(app.status);
            const isRejected = app.status === 'rejected';

            return (
              <Card key={app.id}>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: app.job.logoColor }}
                  >
                    {app.job.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">{app.job.title}</h3>
                        <p className="text-sm text-slate-500">{app.job.company} · {app.job.location}</p>
                      </div>
                      <Badge color={cfg.color}>{cfg.label}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Applied {app.appliedDate} · {app.matchScore}% match</p>
                  </div>
                </div>

                {/* Progress stepper */}
                {!isRejected ? (
                  <div className="flex items-center gap-1 mt-2">
                    {STEPS.map((step, i) => {
                      const done = i <= stepIdx;
                      const current = i === stepIdx;
                      const label = STATUS_CONFIG[step]?.label;
                      return (
                        <div key={step} className="flex-1 flex flex-col items-center gap-1">
                          <div className={`w-full h-1.5 rounded-full transition-all ${done ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                          <span className={`text-xs font-medium ${current ? 'text-indigo-600' : done ? 'text-slate-500' : 'text-slate-300'}`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-2 p-2.5 bg-red-50 rounded-xl text-xs text-red-500 font-medium text-center">
                    Application rejected · Check feedback in AI tools
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
