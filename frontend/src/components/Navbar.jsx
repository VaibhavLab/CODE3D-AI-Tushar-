import React, { useState, useEffect } from 'react';
import { Box, Layers, HelpCircle, History, Settings, Play, Home, Code2, Stethoscope, User, LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { checkBackendHealth } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenCodeDoctor }) {
  const [backendOnline, setBackendOnline] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, openLoginModal, loginAsDemo } = useAuth();

  useEffect(() => {
    checkBackendHealth().then((online) => setBackendOnline(online));
    const interval = setInterval(() => {
      checkBackendHealth().then((online) => setBackendOnline(online));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, enabled: true },
    { id: 'visualizer', label: 'Visualizer', icon: Code2, enabled: true },
    { id: 'dsa', label: 'DSA Hub', icon: Layers, enabled: true },
    { id: 'quiz', label: 'Quiz Arena', icon: HelpCircle, enabled: true },
    { id: 'history', label: 'History', icon: History, enabled: true },
    { id: 'settings', label: 'Settings', icon: Settings, enabled: true },
  ];

  return (
    <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between z-30 sticky top-0 select-none">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
          <Box className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-wider text-white font-sans">
              CODE<span className="text-cyan-400">3D</span> <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded px-1.5 py-0.2 font-mono">AI</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline tracking-tight -mt-0.5">
            Don't just read the code. See the code execute.
          </span>
        </div>
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-cyan-400' : ''} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Side: AI Code Doctor, Status, User Auth */}
      <div className="flex items-center gap-2">
        {/* Dedicated AI Code Doctor Button */}
        {onOpenCodeDoctor && (
          <button
            onClick={onOpenCodeDoctor}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition shadow-sm"
            title="AI Code Doctor: Auto-fix broken code and visualize in 3D"
          >
            <Stethoscope size={13} className="text-amber-400" />
            <span className="hidden sm:inline">AI Code Doctor</span>
          </button>
        )}

        {/* Backend Online status badge */}
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-full px-2.5 py-1 text-xs">
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="text-slate-400 text-[10px] font-mono">
            {backendOnline ? 'Spring Boot Active' : 'Standalone'}
          </span>
        </div>

        {/* User Profile / Login System */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.fullName || user.username}
                className="w-6 h-6 rounded-full object-cover border border-cyan-500/40"
              />
              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="text-[11px] font-bold text-slate-200 leading-tight">
                  {user.fullName ? user.fullName.split(' ')[0] : user.username}
                </span>
                <span className="text-[9px] font-mono text-cyan-400 leading-none">
                  {user.role || 'Student'}
                </span>
              </div>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs animate-fadeIn">
                <div className="p-2 border-b border-slate-800">
                  <p className="font-bold text-white text-xs">{user.fullName || user.username}</p>
                  <p className="text-[10px] font-mono text-slate-400">{user.email || `${user.username}@code3d.edu`}</p>
                  <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {user.role || 'Student Developer'}
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      loginAsDemo();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <Sparkles size={12} className="text-cyan-400" />
                    <span>Switch to Demo Architect</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-red-950/60 text-red-400 flex items-center gap-2"
                  >
                    <LogOut size={12} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition shadow-sm shadow-cyan-500/20"
          >
            <User size={13} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
