import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Visualizer from './pages/Visualizer';
import DsaHub from './pages/DsaHub';
import QuizArena from './pages/QuizArena';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginModal from './components/LoginModal';
import CodeDoctorModal from './components/CodeDoctorModal';
import AuthGate from './components/AuthGate';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);

  // If user is not logged in, enforce AuthGate so the site is NOT accessible
  if (!user) {
    return <AuthGate />;
  }

  const handleLaunchConcept = (concept) => {
    setSelectedConcept(concept);
    setActiveTab('visualizer');
  };

  const handleApplyDoctorCode = ({ code, language, trace }) => {
    setSelectedConcept({
      id: 'custom',
      title: `🩺 Repaired ${language.toUpperCase()} Code`,
      category: 'AI Auto-Corrected',
      description: 'Automatically diagnosed, repaired, and simulated in 3D WebGL.',
      difficulty: 'Repaired',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code,
    });
    setActiveTab('visualizer');
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#070b14] overflow-hidden">
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCodeDoctor={() => setIsDoctorOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col overflow-hidden pb-14 md:pb-0">
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'visualizer' && (
          <Visualizer initialConcept={selectedConcept} />
        )}
        {activeTab === 'dsa' && (
          <DsaHub onSelectConcept={handleLaunchConcept} />
        )}
        {activeTab === 'quiz' && (
          <QuizArena />
        )}
        {activeTab === 'history' && (
          <HistoryPage />
        )}
        {activeTab === 'settings' && (
          <SettingsPage />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 flex items-center justify-around z-40 select-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition ${
            activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">🏠</span>
          <span className="text-[9px] font-medium">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition ${
            activeTab === 'visualizer' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">🧊</span>
          <span className="text-[9px] font-medium">3D Code</span>
        </button>

        <button
          onClick={() => setActiveTab('dsa')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition ${
            activeTab === 'dsa' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">📚</span>
          <span className="text-[9px] font-medium">DSA Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition ${
            activeTab === 'quiz' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">🏆</span>
          <span className="text-[9px] font-medium">Quiz</span>
        </button>

        <button
          onClick={() => setIsDoctorOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-amber-400 hover:text-amber-300"
        >
          <span className="text-lg">🩺</span>
          <span className="text-[9px] font-medium">AI Doctor</span>
        </button>
      </nav>

      {/* Global Modals */}
      <LoginModal />
      <CodeDoctorModal
        isOpen={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onApplyCorrectedCode={handleApplyDoctorCode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
