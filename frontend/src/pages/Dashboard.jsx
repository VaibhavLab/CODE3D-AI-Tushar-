import React from 'react';
import {
  Play,
  Layers,
  Code2,
  Sparkles,
  HelpCircle,
  Activity,
  ArrowRight,
  Box,
  CheckCircle,
  Cpu,
  BarChart3,
  TrendingUp,
  History,
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const cards = [
    {
      title: 'Start Visualizer',
      desc: 'Step inside Java execution. Inspect arrays, variables, and loops in interactive 3D.',
      icon: Play,
      action: () => onNavigate('visualizer'),
      primary: true,
      badge: 'Live Studio',
    },
    {
      title: 'Learn DSA',
      desc: 'Master Linked Lists, Stacks, Queues, Binary Trees, and sorting algorithms in 3D.',
      icon: Layers,
      action: () => onNavigate('dsa'),
      badge: '9 Modules',
    },
    {
      title: 'Quiz Arena',
      desc: 'Challenge algorithmic intuition by predicting variables and branch evaluations.',
      icon: HelpCircle,
      action: () => onNavigate('quiz'),
      badge: 'Challenge',
    },
    {
      title: 'Execution History',
      desc: 'View recorded simulation traces, database audit logs, and past quiz attempts.',
      icon: History,
      action: () => onNavigate('history'),
      badge: 'Database',
    },
    {
      title: 'Code Playground',
      desc: 'Write custom Java programs and watch the state machine track every statement in real-time.',
      icon: Code2,
      action: () => onNavigate('visualizer'),
      badge: 'Interactive',
    },
  ];

  const stats = [
    { label: 'Programs Executed', value: '1,420+', icon: Activity, change: '+12% this week' },
    { label: '3D Visualizations', value: '9 Core DSA', icon: Box, change: 'All active' },
    { label: 'DSA Concepts', value: '35+ Patterns', icon: Cpu, change: 'Java 21 ready' },
    { label: 'Learning Progress', value: '88% Mastery', icon: TrendingUp, change: 'Interactive mode' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#070b14] text-slate-100 p-6 md:p-10 select-none">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 p-8 md:p-12 overflow-hidden shadow-2xl">
          {/* Subtle background glow effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Exhibition Ready • Version 1.0
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-sans text-white">
              CODE<span className="text-cyan-400">3D</span> AI
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 font-light italic">
              "Don't just read the code. See the code execute."
            </p>

            <p className="text-sm md:text-base text-slate-400 leading-relaxed pt-1">
              Step beyond static code editors. Witness Java memory structures, loop counters,
              and branch evaluations transform dynamically inside an interactive 3D space with
              instant time-travel execution.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('visualizer')}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-sm flex items-center gap-2.5 transition shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                <Play size={16} className="fill-current" />
                <span>Launch 3D Visualizer</span>
              </button>

              <button
                onClick={() => onNavigate('dsa')}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-lg text-sm flex items-center gap-2 transition cursor-pointer"
              >
                <Layers size={16} className="text-cyan-400" />
                <span>Explore 9 DSA Modules</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 transition hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                  <Icon size={16} className="text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">{stat.value}</div>
                <div className="text-[11px] text-cyan-400/80 font-mono mt-1">{stat.change}</div>
              </div>
            );
          })}
        </div>

        {/* Feature Navigation Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white tracking-wide">
              Explore Platform Modules
            </h2>
            <span className="text-xs text-slate-500 font-mono">Select a card to navigate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  onClick={card.action}
                  className={`group relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    card.primary
                      ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-950/40 hover:border-cyan-400'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          card.primary
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-cyan-400'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-400">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Open Module</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exhibition Presentation Note */}
        <div className="border border-slate-800/80 bg-slate-900/40 rounded-xl p-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-cyan-400" />
            <span>
              <strong>Technology Exhibition Demo:</strong> Demonstrating 3D array memory allocation, loop branch evaluation, and state reversibility.
            </span>
          </div>
          <button
            onClick={() => onNavigate('visualizer')}
            className="text-cyan-400 hover:underline font-mono"
          >
            Go to Visualizer →
          </button>
        </div>
      </div>
    </div>
  );
}
