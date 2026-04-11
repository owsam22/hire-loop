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
          <p>${profile.experience.replace(/\n/g, '<br/>') || 'No experience listed.'}</p>
          
          <h2>Projects</h2>
          <p>${profile.projects.replace(/\n/g, '<br/>') || 'No projects listed.'}</p>
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile & Resume Builder</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your details and generate a professional resume PDF.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <UserCircle size={18} className="text-indigo-500" />
                Personal Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                  <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">College</label>
                  <input type="text" name="college" value={profile.college} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Branch</label>
                  <input type="text" name="branch" value={profile.branch} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">CGPA</label>
                  <input type="number" name="cgpa" value={profile.cgpa} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <FileText size={18} className="text-indigo-500" />
                Resume Sections
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Skills (comma separated)</label>
                  <input type="text" name="skills" value={profile.skills} onChange={handleChange} placeholder="React, Node.js, Python..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Experience</label>
                  <textarea name="experience" value={profile.experience} onChange={handleChange} rows={4} placeholder="Describe your internships or work experience..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Projects</label>
                  <textarea name="projects" value={profile.projects} onChange={handleChange} rows={4} placeholder="List your key projects..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none resize-none" />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-indigo-50/50 border-indigo-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-500 mb-3 shadow-sm">
                <FileText size={28} />
              </div>
              <h3 className="font-semibold text-indigo-900">Export Resume</h3>
              <p className="text-xs text-indigo-700/70 mt-1 mb-4">Generate a clean, ATS-friendly PDF resume based on your details.</p>
              <Button fullWidth onClick={handleDownload} icon={<Download size={16} />}>Download PDF</Button>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
