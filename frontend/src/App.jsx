import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/LandingPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import JobListings from './pages/student/JobListings';
import MyApplications from './pages/student/MyApplications';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import MockInterview from './pages/student/MockInterview';
import StudentProfile from './pages/student/StudentProfile';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import MyJobListings from './pages/recruiter/MyJobListings';
import ApplicantTracker from './pages/recruiter/ApplicantTracker';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import JobApprovals from './pages/admin/JobApprovals';

// Protected route wrapper
function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

// Stub page for routes not yet built
function ComingSoon({ title }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-slate-700">{title}</h2>
        <p className="text-slate-400 text-sm mt-2">Coming soon in the next build step</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Root → Landing Page (public feed) or redirect to dashboard */}
      <Route
        path="/"
        element={
          user
            ? <Navigate to={`/${user.role}`} replace />
            : <LandingPage />
        }
      />
      
      {/* Login Page */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to={`/${user.role}`} replace />
            : <LoginPage />
        }
      />

      {/* ─── Student ─── */}
      <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/jobs" element={<ProtectedRoute allowedRole="student"><JobListings /></ProtectedRoute>} />
      <Route path="/student/applications" element={<ProtectedRoute allowedRole="student"><MyApplications /></ProtectedRoute>} />
      <Route path="/student/resume" element={<ProtectedRoute allowedRole="student"><ResumeAnalyzer /></ProtectedRoute>} />
      <Route path="/student/interview" element={<ProtectedRoute allowedRole="student"><MockInterview /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>} />

      {/* ─── Recruiter ─── */}
      <Route path="/recruiter" element={<ProtectedRoute allowedRole="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
      <Route path="/recruiter/post-job" element={<ProtectedRoute allowedRole="recruiter"><PostJob /></ProtectedRoute>} />
      <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRole="recruiter"><MyJobListings /></ProtectedRoute>} />
      <Route path="/recruiter/applicants" element={<ProtectedRoute allowedRole="recruiter"><ApplicantTracker /></ProtectedRoute>} />
      <Route path="/recruiter/analytics" element={<ProtectedRoute allowedRole="recruiter"><ComingSoon title="Recruiter Analytics" /></ProtectedRoute>} />

      {/* ─── Admin ─── */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Student Management" /></ProtectedRoute>} />
      <Route path="/admin/companies" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Company Management" /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute allowedRole="admin"><JobApprovals /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Announcements" /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><ComingSoon title="Settings" /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
