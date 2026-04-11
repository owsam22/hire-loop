import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    salary: '', cgpa: '', skills: '', description: '', branches: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [checkout, setCheckout] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    name: '', cardNumber: '', expiry: '', cvc: ''
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setPay = (k, v) => setPaymentForm(f => ({ ...f, [k]: v }));

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create the job first
      const jobData = await api.post('/jobs', {
        ...form,
        cgpaCutoff: Number(form.cgpa) || 0
      });

      const jobId = jobData._id;

      // 2. Process fake payment
      const cardLast4 = paymentForm.cardNumber.replace(/\\s/g, '').slice(-4);
      await api.post('/payments/process', {
        jobId,
        amount: 250, // $250 Mock listing fee
        cardLast4,
        nameOnCard: paymentForm.name
      });

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Failed to process payment and post job');
      setCheckout(false);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, id, type = 'text', val, setter, ...props }) => (
    <div className="input-group">
      <label className="label">{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => setter(id, e.target.value)}
        className="input"
        {...props}
      />
    </div>
  );

  if (submitted) {
    return (
      <AppLayout>
        <div className="success-screen">
          <div className="success-icon-container">
            <CheckCircle size={32} />
          </div>
          <h2 className="success-title">Payment Received!</h2>
          <p className="success-subtitle">Your job posting is pending Admin Approval. You will be notified once it is live.</p>
          <Button className="mt-8" onClick={() => {
             setSubmitted(false);
             setCheckout(false);
             setForm({title: '', company: '', location: '', type: 'Full-time', salary: '', cgpa: '', skills: '', description: '', branches: ''});
             setPaymentForm({name: '', cardNumber: '', expiry: '', cvc: ''});
          }}>Post Another Job</Button>
        </div>
        <style>{`
          .success-screen { max-width: 480px; margin: 4rem auto 0; text-align: center; }
          .success-icon-container { width: 64px; height: 64px; background: #dcfce7; color: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
          .success-title { font-size: 1.5rem; font-weight: 800; color: var(--slate-800); }
          .success-subtitle { font-size: 0.875rem; color: var(--slate-500); margin-top: 0.5rem; }
        `}</style>
      </AppLayout>
    );
  }

  if (checkout) {
    return (
      <AppLayout>
        <div className="max-w-xl flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
            <p className="text-slate-500 text-sm">Pay the listing fee to publish your job</p>
          </div>
          
          <Card>
            <div className="checkout-sum flex justify-between items-center mb-6 pb-6 border-b">
               <div>
                  <h3 className="font-bold text-slate-800">Job Listing Fee</h3>
                  <p className="text-xs text-slate-500">{form.title || 'Untitled Role'} at {form.company || 'Company'}</p>
               </div>
               <div className="text-2xl font-black text-slate-800">$250.00</div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
               <Field label="Name on Card" id="name" val={paymentForm.name} setter={setPay} placeholder="John Doe" required />
               <Field label="Card Number" id="cardNumber" val={paymentForm.cardNumber} setter={setPay} placeholder="0000 0000 0000 0000" maxLength={19} required />
               <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry (MM/YY)" id="expiry" val={paymentForm.expiry} setter={setPay} placeholder="12/24" required />
                  <Field label="CVC" id="cvc" type="password" val={paymentForm.cvc} setter={setPay} placeholder="123" maxLength={4} required />
               </div>
               
               <div className="flex gap-4 mt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setCheckout(false)}>Cancel</Button>
                  <Button type="submit" loading={loading} className="flex-1">Pay $250.00</Button>
               </div>
            </form>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Post a Job</h1>
          <p className="text-slate-500 text-sm">Fill in the details below to publish your opening</p>
        </div>

        <Card>
          <p className="section-title mb-4">Job Details</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Job Title" id="title" val={form.title} setter={set} placeholder="e.g. Software Engineer" />
            <Field label="Company" id="company" val={form.company} setter={set} placeholder="e.g. Google" />
            <Field label="Location" id="location" val={form.location} setter={set} placeholder="e.g. Bangalore / Remote" />
            <div className="input-group">
              <label className="label">Employment Type</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                className="input select"
              >
                {['Full-time', 'Internship', 'Contract'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Field label="CTC / Stipend" id="salary" val={form.salary} setter={set} placeholder="e.g. 24 LPA" />
            <Field label="Min CGPA" id="cgpa" type="number" val={form.cgpa} setter={set} placeholder="e.g. 7.5" />
          </div>
        </Card>

        <Card>
          <p className="section-title mb-4">Requirements</p>
          <div className="flex flex-col gap-4">
            <div className="input-group">
              <label className="label">Required Skills <span className="label-note">(comma separated)</span></label>
              <input
                value={form.skills}
                onChange={e => set('skills', e.target.value)}
                placeholder="React, Node.js, Python, SQL..."
                className="input"
              />
              {form.skills && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.skills.split(',').filter(Boolean).map(s => (
                    <Badge key={s.trim()} color="indigo">{s.trim()}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="input-group">
              <label className="label">Eligible Branches <span className="label-note">(comma separated)</span></label>
              <input
                value={form.branches}
                onChange={e => set('branches', e.target.value)}
                placeholder="CS, IT, ECE..."
                className="input"
              />
            </div>
          </div>
        </Card>

        <Card>
          <p className="section-title mb-4">Job Description</p>
          <textarea
            rows={6}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            className="input textarea"
          />
        </Card>

        <Button fullWidth size="lg" onClick={() => setCheckout(true)}>
          Proceed to Payment ($250)
        </Button>
      </div>

      <style>{`
        .section-title { font-size: 0.875rem; font-weight: 700; color: var(--slate-700); }
        .label-note { color: var(--slate-400); font-weight: 400; }
        .textarea { resize: none; min-height: 150px; }
        .checkout-sum { border-color: var(--slate-100); }
      `}</style>
    </AppLayout>
  );
}
