import React, { useState } from 'react';
import { SAMPLE_PROGRAMS } from '../utils/sampleCodes';
import { Layers, Play, Clock, HardDrive, ArrowRight, BookOpen, CheckCircle, Search, Sparkles } from 'lucide-react';

export default function DsaHub({ onSelectConcept }) {
  const categories = [
    'All',
    'Arrays',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Trees',
    'Sorting',
    'Searching',
    'Recursion',
    'Graphs',
    'Dynamic Programming',
    'Hashing'
  ];

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
    <div className="flex-1 overflow-y-auto bg-[#070b14] text-slate-100 p-6 md:p-10 select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hub Header with Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono font-medium">
              <Layers size={13} />
              <span>Full Interactive 3D DSA Curriculum ({SAMPLE_PROGRAMS.length} Concepts)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Comprehensive DSA Catalog</h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Inspect memory buffers, bidirectional pointer traversal, tree rotations, graph frontiers, and DP state tables in full interactive WebGL 3D.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts (e.g. avl, bfs, stack)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900/90 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.difficulty === 'Beginner'
                      ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-400'
                      : item.difficulty === 'Intermediate'
                      ? 'bg-blue-950/60 border-blue-800/50 text-blue-400'
                      : 'bg-purple-950/60 border-purple-800/50 text-purple-400'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Complexity metrics */}
                <div className="mt-4 pt-3 border-t border-slate-800/70 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={12} className="text-cyan-400" />
                    <span>Time: <strong className="text-cyan-300">{item.timeComplexity}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <HardDrive size={12} className="text-emerald-400" />
                    <span>Space: <strong className="text-emerald-300">{item.spaceComplexity}</strong></span>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <button
                onClick={() => onSelectConcept(item)}
                className="mt-5 w-full py-2 px-3 rounded-lg bg-cyan-950/50 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-800/50 text-cyan-300 font-semibold text-xs transition flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-slate-950 cursor-pointer"
              >
                <Play size={13} className="fill-current" />
                <span>Launch in 3D Visualizer</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Big-O Complexity Matrix Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Full Asymptotic Complexity Cheat Sheet</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Data Structure / Algorithm</th>
                  <th className="py-3 px-4">Access Time</th>
                  <th className="py-3 px-4">Search Time</th>
                  <th className="py-3 px-4">Insertion</th>
                  <th className="py-3 px-4">Deletion</th>
                  <th className="py-3 px-4">Worst Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">1D Array</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(1)</td>
                  <td className="py-2.5 px-4 text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Doubly Linked List</td>
                  <td className="py-2.5 px-4 text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(1)*</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(1)*</td>
                  <td className="py-2.5 px-4 text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Stack &amp; Queue</td>
                  <td className="py-2.5 px-4 text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-amber-400">O(n)</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(1)</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(1)</td>
                  <td className="py-2.5 px-4 text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">AVL Tree (Balanced)</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(log n)</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(log n)</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(log n)</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(log n)</td>
                  <td className="py-2.5 px-4 text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Hash Table (Chaining)</td>
                  <td className="py-2.5 px-4 text-slate-500">N/A</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(1) avg</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(1) avg</td>
                  <td className="py-2.5 px-4 text-emerald-400">O(1) avg</td>
                  <td className="py-2.5 px-4 text-cyan-400">O(n)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Graph BFS / DFS</td>
                  <td className="py-2.5 px-4 text-slate-500">N/A</td>
                  <td className="py-2.5 px-4 text-cyan-400">O(V + E)</td>
                  <td className="py-2.5 px-4 text-cyan-400">O(V + E)</td>
                  <td className="py-2.5 px-4 text-slate-500">N/A</td>
                  <td className="py-2.5 px-4 text-cyan-400">O(V)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">0/1 Knapsack (DP)</td>
                  <td className="py-2.5 px-4 text-slate-500">N/A</td>
                  <td className="py-2.5 px-4 text-purple-400">O(N × W)</td>
                  <td className="py-2.5 px-4 text-slate-500">N/A</td>
                  <td className="py-2.5 px-4 text-slate-500">N/A</td>
                  <td className="py-2.5 px-4 text-purple-400">O(N × W)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
