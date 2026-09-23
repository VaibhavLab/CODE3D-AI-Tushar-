import React, { useState, lazy, Suspense } from 'react';
import AuthGate from './components/AuthGate';
import { BACKEND_BASE_URL } from './services/apiService';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
const Visualizer = lazy(() => import('./pages/Visualizer'));
const DsaHub = lazy(() => import('./pages/DsaHub'));
const QuizArena = lazy(() => import('./pages/QuizArena'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
import LoginModal from './components/LoginModal';
const CodeDoctorModal = lazy(() => import('./components/CodeDoctorModal'));

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function MainApp() {
  const { user } = useAuth();
  const { isBright } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);

  if (BACKEND_BASE_URL && !user) return <AuthGate />;

  const handleLaunchConcept = (concept) => {
    setSelectedConcept(concept);
    setActiveTab('visualizer');
  };

  const handleApplyDoctorCode = ({ code, language, trace, problemTitle, timeComplexity, spaceComplexity }) => {
    setSelectedConcept({
      id: 'personal-problem',
      title: problemTitle ? `💡 ${problemTitle}` : `💡 Personal Problem (${(language || 'java').toUpperCase()})`,
      category: 'Personal Problem',
      description: 'Custom personal problem solved and fully simulated in 3D WebGL.',
      difficulty: 'Custom',
      timeComplexity: timeComplexity || 'O(n)',
      spaceComplexity: spaceComplexity || 'O(1)',
      code,
      language: language || 'java',
      trace: trace || null,
    });
    setActiveTab('visualizer');
  };

  const handleRerunFromHistory = (record) => {
    setSelectedConcept({
      id: record.conceptId || 'history-run',
      title: record.programTitle,
      category: 'History Replay',
      description: `Recorded execution on ${record.executedAt}. Restored into 3D Studio.`,
      code: record.code || '',
      language: record.language || 'java',
    });
    setActiveTab('visualizer');
  };

  return (
    <div className={`flex flex-col h-[100dvh] w-full overflow-hidden transition-colors duration-200 ${
      isBright ? 'bg-slate-50 text-slate-900' : 'bg-[#070b14] text-slate-100'
    }`}>

      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCodeDoctor={() => setIsDoctorOpen(true)}
        onOpenPersonalProblem={() => setIsDoctorOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 min-h-0 flex flex-col overflow-auto">
        <Suspense fallback={<div role="status" className="m-auto text-sm text-cyan-500">Loading workspace...</div>}>
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'visualizer' && (
          <Visualizer initialConcept={selectedConcept} />
        )}
        {activeTab === 'dsa' && (
          <DsaHub initialTab="curriculum" onSelectConcept={handleLaunchConcept} />
        )}
        {activeTab === 'striver' && (
          <DsaHub initialTab="striver" onSelectConcept={handleLaunchConcept} />
        )}
        {activeTab === 'quiz' && (
          <QuizArena />
        )}
        {activeTab === 'history' && (
          <HistoryPage onRerunProgram={handleRerunFromHistory} />
        )}
        {activeTab === 'settings' && (
          <SettingsPage />
        )}
        </Suspense>
      </main>

      {/* Global Modals */}
      <LoginModal />
      {isDoctorOpen && <Suspense fallback={null}><CodeDoctorModal
        isOpen={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
        onApplyCorrectedCode={handleApplyDoctorCode}
      /></Suspense>}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

