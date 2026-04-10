import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import Badge from '../../components/ui/Badge';
import { MessageSquare, Send, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

const ROLES = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Data Scientist', 'Product Manager'];

const MOCK_QUESTION = "Explain how you would design a URL shortener system like bit.ly. Walk me through your architecture choices, database design, and how you'd handle scaling to 100M+ users.";

const MOCK_EVAL = {
  score: 7,
  strengths: ['Good high-level architecture', 'Mentioned caching correctly', 'Considered scalability'],
  mistakes: ['Did not mention hash collision handling', 'Skipped analytics tracking'],
  improvements: ['Discuss sharding strategy for the database', 'Explain rate limiting to prevent abuse', 'Add CDN layer for global latency'],
};

export default function MockInterview() {
  const [step, setStep] = useState('select'); // select | question | result
  const [role, setRole] = useState(null);
  const [answer, setAnswer] = useState('');

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Mock Interview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Practice with AI-generated questions and get instant evaluation</p>
        </div>

        {step === 'select' && (
          <Card>
            <p className="font-semibold text-slate-700 mb-4">Select Interview Role</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                    role === r ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <Button fullWidth className="mt-5" disabled={!role} onClick={() => setStep('question')}>
              Start Interview
            </Button>
          </Card>
        )}

        {step === 'question' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-indigo-500 font-medium mb-0.5">AI Interviewer · {role}</p>
                <p className="text-slate-800 text-sm font-medium">{MOCK_QUESTION}</p>
              </div>
            </div>

            <Card>
              <p className="text-sm font-semibold text-slate-700 mb-3">Your Answer</p>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                rows={8}
                placeholder="Type your answer here... Be as detailed as possible."
                className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-400">{answer.length} characters</span>
                <Button disabled={answer.length < 50} onClick={() => setStep('result')} icon={<Send size={14} />}>
                  Submit for Evaluation
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-5">
            <Card className="flex flex-col items-center text-center">
              <p className="font-semibold text-slate-700 mb-3">Your Score</p>
              <ScoreRing score={MOCK_EVAL.score * 10} size={120} label="/ 10" />
              <p className="mt-2 text-2xl font-bold text-slate-800">{MOCK_EVAL.score} <span className="text-base font-normal text-slate-400">/ 10</span></p>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <p className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-1.5"><CheckCircle size={14} /> Strengths</p>
                <ul className="space-y-2">
                  {MOCK_EVAL.strengths.map(s => (
                    <li key={s} className="flex gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <p className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5"><XCircle size={14} /> Mistakes</p>
                <ul className="space-y-2">
                  {MOCK_EVAL.mistakes.map(m => (
                    <li key={m} className="flex gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />{m}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card>
              <p className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Lightbulb size={16} className="text-indigo-500" /> How to Improve</p>
              <ol className="space-y-2">
                {MOCK_EVAL.improvements.map((imp, i) => (
                  <li key={i} className="flex gap-3 p-3 bg-indigo-50/60 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                    <p className="text-sm text-slate-700">{imp}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Button fullWidth variant="secondary" onClick={() => { setStep('select'); setAnswer(''); setRole(null); }}>
              Try Another Question
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
