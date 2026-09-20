import React, { useState } from 'react';
import { SAMPLE_PROGRAMS, CURRICULUM_CATEGORIES } from '../utils/sampleCodes';
import { useTheme } from '../context/ThemeContext';
import { Layers, Play, Clock, HardDrive, ArrowRight, BookOpen, CheckCircle, Search, Sparkles } from 'lucide-react';

export default function DsaHub({ onSelectConcept }) {
  const { isBright } = useTheme();
  const categories = ['All', ...CURRICULUM_CATEGORIES];

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = SAMPLE_PROGRAMS.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = searchTerm.trim() === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`flex-1 overflow-y-auto p-6 md:p-10 select-none transition-colors duration-200 ${
      isBright ? 'bg-slate-50 text-slate-900' : 'bg-[#070b14] text-slate-100'
    }`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hub Header with Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
              isBright
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800'
                : 'bg-cyan-950/60 border-cyan-800/50 text-cyan-400'
            }`}>
              <Layers size={13} />
              <span>Full Interactive 3D DSA Curriculum ({SAMPLE_PROGRAMS.length} Concepts)</span>
            </div>
            <h1 className={`text-3xl font-extrabold ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Comprehensive DSA Curriculum
            </h1>
            <p className={`text-xs max-w-2xl ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
              Inspect memory buffers, bidirectional pointer traversal, tree rotations, graph frontiers, and DP state tables in full interactive WebGL 3D.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search size={14} className={`absolute left-3 top-3 ${isBright ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search concepts (e.g. avl, bfs, stack)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cyan-500 transition-colors ${
                isBright
                  ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const count = cat === 'All' ? SAMPLE_PROGRAMS.length : SAMPLE_PROGRAMS.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? isBright
                      ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20'
                      : 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : isBright
                      ? 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-sm'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? isBright ? 'bg-cyan-700 text-white' : 'bg-slate-950/40 text-slate-950'
                    : isBright ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid of Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-cyan-500/60 group ${
                isBright
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:bg-cyan-50/20'
                  : 'bg-slate-900/60 border-slate-800/90 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                    isBright ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.difficulty === 'Beginner'
                      ? isBright ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium' : 'bg-emerald-950/60 border-emerald-800/50 text-emerald-400'
                      : item.difficulty === 'Intermediate'
                      ? isBright ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium' : 'bg-blue-950/60 border-blue-800/50 text-blue-400'
                      : isBright ? 'bg-purple-50 border-purple-300 text-purple-700 font-medium' : 'bg-purple-950/60 border-purple-800/50 text-purple-400'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>

                <h3 className={`text-base font-bold transition-colors ${
                  isBright ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-xs mt-2 leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                  {item.description}
                </p>

                {/* Complexity metrics */}
                <div className={`mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-[11px] font-mono ${
                  isBright ? 'border-slate-100' : 'border-slate-800/70'
                }`}>
                  <div className={`flex items-center gap-1.5 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                    <Clock size={12} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
                    <span>Time: <strong className={isBright ? 'text-cyan-700' : 'text-cyan-300'}>{item.timeComplexity}</strong></span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                    <HardDrive size={12} className={isBright ? 'text-emerald-600' : 'text-emerald-400'} />
                    <span>Space: <strong className={isBright ? 'text-emerald-700' : 'text-emerald-300'}>{item.spaceComplexity}</strong></span>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <button
                onClick={() => onSelectConcept(item)}
                className={`mt-5 w-full py-2 px-3 rounded-lg border font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                  isBright
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 shadow-sm'
                    : 'bg-cyan-950/50 hover:bg-cyan-500 hover:text-slate-950 border-cyan-800/50 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950'
                }`}
              >
                <Play size={13} className="fill-current" />
                <span>Launch in 3D Visualizer</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Big-O Complexity Matrix Table */}
        <div className={`border rounded-2xl p-6 space-y-4 transition-colors ${
          isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-500" />
            <h2 className={`text-lg font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Full Asymptotic Complexity Cheat Sheet
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs font-mono ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
              <thead className={`uppercase text-[10px] tracking-wider border-b ${
                isBright ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="py-3 px-4">Data Structure / Algorithm</th>
                  <th className="py-3 px-4">Access Time</th>
                  <th className="py-3 px-4">Search Time</th>
                  <th className="py-3 px-4">Insertion</th>
                  <th className="py-3 px-4">Deletion</th>
                  <th className="py-3 px-4">Worst Space</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isBright ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
                <tr>
                  <td className={`py-2.5 px-4 font-semibold ${isBright ? 'text-slate-900' : 'text-white'}`}>1D Array</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(1)</td>
                  <td className="py-2.5 px-4 text-amber-600 dark:text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-amber-600 dark:text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-amber-600 dark:text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-4 font-semibold ${isBright ? 'text-slate-900' : 'text-white'}`}>Doubly Linked List</td>
                  <td className="py-2.5 px-4 text-amber-600 dark:text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-amber-600 dark:text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(1)*</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(1)*</td>
                  <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-4 font-semibold ${isBright ? 'text-slate-900' : 'text-white'}`}>Stack &amp; Queue</td>
                  <td className="py-2.5 px-4 text-amber-600 dark:text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-amber-600 dark:text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(1)</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(1)</td>
                  <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-4 font-semibold ${isBright ? 'text-slate-900' : 'text-white'}`}>AVL Tree (Balanced)</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(log n)</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(log n)</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(log n)</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(log n)</td>
                  <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-4 font-semibold ${isBright ? 'text-slate-900' : 'text-white'}`}>Hash Table (Chaining)</td>
                  <td className="py-2.5 px-4 text-slate-400">N/A</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(1) avg</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(1) avg</td>
                  <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">O(1) avg</td>
                  <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-4 font-semibold ${isBright ? 'text-slate-900' : 'text-white'}`}>Graph BFS / DFS</td>
                  <td className="py-2.5 px-4 text-slate-400">N/A</td>
                  <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400">O(V + E)</td>
                  <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400">O(V + E)</td>
                  <td className="py-2.5 px-4 text-slate-400">N/A</td>
                  <td className="py-2.5 px-4 text-cyan-600 dark:text-cyan-400">O(V)</td>
                </tr>
                <tr>
                  <td className={`py-2.5 px-4 font-semibold ${isBright ? 'text-slate-900' : 'text-white'}`}>0/1 Knapsack (DP)</td>
                  <td className="py-2.5 px-4 text-slate-400">N/A</td>
                  <td className="py-2.5 px-4 text-purple-600 dark:text-purple-400">O(N × W)</td>
                  <td className="py-2.5 px-4 text-slate-400">N/A</td>
                  <td className="py-2.5 px-4 text-slate-400">N/A</td>
                  <td className="py-2.5 px-4 text-purple-600 dark:text-purple-400">O(N × W)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

