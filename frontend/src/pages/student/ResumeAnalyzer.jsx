import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import ScoreRing from '../../components/ui/ScoreRing';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { Upload, CheckCircle, XCircle, Lightbulb, Zap } from 'lucide-react';

// Mock AI result — replace with real API call
const AI_RESULT = {
  score: 72,
  strengths: ['Strong project experience', 'Good technical keywords', 'Clear formatting'],
  weaknesses: ['Missing quantified achievements', 'No GitHub/portfolio link'],
  missing_keywords: ['TypeScript', 'Docker', 'System Design', 'Redis', 'CI/CD'],
  suggestions: [
    'Add metrics to your projects (e.g. "reduced load time by 40%")',
    'Include a link to your GitHub portfolio',
    'Add a skills section with all relevant technologies',
    'Use action verbs at the start of each bullet point',
  ],
};

export default function ResumeAnalyzer() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Resume Analyzer</h1>
          <p className="text-slate-500 text-sm mt-0.5">Upload your resume to get an ATS score and actionable improvements</p>
        </div>

        {/* Upload zone */}
        <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <Upload size={24} className="text-indigo-500" />
          </div>
          <p className="font-semibold text-slate-700">Drop your resume here</p>
          <p className="text-sm text-slate-400 mt-1">PDF • Max 5MB</p>
          <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
        </div>

        {/* AI Result (mock) */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Score ring */}
          <Card className="flex flex-col items-center text-center">
            <p className="font-semibold text-slate-700 mb-4">ATS Score</p>
            <ScoreRing score={AI_RESULT.score} size={130} />
            <p className={`mt-3 text-sm font-semibold ${AI_RESULT.score >= 75 ? 'text-emerald-600' : AI_RESULT.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
              {AI_RESULT.score >= 75 ? 'Strong Resume' : AI_RESULT.score >= 50 ? 'Needs Improvement' : 'Weak Resume'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Based on 150+ ATS parameters</p>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <Card>
              <p className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-1.5">
                <CheckCircle size={14} /> Strengths
              </p>
              <ul className="space-y-2">
                {AI_RESULT.strengths.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <p className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5">
                <XCircle size={14} /> Weaknesses
              </p>
              <ul className="space-y-2">
                {AI_RESULT.weaknesses.map(w => (
                  <li key={w} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Missing Keywords */}
        <Card>
          <p className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-amber-500" /> Missing Keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {AI_RESULT.missing_keywords.map(k => (
              <Badge key={k} color="amber">{k}</Badge>
            ))}
          </div>
          <ProgressBar value={AI_RESULT.score} color="gradient" size="md" showLabel label="Keyword coverage" className="mt-4" />
        </Card>

        {/* Suggestions */}
        <Card>
          <p className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Lightbulb size={16} className="text-indigo-500" /> AI Suggestions
          </p>
          <ol className="space-y-3">
            {AI_RESULT.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-indigo-50/60 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                <p className="text-sm text-slate-700">{s}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </AppLayout>
  );
}
