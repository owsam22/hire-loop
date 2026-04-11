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
      const cardLast4 = paymentForm.cardNumber.replace(/\s/g, '').slice(-4);
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
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => setter(id, e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700"
        {...props}
      />
    </div>
  );

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto mt-16 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Payment Received!</h2>
          <p className="text-slate-500 text-sm mt-2">Your job posting is pending Admin Approval. You will be notified once it is live.</p>
          <Button className="mt-6" onClick={() => {
             setSubmitted(false);
             setCheckout(false);
             setForm({title: '', company: '', location: '', type: 'Full-time', salary: '', cgpa: '', skills: '', description: '', branches: ''});
             setPaymentForm({name: '', cardNumber: '', expiry: '', cvc: ''});
          }}>Post Another Job</Button>
        </div>
      </AppLayout>
    );
  }

  if (checkout) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
            <p className="text-slate-500 text-sm mt-0.5">Pay the listing fee to publish your job</p>
          </div>
          
          <Card>
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
               <div>
                  <h3 className="font-semibold text-slate-800">Job Listing Fee</h3>
                  <p className="text-xs text-slate-500">{form.title} at {form.company}</p>
               </div>
               <div className="text-xl font-bold text-slate-800">$250.00</div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
               <Field label="Name on Card" id="name" val={paymentForm.name} setter={setPay} placeholder="John Doe" required />
               <Field label="Card Number" id="cardNumber" val={paymentForm.cardNumber} setter={setPay} placeholder="0000 0000 0000 0000" maxLength={19} required />
               <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry (MM/YY)" id="expiry" val={paymentForm.expiry} setter={setPay} placeholder="12/24" required />
                  <Field label="CVC" id="cvc" type="password" val={paymentForm.cvc} setter={setPay} placeholder="123" maxLength={4} required />
               </div>
               
               <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setCheckout(false)}>Cancel</Button>
                  <Button type="submit" loading={loading} className="flex-1 text-center">Pay $250.00</Button>
               </div>
            </form>
          </Card>
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
            <Field label="Job Title" id="title" val={form.title} setter={set} placeholder="e.g. Software Engineer" />
            <Field label="Company" id="company" val={form.company} setter={set} placeholder="e.g. Google" />
            <Field label="Location" id="location" val={form.location} setter={set} placeholder="e.g. Bangalore / Remote" />
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
            <Field label="CTC / Stipend" id="salary" val={form.salary} setter={set} placeholder="e.g. 24 LPA" />
            <Field label="Min CGPA" id="cgpa" type="number" val={form.cgpa} setter={set} placeholder="e.g. 7.5" />
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

        <Button fullWidth size="lg" onClick={() => setCheckout(true)}>
          Proceed to Payment ($250)
        </Button>
      </div>
    </AppLayout>
  );
}
