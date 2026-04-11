import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Download, FileText, UserCircle } from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuth();
  
  // Local state for the resume builder form
  const [profile, setProfile] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    cgpa: user?.cgpa || '',
    skills: user?.skills?.join(', ') || '',
    experience: '',
    projects: ''
  });

  const handleChange = (e) => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleDownload = () => {
    // Basic mock of a PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${profile.name} - Resume</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1 { color: #2c3e50; margin-bottom: 5px; }
            h2 { border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-top: 30px; }
            p { margin: 5px 0; }
            .header { text-align: center; margin-bottom: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${profile.name}</h1>
            <p>${profile.college} | ${profile.branch} | CGPA: ${profile.cgpa}</p>
          </div>
          
          <h2>Skills</h2>
          <p>${profile.skills}</p>
          
          <h2>Experience</h2>
          <p>${profile.experience.replace(/\\n/g, '<br/>') || 'No experience listed.'}</p>
          
          <h2>Projects</h2>
          <p>${profile.projects.replace(/\\n/g, '<br/>') || 'No projects listed.'}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile & Resume Builder</h1>
          <p className="text-slate-500 text-sm">Manage your details and generate a professional resume PDF.</p>
        </div>

        <div className="profile-grid">
          <div className="profile-main-column">
            <Card>
              <h3 className="section-title">
                <UserCircle size={18} />
                Personal Details
              </h3>
              <div className="form-grid">
                <div className="input-group">
                  <label className="label">Full Name</label>
                  <input type="text" name="name" value={profile.name} onChange={handleChange} className="input" />
                </div>
                <div className="input-group">
                  <label className="label">College</label>
                  <input type="text" name="college" value={profile.college} onChange={handleChange} className="input" />
                </div>
                <div className="input-group">
                  <label className="label">Branch</label>
                  <input type="text" name="branch" value={profile.branch} onChange={handleChange} className="input" />
                </div>
                <div className="input-group">
                  <label className="label">CGPA</label>
                  <input type="number" name="cgpa" value={profile.cgpa} onChange={handleChange} className="input" />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="section-title">
                <FileText size={18} />
                Resume Sections
              </h3>
              <div className="flex flex-col gap-4">
                <div className="input-group">
                  <label className="label">Skills (comma separated)</label>
                  <input type="text" name="skills" value={profile.skills} onChange={handleChange} placeholder="React, Node.js, Python..." className="input" />
                </div>
                <div className="input-group">
                  <label className="label">Experience</label>
                  <textarea name="experience" value={profile.experience} onChange={handleChange} rows={4} placeholder="Describe your internships or work experience..." className="input textarea" />
                </div>
                <div className="input-group">
                  <label className="label">Projects</label>
                  <textarea name="projects" value={profile.projects} onChange={handleChange} rows={4} placeholder="List your key projects..." className="input textarea" />
                </div>
              </div>
            </Card>
          </div>

          <div className="profile-side-column">
            <Card className="export-card">
              <div className="export-icon-container">
                <FileText size={28} />
              </div>
              <h3 className="export-title">Export Resume</h3>
              <p className="export-subtitle">Generate a clean, ATS-friendly PDF resume based on your details.</p>
              <Button fullWidth onClick={handleDownload} icon={<Download size={16} />}>Download PDF</Button>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        .profile-grid { display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; }
        @media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } }
        
        .profile-main-column { display: flex; flex-direction: column; gap: 1.5rem; }
        .section-title { font-size: 1rem; font-weight: 700; color: var(--slate-800); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
        .section-title svg { color: var(--primary); }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; } }

        .textarea { resize: none; min-height: 120px; }
        
        .export-card { background: var(--primary-light); border-color: rgba(99, 102, 241, 0.2); text-align: center; display: flex; flex-direction: column; align-items: center; }
        .export-icon-container { width: 64px; height: 64px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); margin-bottom: 1rem; box-shadow: var(--shadow-sm); }
        .export-title { font-weight: 700; color: var(--slate-800); margin-bottom: 0.5rem; }
        .export-subtitle { font-size: 0.75rem; color: var(--slate-600); margin-bottom: 1.5rem; }
      `}</style>
    </AppLayout>
  );
}
