import React from 'react';
import { Settings, Cpu, HardDrive, CheckCircle2, ShieldCheck, Terminal, Layers } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#070b14] text-slate-100 p-6 md:p-10 select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono font-medium mb-2">
            <Settings size={13} />
            <span>Platform Configuration &amp; Diagnostics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">System Settings &amp; Health</h1>
          <p className="text-xs text-slate-400 mt-1">
            Environment specifications, compiler runtimes, and 3D rendering configurations.
          </p>
        </div>

        {/* Runtime Stack Info */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu size={16} className="text-cyan-400" />
            <span>Active Software Runtimes</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-slate-500 uppercase text-[10px]">Java Compiler &amp; Runtime</div>
              <div className="text-white font-bold">Java(TM) SE Runtime 21.0.12 LTS</div>
              <div className="text-emerald-400 text-[11px] flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} /> JDK 21 Active
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-slate-500 uppercase text-[10px]">Backend Server</div>
              <div className="text-white font-bold">Spring Boot 3.2.4 (Apache Tomcat 10.1)</div>
              <div className="text-emerald-400 text-[11px] flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} /> Port 8080 (REST + JPA)
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-slate-500 uppercase text-[10px]">Frontend Bundler</div>
              <div className="text-white font-bold">Vite 5.4 + React 18</div>
              <div className="text-emerald-400 text-[11px] flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} /> Port 5173 (HMR Active)
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="text-slate-500 uppercase text-[10px]">3D Graphics Pipeline</div>
              <div className="text-white font-bold">Three.js + React Three Fiber 8</div>
              <div className="text-cyan-400 text-[11px] flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} /> WebGL 2.0 Hardware Accelerated
              </div>
            </div>
          </div>
        </div>

        {/* Security & Sandboxing Info */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Code Execution Sandbox &amp; Security Protocol</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            In compliance with Section 29, user-submitted code is first verified through JavaParser AST validation.
            The backend rejects filesystem operations, reflection, network requests, and dangerous system calls,
            executing only controlled AST program models within an isolated simulation sandbox.
          </p>
        </div>

        {/* Exhibition Info */}
        <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900/60 border border-cyan-800/40 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Student Technology Exhibition Build</h3>
            <p className="text-xs text-slate-400 font-sans">
              Designed for high-impact live student demonstrations, interactive code walkthroughs, and Big-O complexity explanations.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-500 text-slate-950 px-3 py-1.5 rounded-lg shrink-0">
            v1.0 Release
          </span>
        </div>
      </div>
    </div>
  );
}
