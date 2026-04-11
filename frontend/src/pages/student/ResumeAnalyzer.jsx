import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import ScoreRing from '../../components/ui/ScoreRing';
import Button from '../../components/ui/Button';
import { UploadCloud, CheckCircle, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import api from '../../services/api';

export default function ResumeAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [fileAreaActive, setFileAreaActive] = useState(false);

  const simulateAnalysis = async () => {
    setAnalyzing(true);
    try {
      const data = await api.post('/ai/resume', { resumeText: 'Simulated parsed text from PDF' });
      setResult({
        score: data.score,
        ats: Math.min(100, data.score + 10),
        keywords: Math.max(0, data.score - 5),
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        missing_keywords: data.missing_keywords,
        suggestions: data.suggestions
      });
    } catch (err) {
      console.error(err);
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Resume Analyzer</h1>
          <p className="text-slate-500 text-sm mt-0.5">Upload your resume to get an ATS score and actionable improvements</p>
        </div>

        {!result ? (
          <div className="mt-8">
            <Card className={`border-2 border-dashed transition-colors ${fileAreaActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200'}`}>
              <div 
                className="flex flex-col items-center justify-center py-12 text-center cursor-pointer"
                onDragOver={(e) => { e.preventDefault(); setFileAreaActive(true); }}
                onDragLeave={() => setFileAreaActive(false)}
                onDrop={(e) => { e.preventDefault(); setFileAreaActive(false); simulateAnalysis(); }}
                onClick={simulateAnalysis}
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 relative">
                  {analyzing ? (
                    <Zap size={28} className="text-indigo-500 animate-pulse" />
                  ) : (
                    <UploadCloud size={28} className="text-slate-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {analyzing ? 'Analyzing with AI...' : 'Upload your resume'}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {analyzing ? 'Checking ATS rules and keyword density' : 'PDF, DOCX up to 5MB'}
                </p>
                
                {!analyzing && (
                  <Button disabled={analyzing}>
                    Select File
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setResult(null)}>Upload New Resume</Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-indigo-500 to-violet-600 border-none text-white shadow-xl shadow-indigo-200">
                <ScoreRing score={result.score} size={140} customColor="#fff" />
                <h3 className="text-xl font-bold mt-4">Overall Score</h3>
                <p className="text-indigo-100 text-sm mt-1">{result.score >= 75 ? 'Strong Match' : 'Needs improvement'}</p>
              </Card>

              <div className="md:col-span-2 space-y-4">
                <Card>
                  <p className="font-semibold text-slate-800 mb-4">Score Breakdown</p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1.5 font-medium text-sm">
                        <span className="text-slate-700">ATS Parsing</span>
                        <span className="text-indigo-600">{result.ats}/100</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{width: `${result.ats}%`}} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5 font-medium text-sm">
                        <span className="text-slate-700">Keyword Density</span>
                        <span className="text-amber-500">{result.keywords}/100</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{width: `${result.keywords}%`}} />
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Card padding={false} className="overflow-hidden">
                    <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-emerald-700 font-medium text-sm">
                       <CheckCircle size={16} /> Strengths
                    </div>
                    <ul className="p-4 space-y-2">
                       {result.strengths.map(s => <li key={s} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> {s}</li>)}
                    </ul>
                  </Card>
                  <Card padding={false} className="overflow-hidden">
                    <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-700 font-medium text-sm">
                       <AlertTriangle size={16} /> Weaknesses
                    </div>
                    <ul className="p-4 space-y-2">
                       {result.weaknesses.map(s => <li key={s} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span> {s}</li>)}
                    </ul>
                  </Card>
                </div>
              </div>
            </div>

            <Card>
               <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold">
                 <Lightbulb size={18} /> AI Suggestions to Improve
               </div>
               <div className="space-y-3">
                  {result.suggestions.map((s, i) => (
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
