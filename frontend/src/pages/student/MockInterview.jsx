import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import { MessageSquare, Send, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import clsx from 'clsx';

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
      <div className="max-w-3xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mock Interview</h1>
          <p className="text-slate-500 text-sm">Practice answering technical questions and get AI feedback.</p>
        </div>

        {step === 'select' && (
          <Card className="select-role-card">
            <p className="font-semibold text-slate-800 mb-6 text-center">Select your target role</p>
            <div className="roles-grid mb-8">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={clsx('role-tab', role === r && 'active')}
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
          <div className="flex flex-col gap-4">
            <Card className="interviewer-card">
              <div className="flex items-start gap-4">
                <div className="interviewer-avatar">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary mb-1">AI Interviewer</p>
                  <p className="question-text">{MOCK_QUESTION}</p>
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
                className="input textarea"
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
          <div className="flex flex-col gap-6 fade-up">
             <div className="flex justify-end">
                <Button variant="ghost" onClick={() => { setStep('select'); setAnswer(''); setRole(null); setResult(null); }}>Start New Interview</Button>
             </div>

             <div className="analysis-grid">
               <Card className="flex flex-col items-center text-center">
                 <ScoreRing score={result.score * 10} size={110} />
                 <h3 className="text-lg font-bold text-slate-800 mt-3">Score: {result.score}/10</h3>
                 <p className="text-xs text-slate-500">Acceptable response</p>
               </Card>

               <div className="breakdown-column gap-4">
                  <Card padding={false} className="sw-card">
                    <div className="sw-header header-success">
                       <CheckCircle size={16} /> What you did well
                    </div>
                    <ul className="sw-list">
                       {result.strengths.map(s => <li key={s} className="sw-item"><span className="dot dot-success">•</span> {s}</li>)}
                    </ul>
                  </Card>
                  
                  <Card padding={false} className="sw-card">
                    <div className="sw-header header-error">
                       <XCircle size={16} /> Mistakes & Omissions
                    </div>
                    <ul className="sw-list">
                       {result.mistakes.map(s => <li key={s} className="sw-item"><span className="dot dot-error">•</span> {s}</li>)}
                    </ul>
                  </Card>
               </div>
             </div>

             <Card>
               <div className="suggestions-header">
                 <Lightbulb size={18} /> How to improve this answer
               </div>
               <div className="flex flex-col gap-3">
                  {result.improvements.map((s, i) => (
                    <div key={i} className="suggestion-item">
                       <div className="suggestion-num">
                         {i+1}
                       </div>
                       <p className="text-sm text-slate-700">{s}</p>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        )}
      </div>

      <style>{`
        .roles-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
        .role-tab { padding: 0.5rem 1rem; border-radius: var(--rounded-xl); font-size: 0.875rem; font-weight: 500; background: var(--slate-50); border: 1px solid var(--slate-200); color: var(--slate-600); transition: 0.2s; }
        .role-tab:hover { border-color: var(--primary); color: var(--primary); }
        .role-tab.active { background: var(--primary); color: var(--white); border-color: var(--primary); box-shadow: var(--shadow-indigo); }
        
        .interviewer-card { background: var(--primary-light); border-color: rgba(99, 102, 241, 0.2); }
        .interviewer-avatar { width: 40px; height: 40px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; }
        .question-text { font-weight: 500; color: var(--slate-800); line-height: 1.6; }
        .textarea { resize: none; min-height: 200px; }
        
        .analysis-grid { display: grid; grid-template-columns: 1fr 2.5fr; gap: 1.5rem; }
        @media (max-width: 640px) { .analysis-grid { grid-template-columns: 1fr; } }

        .breakdown-column { display: flex; flex-direction: column; }
        .sw-card { overflow: hidden; }
        .sw-header { padding: 0.625rem 1rem; font-size: 0.875rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .header-success { background: #d1fae5; color: #065f46; }
        .header-error { background: #fee2e2; color: #991b1b; }
        .sw-list { padding: 1rem; list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
        .sw-item { font-size: 0.875rem; color: var(--slate-600); display: flex; items-start: center; gap: 0.5rem; }
        .dot { font-weight: bold; }
        .dot-success { color: var(--success); }
        .dot-error { color: var(--error); }

        .suggestions-header { color: var(--primary); font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
        .suggestion-item { display: flex; gap: 1rem; padding: 1rem; background: var(--slate-50); border-radius: var(--rounded-xl); border: 1px solid var(--slate-100); }
        .suggestion-num { min-width: 24px; height: 24px; border-radius: 50%; background: var(--white); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: var(--primary); box-shadow: var(--shadow-sm); flex-shrink: 0; }
      `}</style>
    </AppLayout>
  );
}
