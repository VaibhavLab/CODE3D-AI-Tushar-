import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Filter,
  Sparkles,
  Zap,
  Code2,
  Trophy,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { STRIVER_DAYS, STRIVER_PROBLEMS } from '../utils/striverCatalog';

const STORAGE_KEY = 'code3d_striver_solved_v1';

export default function StriverSheetDrawer({
  isOpen,
  onToggle,
  onSelectProblem,
  currentLanguage = 'java'
}) {
  const { isBright } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('All Days (180+)');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [solvedMap, setSolvedMap] = useState({});

  // Load solved problems from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSolvedMap(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load solved striver state', e);
    }
  }, []);

  const toggleSolved = (problemId, e) => {
    e.stopPropagation();
    setSolvedMap(prev => {
      const updated = { ...prev, [problemId]: !prev[problemId] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const solvedCount = useMemo(() => {
    return Object.values(solvedMap).filter(Boolean).length;
  }, [solvedMap]);

  const totalCount = STRIVER_PROBLEMS.length;
  const progressPercent = Math.round((solvedCount / totalCount) * 100) || 0;

  const filteredProblems = useMemo(() => {
    return STRIVER_PROBLEMS.filter(p => {
      // Day filter
      if (selectedDay !== 'All Days (180+)' && p.day !== selectedDay) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = p.id.toString() === q;
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesDay = p.day.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        return matchesId || matchesTitle || matchesDesc || matchesDay || matchesCat;
      }
      return true;
    });
  }, [selectedDay, selectedDifficulty, searchQuery]);

  const handleLaunch = (p) => {
    let codeToUse = p.javaCode;
    if (currentLanguage === 'python') codeToUse = p.pythonCode;
    else if (currentLanguage === 'cpp') codeToUse = p.cppCode;

    onSelectProblem({
      id: `striver-${p.id}`,
      striverId: p.id,
      title: p.title,
      shortTitle: p.shortTitle,
      day: p.day,
      dayNumber: p.dayNumber,
      category: p.category,
      difficulty: p.difficulty,
      archetype: p.archetype,
      timeComplexity: p.timeComplexity,
      spaceComplexity: p.spaceComplexity,
      description: p.description,
      defaultInput: p.defaultInput,
      code: codeToUse,
      language: currentLanguage
    });
    if (onToggle) {
      onToggle();
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return isBright ? 'text-emerald-700 bg-emerald-100 border-emerald-300' : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'Medium':
        return isBright ? 'text-amber-800 bg-amber-100 border-amber-300' : 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'Hard':
        return isBright ? 'text-rose-800 bg-rose-100 border-rose-300' : 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      default:
        return isBright ? 'text-slate-700 bg-slate-100 border-slate-300' : 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <>
      {/* Backdrop overlay for mobile screens */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30  transition-opacity"
        />
      )}

      {/* Mount the problem catalog only while the drawer is open. */}
      {isOpen && <div
        className={`fixed top-14 left-0 bottom-0 z-40 w-[480px] sm:w-[540px] max-w-[92vw] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out border-r ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isBright
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#070b14]/95 backdrop-blur-xl border-slate-800/90 text-slate-100'
        }`}
      >
        {/* Drawer Header */}
        <div className={`p-3.5 border-b flex flex-col gap-2.5 shrink-0 ${
          isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
                <Trophy size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                  <span>Striver's SDE Sheet</span>
                  <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    182 Problems
                  </span>
                </h2>
                <p className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                  Top interview questions with instant 3D WebGL trace
                </p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className={`p-1.5 rounded-lg border transition ${
                isBright
                  ? 'hover:bg-slate-200 border-slate-300 text-slate-600'
                  : 'hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Close Drawer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress Tracker Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className={isBright ? 'text-slate-600' : 'text-slate-400'}>
                Progress: <strong className={isBright ? 'text-amber-700' : 'text-amber-400'}>{solvedCount}</strong> / {totalCount} Solved
              </span>
              <span className="font-bold text-amber-500">{progressPercent}%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isBright ? 'bg-slate-200' : 'bg-slate-800'}`}>
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className={`p-3 border-b flex flex-col gap-2 shrink-0 ${
          isBright ? 'bg-white border-slate-200' : 'bg-[#0b0f19] border-slate-800/80'
        }`}>
          {/* Search Box */}
          <div className="relative">
            <Search size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${isBright ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem, day, topic, or keyword..."
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                isBright
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  : 'bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Day Dropdown Selector */}
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className={`flex-1 px-2 py-1 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer ${
                isBright
                  ? 'bg-slate-50 border-slate-300 text-slate-800'
                  : 'bg-slate-950 border-slate-700 text-amber-300'
              }`}
            >
              {STRIVER_DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            {/* Difficulty Filter Chips */}
            <div className="flex items-center gap-1">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition border ${
                    selectedDifficulty === diff
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : isBright
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
          {filteredProblems.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 gap-2">
              <Search size={28} className="opacity-40" />
              <p className="text-xs">No Striver problems matched your filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedDay('All Days (180+)'); setSelectedDifficulty('All'); }}
                className="text-xs text-amber-500 underline hover:text-amber-400"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredProblems.map((p) => {
              const isSolved = Boolean(solvedMap[p.id]);
              return (
                <div
                  key={p.id}
                  onClick={() => handleLaunch(p)}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer group hover:shadow-lg ${
                    isSolved
                      ? isBright
                        ? 'bg-emerald-50/60 border-emerald-300/80 hover:border-emerald-400'
                        : 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-500/60'
                      : isBright
                        ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300 shadow-sm'
                        : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      {/* Solved Checkbox */}
                      <button
                        onClick={(e) => toggleSolved(p.id, e)}
                        className={`mt-0.5 p-0.5 rounded transition ${
                          isSolved
                            ? 'text-emerald-500'
                            : isBright ? 'text-slate-300 hover:text-emerald-600' : 'text-slate-600 hover:text-emerald-400'
                        }`}
                        title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                      >
                        {isSolved ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`font-bold text-xs ${
                            isSolved
                              ? 'line-through text-slate-500'
                              : isBright ? 'text-slate-900' : 'text-slate-100'
                          }`}>
                            {p.title}
                          </span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getDifficultyColor(p.difficulty)}`}>
                            {p.difficulty}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isBright ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {p.day.split(':')[0]}
                          </span>
                        </div>

                        <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                          isBright ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {p.description}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-mono">
                          <div className="flex items-center gap-2">
                            <span className={isBright ? 'text-slate-500' : 'text-slate-400'}>
                              Time: <strong className={isBright ? 'text-slate-700' : 'text-cyan-400'}>{p.timeComplexity}</strong>
                            </span>
                            <span>•</span>
                            <span className={isBright ? 'text-slate-500' : 'text-slate-400'}>
                              Space: <strong className={isBright ? 'text-slate-700' : 'text-emerald-400'}>{p.spaceComplexity}</strong>
                            </span>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); handleLaunch(p); }}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded font-sans font-semibold transition ${
                              isBright
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            <Zap size={11} className="text-amber-400" />
                            <span>Visualize 3D ⚡</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>}
    </>
  );
}
