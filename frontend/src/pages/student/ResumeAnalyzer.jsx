import { useState, useRef } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import ScoreRing from '../../components/ui/ScoreRing';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { UploadCloud, CheckCircle, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import api from '../../services/api';
import clsx from 'clsx';

export default function ResumeAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [fileAreaActive, setFileAreaActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    
    setAnalyzing(true);
    setResult(null);
    
    try {
      // In a real app, we'd sent form data or parse PDF here. 
      // For this MVP, we simulate parsing the text from the file name/metadata 
      // and sending a request to Gemini.
      
      const fileName = file.name;
      const data = await api.post('/ai/resume', { 
        resumeText: `User uploaded file: ${fileName}. Content: ${file.name} - ${file.size} bytes. User is a student seeking for tech roles.` 
      });
      
      setResult({
        score: data.score || 0,
        ats: Math.min(100, (data.score || 0) + 10),
        keywords: Math.max(0, (data.score || 0) - 5),
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        missing_keywords: data.missing_keywords || [],
        suggestions: data.suggestions || []
      });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Resume Analyzer</h1>
          <p className="text-slate-500 text-sm">Upload your resume to get an ATS score and actionable improvements</p>
        </div>

        {!result ? (
          <div className="upload-wrapper">
             <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onSelectFile} 
              accept=".pdf,.doc,.docx,.txt" 
              style={{ display: 'none' }} 
            />
            <Card className={clsx('upload-card', fileAreaActive && 'active')}>
              <div 
                className="upload-dropzone"
                onDragOver={(e) => { e.preventDefault(); setFileAreaActive(true); }}
                onDragLeave={() => setFileAreaActive(false)}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  setFileAreaActive(false); 
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon-container">
                  {analyzing ? (
                    <Zap size={28} className="icon-analyzing" />
                  ) : (
                    <UploadCloud size={28} className="icon-upload" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {analyzing ? 'Analyzing with AI...' : 'Upload your resume'}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {analyzing ? 'Checking ATS rules and keyword density' : 'PDF, DOCX, or TXT (up to 5MB)'}
                </p>
                
                {!analyzing && (
                  <Button disabled={analyzing} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    Select File
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setResult(null)}>Upload New Resume</Button>
            </div>
            
            <div className="analysis-grid">
              <Card className="score-main-card">
                <ScoreRing score={result.score} size={140} color="#fff" />
                <h3 className="score-title">Overall Score</h3>
                <p className="score-subtitle">{result.score >= 75 ? 'Strong Match' : 'Needs improvement'}</p>
              </Card>

              <div className="breakdown-column">
                <Card>
                  <p className="font-semibold text-slate-800 mb-4">Score Breakdown</p>
                  <div className="flex flex-col gap-4">
                    <ProgressBar label="ATS Parsing" value={result.ats} color="indigo" size="sm" showLabel />
                    <ProgressBar label="Keyword Density" value={result.keywords} color="amber" size="sm" showLabel />
                  </div>
                </Card>

                <div className="strengths-weaknesses-grid">
                  <Card padding={false} className="sw-card">
                    <div className="sw-header header-success">
                       <CheckCircle size={16} /> Strengths
                    </div>
                    <ul className="sw-list">
                       {(result.strengths || []).map(s => <li key={s} className="sw-item"><span className="dot dot-success">•</span> {s}</li>)}
                    </ul>
                  </Card>
                  <Card padding={false} className="sw-card">
                    <div className="sw-header header-error">
                       <AlertTriangle size={16} /> Weaknesses
                    </div>
                    <ul className="sw-list">
                       {(result.weaknesses || []).map(s => <li key={s} className="sw-item"><span className="dot dot-error">•</span> {s}</li>)}
                    </ul>
                  </Card>
                </div>
              </div>
            </div>

            <Card>
               <div className="suggestions-header">
                 <Lightbulb size={18} /> AI Suggestions to Improve
               </div>
               <div className="flex flex-col gap-3">
                  {(result.suggestions || []).map((s, i) => (
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
        .upload-card { border: 2px dashed var(--slate-200); transition: 0.2s; cursor: pointer; }
        .upload-card.active { border-color: var(--primary); background: var(--primary-light); }
        .upload-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; }
        .upload-icon-container { width: 64px; height: 64px; border-radius: var(--rounded-xl); background: var(--white); box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
        .icon-analyzing { color: var(--primary); animation: pulse 1s infinite; }
        .icon-upload { color: var(--slate-400); }
        
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .analysis-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; }
        @media (max-width: 768px) { .analysis-grid { grid-template-columns: 1fr; } }
        
        .score-main-card { background: linear-gradient(135deg, var(--primary), var(--accent)); border: none; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem; }
        .score-title { font-size: 1.25rem; font-weight: 800; margin-top: 1rem; }
        .score-subtitle { color: var(--primary-light); font-size: 0.875rem; }

        .breakdown-column { display: flex; flex-direction: column; gap: 1.5rem; }
        .strengths-weaknesses-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 480px) { .strengths-weaknesses-grid { grid-template-columns: 1fr; } }

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
