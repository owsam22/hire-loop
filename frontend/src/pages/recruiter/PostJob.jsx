import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CheckCircle } from 'lucide-react';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    salary: '', cgpa: '', skills: '', description: '', branches: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const Field = ({ label, id, type = 'text', ...props }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[id]}
        onChange={e => set(id, e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700"
        {...props}
      />
    </div>
  );

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto mt-16 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Job Posted!</h2>
          <p className="text-slate-500 text-sm mt-2">Your job posting is live and students can now apply.</p>
          <Button className="mt-6" onClick={() => setSubmitted(false)}>Post Another Job</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Post a Job</h1>
          <p className="text-slate-500 text-sm mt-0.5">Fill in the details below to publish your opening</p>
        </div>

        <Card>
          <p className="font-semibold text-slate-700 mb-4">Job Details</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Job Title" id="title" placeholder="e.g. Software Engineer" />
            <Field label="Company" id="company" placeholder="e.g. Google" />
            <Field label="Location" id="location" placeholder="e.g. Bangalore / Remote" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Employment Type</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700"
              >
                {['Full-time', 'Internship', 'Contract'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Field label="CTC / Stipend" id="salary" placeholder="e.g. 24 LPA" />
            <Field label="Min CGPA" id="cgpa" type="number" placeholder="e.g. 7.5" />
          </div>
        </Card>

        <Card>
          <p className="font-semibold text-slate-700 mb-4">Requirements</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Required Skills <span className="text-slate-400">(comma separated)</span></label>
              <input
                value={form.skills}
                onChange={e => set('skills', e.target.value)}
                placeholder="React, Node.js, Python, SQL..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700"
              />
              {form.skills && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.skills.split(',').filter(Boolean).map(s => (
                    <Badge key={s.trim()} color="indigo">{s.trim()}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Eligible Branches <span className="text-slate-400">(comma separated)</span></label>
              <input
                value={form.branches}
                onChange={e => set('branches', e.target.value)}
                placeholder="CS, IT, ECE..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700"
              />
            </div>
          </div>
        </Card>

        <Card>
          <p className="font-semibold text-slate-700 mb-4">Job Description</p>
          <textarea
            rows={6}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 resize-none"
          />
        </Card>

        <Button fullWidth size="lg" onClick={() => setSubmitted(true)}>
          Publish Job Opening
        </Button>
      </div>
    </AppLayout>
  );
}
