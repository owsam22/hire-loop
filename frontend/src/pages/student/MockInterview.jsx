import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import { MessageSquare, Send, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const ROLES = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Data Scientist', 'Product Manager'];

const MOCK_QUESTION = "Explain how you would design a URL shortener system like bit.ly. Walk me through your architecture choices, database design, and how you'd handle scaling to 100M+ users.";

export default function MockInterview() {
  const [step, setStep] = useState('select'); // select | question | result
  const [role, setRole] = useState(null);
  const [answer, setAnswer] = useState('');
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startInterview = () => {
    if (!role) return;
    setStep('question');
  };

  const submitAnswer = async () => {
    setLoading(true);
    try {
      const data = await api.post('/ai/interview', {
        question: MOCK_QUESTION,
        answer,
        role
      });
      setResult(data);
      setStep('result');
    } catch (err) {
      console.error(err);
      alert('Failed to evaluate answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mock Interview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Practice answering technical questions and get AI feedback.</p>
        </div>

        {step === 'select' && (
          <Card>
            <p className="font-semibold text-slate-800 mb-4 text-center">Select your target role</p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    role === r 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <Button size="lg" disabled={!role} onClick={startInterview}>
                Start Interview
              </Button>
            </div>
          </Card>
        )}

        {step === 'question' && (
          <div className="space-y-4">
            <Card className="bg-indigo-50/50 border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-900 mb-1">AI Interviewer</p>
                  <p className="text-indigo-950 font-medium leading-relaxed">{MOCK_QUESTION}</p>
                </div>
              </div>
            </Card>

            <Card>
              <p className="font-semibold text-slate-700 mb-3 text-sm">Your Response</p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                placeholder="Type your answer here..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
              <div className="flex justify-end mt-4">
                <Button onClick={submitAnswer} loading={loading} disabled={answer.length < 10}>
                   {loading ? 'Evaluating...' : 'Submit Answer'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-6 slide-in">
             <div className="flex justify-end">
                <Button variant="ghost" onClick={() => { setStep('select'); setAnswer(''); setRole(null); setResult(null); }}>Start New Interview</Button>
             </div>

             <div className="grid sm:grid-cols-3 gap-6">
               <Card className="flex flex-col items-center text-center">
                 <ScoreRing score={result.score * 10} size={110} />
                 <h3 className="text-lg font-bold text-slate-800 mt-3">Score: {result.score}/10</h3>
                 <p className="text-xs text-slate-500 mt-1">Acceptable response</p>
               </Card>

               <div className="sm:col-span-2 space-y-4">
                  <Card padding={false} className="overflow-hidden">
                    <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-emerald-700 font-medium text-sm">
                       <CheckCircle size={16} /> What you did well
                    </div>
                    <ul className="p-4 space-y-2">
                       {result.strengths.map(s => <li key={s} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> {s}</li>)}
                    </ul>
                  </Card>
                  
                  <Card padding={false} className="overflow-hidden">
                    <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-700 font-medium text-sm">
                       <XCircle size={16} /> Mistakes & Omissions
                    </div>
                    <ul className="p-4 space-y-2">
                       {result.mistakes.map(s => <li key={s} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span> {s}</li>)}
                    </ul>
                  </Card>
               </div>
             </div>

             <Card>
               <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold">
                 <Lightbulb size={18} /> How to improve this answer
               </div>
               <div className="space-y-3">
                  {result.improvements.map((s, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                       <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-xs text-indigo-500 flex-shrink-0">
                         {i+1}
                       </div>
                       <p className="text-sm text-slate-700 leading-relaxed">{s}</p>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
