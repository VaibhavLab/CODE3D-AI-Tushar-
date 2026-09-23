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
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SAMPLE_PROGRAMS } from '../utils/sampleCodes';

export default function Dashboard({ onNavigate }) {
  const { isBright } = useTheme();

  const cards = [
    {
      title: 'Start Visualizer',
      desc: 'Explore algorithms in interactive 3D. Runs locally without installing Java.',
      icon: Play,
      action: () => onNavigate('visualizer'),
      primary: true,
      badge: 'Live Studio',
    },
    {
      title: "Striver's SDE Sheet 📜",
      desc: 'Master the top 182 SDE interview problems across Days 1–27 with interactive 3D WebGL trace.',
      icon: BookOpen,
      action: () => onNavigate('striver'),
      primary: true,
      badge: '182 Problems (Days 1–27)',
    },
    {
      title: 'Learn DSA',
      desc: 'Master Linked Lists, Stacks, Queues, Binary Trees, and sorting algorithms in 3D.',
      icon: Layers,
      action: () => onNavigate('dsa'),
      badge: `${SAMPLE_PROGRAMS.length} Concepts`,
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
    { label: 'Runtime', value: 'Browser', icon: Activity, change: 'No Java installation' },
    { label: '3D Visualizations', value: `${SAMPLE_PROGRAMS.length} Curated`, icon: Box, change: 'All active' },
    { label: 'DSA Concepts', value: '8 Modules', icon: Cpu, change: 'Learning simulations' },
    { label: 'Playback', value: 'Step by step', icon: TrendingUp, change: 'Pause and rewind' },
  ];

  return (
    <div className={`flex-1 overflow-y-auto p-6 md:p-10 select-none transition-colors duration-200 ${
      isBright ? 'bg-slate-50 text-slate-900' : 'bg-[#070b14] text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className={`relative rounded-2xl p-8 md:p-12 overflow-hidden shadow-xl border transition-colors ${
          isBright
            ? 'bg-gradient-to-b from-white to-slate-100 border-slate-200 text-slate-900 shadow-slate-200'
            : 'bg-gradient-to-b from-slate-900/90 to-slate-950 border-slate-800/80 shadow-2xl text-white'
        }`}>
          {/* Subtle background glow effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
              isBright
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800'
                : 'bg-cyan-950/60 border-cyan-800/50 text-cyan-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              Learning Studio • Version 1.0 • {SAMPLE_PROGRAMS.length} DSA Topics
            </div>

            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight font-sans ${isBright ? 'text-slate-900' : 'text-white'}`}>
              CODE<span className="text-cyan-500 dark:text-cyan-400">3D</span> AI
            </h1>

            <p className={`text-xl md:text-2xl font-light italic ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
              "Don't just read the code. See the code execute."
            </p>

            <p className={`text-sm md:text-base leading-relaxed pt-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
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
                className={`border font-semibold px-5 py-3 rounded-lg text-sm flex items-center gap-2 transition cursor-pointer ${
                  isBright
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <Layers size={16} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
                <span>Explore {SAMPLE_PROGRAMS.length} DSA Modules</span>
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
                className={`border rounded-xl p-4 transition ${
                  isBright
                    ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className={`flex items-center justify-between mb-2 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                  <Icon size={16} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
                </div>
                <div className={`text-2xl font-bold font-mono ${isBright ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
                <div className={`text-[11px] font-mono mt-1 ${isBright ? 'text-cyan-700' : 'text-cyan-400/80'}`}>{stat.change}</div>
              </div>
            );
          })}
        </div>

        {/* Feature Navigation Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold tracking-wide ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Explore Platform Modules
            </h2>
            <span className={`text-xs font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>Select a card to navigate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  onClick={card.action}
                  className={`group relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    card.primary
                      ? isBright
                        ? 'bg-gradient-to-b from-cyan-50 to-white border-cyan-300 shadow-md hover:shadow-lg hover:border-cyan-500'
                        : 'bg-gradient-to-b from-cyan-950/40 to-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-950/40 hover:border-cyan-400'
                      : isBright
                        ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-slate-50/80'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          card.primary
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                            : isBright
                              ? 'bg-slate-100 text-cyan-700 border border-slate-200'
                              : 'bg-slate-800 text-cyan-400'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isBright
                          ? 'bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400'
                      }`}>
                        {card.badge}
                      </span>
                    </div>

                    <h3 className={`font-bold text-sm transition-colors ${
                      isBright
                        ? 'text-slate-900 group-hover:text-cyan-700'
                        : 'text-white group-hover:text-cyan-300'
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`text-xs mt-1.5 leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                      {card.desc}
                    </p>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium group-hover:translate-x-0.5 transition-transform ${
                    isBright ? 'border-slate-100 text-cyan-700' : 'border-slate-800/60 text-cyan-400'
                  }`}>
                    <span>Open Module</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exhibition Presentation Note */}
        <div className={`border rounded-xl p-4 flex items-center justify-between text-xs transition-colors ${
          isBright
            ? 'border-slate-200 bg-white text-slate-600 shadow-sm'
            : 'border-slate-800/80 bg-slate-900/40 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
            <span>
              <strong>Technology Exhibition Demo:</strong> Demonstrating 3D array memory allocation, loop branch evaluation, and state reversibility.
            </span>
          </div>
          <button
            onClick={() => onNavigate('visualizer')}
            className={`font-mono hover:underline ${isBright ? 'text-cyan-700 font-semibold' : 'text-cyan-400'}`}
          >
            Go to Visualizer →
          </button>
        </div>
      </div>
    </div>
  );
}

