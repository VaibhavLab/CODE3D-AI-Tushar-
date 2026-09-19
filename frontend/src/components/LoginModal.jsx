import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Sparkles, ShieldCheck, UserCheck, Key, Mail, User } from 'lucide-react';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login, register, loginAsDemo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Student Developer');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register({ username, email, password, fullName, role });
        if (res.success) {
          closeLoginModal();
        } else {
          setError(res.message);
        }
      } else {
        const res = await login({ username: username || email, password });
        if (res.success) {
          closeLoginModal();
        } else {
          setError(res.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginAsDemo();
      closeLoginModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#090d16] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {isRegister ? 'Create CODE3D Account' : 'Welcome to CODE3D AI'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRegister ? 'Join the next-gen 3D code execution platform' : 'Sign in to access your saved execution history'}
              </p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-md transition"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>⚡ 1-Click Demo Login (Lead Architect)</span>
          </button>

          <div className="flex items-center gap-2 my-2 text-slate-600 text-[11px]">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span>or continue with credentials</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Himanshu Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#050811] border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Exhibition Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Student Developer">Student Developer</option>
                    <option value="Exhibition Evaluator">Exhibition Evaluator / Judge</option>
                    <option value="Lead Architect">Lead Architect</option>
                    <option value="Guest Explorer">Guest Explorer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Username</label>
              <div className="relative">
                <UserCheck size={13} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. himanshu"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. himanshu@code3d.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050811] border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Key size={13} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/25 disabled:opacity-50 mt-2"
            >
              {isRegister ? <UserPlus size={14} /> : <LogIn size={14} />}
              <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
            </button>
          </form>

          {/* Switch between Login and Register */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
