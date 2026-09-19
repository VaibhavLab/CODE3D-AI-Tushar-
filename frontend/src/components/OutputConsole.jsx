import React from 'react';
import { Terminal, Trash2 } from 'lucide-react';

export default function OutputConsole({ output = [] }) {
  return (
    <div className="flex flex-col h-full bg-[#080c14] border-t border-slate-800/80 font-mono text-xs">
      {/* Console Header */}
      <div className="h-8 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal size={13} className="text-cyan-400" />
          <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-300">
            Standard Output
          </span>
          <span className="text-[10px] text-slate-600">| System.out</span>
        </div>
        <div className="text-[10px] text-slate-500">
          {output.length} {output.length === 1 ? 'line' : 'lines'} printed
        </div>
      </div>

      {/* Output Content */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1 text-slate-300 font-mono select-text">
        <div className="text-slate-600 text-[11px] select-none">
          $ java Main
        </div>
        {output.length === 0 ? (
          <div className="text-slate-600 italic text-[11px]">
            Program running... No output produced yet.
          </div>
        ) : (
          output.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2 text-emerald-300 text-xs">
              <span className="text-slate-600 select-none text-[10px]">&gt;</span>
              <span>{line}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
