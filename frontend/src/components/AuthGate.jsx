import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  UserPlus,
  Sparkles,
  ShieldCheck,
  Box,
  Cpu,
  Layers,
  CheckCircle2,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function AuthGate() {
  const { login, register, loginAsDemo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Student Developer');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!username || !email || !password) {
          setError('Please fill all required fields');
          setLoading(false);
          return;
        }
        const res = await register({ username, email, password, fullName: fullName || username, role });
        if (!res.success) {
          setError(res.message || 'Registration failed');
        }
      } else {
        if (!username || !password) {
          setError('Please enter username/email and password');
          setLoading(false);
          return;
        }
        const res = await login({ username, password });
        if (!res.success) {
          setError(res.message || 'Invalid username or password');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    try {
      await loginAsDemo();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060911] text-slate-100 flex flex-col justify-between overflow-x-hidden overflow-y-auto selection:bg-cyan-500/30">
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Simple Header */}
      <header className="relative z-10 w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-900 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Box size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-wider text-white">CODE3D <span className="text-cyan-400">AI</span></h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">Algorithm & AST 3D Visualizer</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] font-mono">
          <Database size={11} className="animate-pulse" />
          <span>Neon DB: Live</span>
        </div>
      </header>

      {/* Main Center Content: On mobile, Form Card shows at the top! */}
      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-10">
        
        {/* Left Side: Product Value & Exhibition Info */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            <Lock size={12} />
            <span>Authentication Required to Access Visualizer</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            See Algorithms Execute in <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">3D Spatial Canvas</span>
          </h2>

          <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
            CODE3D AI compiles and steps through <span className="text-slate-200 font-semibold">Java, Python, C, C++, and JavaScript</span> programs into interactive 3D WebGL scenes with automated error diagnosis and AST memory traces.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Box size={16} className="text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">17 Full DSA Concepts</p>
                <p className="text-[11px] text-slate-400">Arrays, Trees, Graphs, AVL, Knapsack, Queues</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Cpu size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">AI Code Doctor</p>
                <p className="text-[11px] text-slate-400">Auto-repairs syntax bugs & loop boundaries</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Layers size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">5-Language AST</p>
                <p className="text-[11px] text-slate-400">Java, Python, C, C++, and ES2024 JavaScript</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Database size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">Live Cloud Database</p>
                <p className="text-[11px] text-slate-400">AWS Neon PostgreSQL table 'users' & runs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="w-full max-w-md bg-[#090d18] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/40 p-6 sm:p-7 relative">
          
          {/* Form Tabs */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-5">
            <button
              onClick={() => { setIsRegister(false); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                !isRegister
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                isRegister
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus size={13} />
              <span>Register</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                {isRegister ? 'Username *' : 'Username or Email'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isRegister ? 'e.g. himanshu' : 'himanshu or student.alex'}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Your Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Student Developer">Student Developer</option>
                  <option value="Lead Architect">Lead Architect</option>
                  <option value="Exhibition Evaluator">Exhibition Evaluator / Judge</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Enter' : 'Sign In to Workspace'}</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-[#090d18] px-2 text-slate-500">Or Instant Evaluation</span></div>
          </div>

          {/* 1-Click Demo Login */}
          <button
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 hover:from-emerald-600/30 hover:to-cyan-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-emerald-400" />
            <span>⚡ 1-Click Demo Login (Himanshu - Architect)</span>
          </button>

          <p className="text-[10px] text-center text-slate-500 mt-3 font-mono">
            Default test account: <span className="text-slate-400">himanshu</span> / <span className="text-slate-400">admin123</span>
          </p>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="relative z-10 w-full py-3 px-6 text-center text-[11px] text-slate-600 font-mono border-t border-slate-900">
        CODE3D AI • Powered by Spring Boot 3.2, Three.js & Neon Cloud PostgreSQL
      </footer>
    </div>
  );
}
