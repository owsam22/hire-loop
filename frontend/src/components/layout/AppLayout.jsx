import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main area */}
      <div className="main-content">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="scroll-area">
          <div className="page-container fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
