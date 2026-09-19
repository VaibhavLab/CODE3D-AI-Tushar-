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
    <div className="flex flex-col h-screen w-screen bg-[#070b14] overflow-hidden">
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCodeDoctor={() => setIsDoctorOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
