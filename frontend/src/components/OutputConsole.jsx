import React from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function OutputConsole({ output = [] }) {
  const { isBright } = useTheme();

  return (
    <div className={`flex flex-col h-full border-t font-mono text-xs transition-colors duration-200 ${
      isBright
        ? 'bg-slate-50 border-slate-200 text-slate-800'
        : 'bg-[#070b14] border-slate-800/80 text-slate-300'
    }`}>
      {/* Console Header */}
      <div className={`h-8 border-b px-3 flex items-center justify-between transition-colors ${
        isBright
          ? 'bg-white border-slate-200 text-slate-700 shadow-2xs'
          : 'bg-slate-900/90 border-slate-800/80 text-slate-400'
      }`}>
        <div className="flex items-center gap-2">
          <Terminal size={13} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
          <span className={`text-[11px] font-semibold tracking-wide uppercase ${isBright ? 'text-slate-800' : 'text-slate-300'}`}>
            Standard Output
          </span>
          <span className={`text-[10px] ${isBright ? 'text-slate-400' : 'text-slate-600'}`}>
            | Console Stream
          </span>
        </div>
        <div className={`text-[10px] ${isBright ? 'text-slate-500' : 'text-slate-500'}`}>
          {output.length} {output.length === 1 ? 'line' : 'lines'} printed
        </div>
      </div>

      {/* Output Content */}
      <div className={`flex-1 p-3 overflow-y-auto space-y-1 font-mono select-text transition-colors ${
        isBright ? 'bg-white' : 'bg-[#070b14]'
      }`}>
        <div className={`text-[11px] select-none ${isBright ? 'text-slate-400' : 'text-slate-600'}`}>
          $ process --run
        </div>
        {output.length === 0 ? (
          <div className={`italic text-[11px] ${isBright ? 'text-slate-400' : 'text-slate-600'}`}>
            Program running... No output produced yet.
          </div>
        ) : (
          output.map((line, idx) => (
            <div key={idx} className={`flex items-center gap-2 text-xs ${
              isBright ? 'text-emerald-700 font-medium' : 'text-emerald-300'
            }`}>
              <span className={`select-none text-[10px] ${isBright ? 'text-slate-400' : 'text-slate-600'}`}>&gt;</span>
              <span>{line}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
