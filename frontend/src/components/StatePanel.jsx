import React from 'react';
import { Variable, CheckCircle2, XCircle, Sparkles, Layers, Cpu, ArrowRight } from 'lucide-react';

export default function StatePanel({ currentStep, totalSteps }) {
  if (!currentStep) return null;

  const {
    stepNumber,
    lineNumber,
    variables = {},
    changedVariable,
    previousValue,
    currentValue,
    condition,
    explanation,
    aiHint,
  } = currentStep;

  return (
    <div className="flex flex-col h-full bg-[#0d121f] text-slate-200 border-l border-slate-800/80 overflow-y-auto">
      {/* State Panel Header */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Program State
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            Step <strong className="text-cyan-400 font-bold">{stepNumber}</strong> of {totalSteps}
          </span>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5 flex-1 text-xs">
        {/* Step & Line Metric Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-2.5">
            <span className="text-[10px] uppercase text-slate-500 font-medium">Current Line</span>
            <div className="text-base font-mono font-bold text-cyan-400 mt-0.5 flex items-center gap-1.5">
              <span>Line {lineNumber}</span>
            </div>
          </div>
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-2.5">
            <span className="text-[10px] uppercase text-slate-500 font-medium">Event Type</span>
            <div className="text-[11px] font-mono font-semibold text-slate-300 mt-1 truncate">
              {currentStep.eventType || 'EXECUTION'}
            </div>
          </div>
        </div>

        {/* Variables Section */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Variable size={13} className="text-cyan-400" />
              <span className="font-semibold text-slate-300 text-xs">Variable Memory</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Stack Frame: main</span>
          </div>

          <div className="space-y-1.5 font-mono">
            {Object.keys(variables).length === 0 ? (
              <p className="text-slate-500 italic text-[11px]">No local variables in scope.</p>
            ) : (
              Object.entries(variables).map(([name, val]) => {
                const isRecentlyChanged = changedVariable === name;

                return (
                  <div
                    key={name}
                    className={`flex items-center justify-between p-2 rounded transition-all border ${
                      isRecentlyChanged
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                        : 'bg-slate-950/50 border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <span className="text-slate-400 font-medium">{name}</span>
                    <div className="flex items-center gap-2">
                      {isRecentlyChanged && previousValue !== null && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 line-through">
                          <span>{String(previousValue)}</span>
                          <ArrowRight size={10} className="text-slate-600 no-underline" />
                        </div>
                      )}
                      <span className={`font-bold ${isRecentlyChanged ? 'text-cyan-300' : 'text-slate-100'}`}>
                        {String(val)}
                      </span>
                      {isRecentlyChanged && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900/80 text-cyan-300 font-sans uppercase">
                          Updated
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Condition Evaluation Card */}
        {condition ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-300 text-xs">Condition Evaluation</span>
              {condition.result ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                  <CheckCircle2 size={11} /> TRUE
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800/50 px-1.5 py-0.5 rounded">
                  <XCircle size={11} /> FALSE
                </span>
              )}
            </div>

            <div className="space-y-1 bg-slate-950/70 border border-slate-800 rounded p-2 font-mono text-[11px]">
              <div className="text-slate-400">
                Expression: <span className="text-slate-200">{condition.expression}</span>
              </div>
              <div className="text-slate-400">
                Values: <span className="text-cyan-300 font-semibold">{condition.evaluation}</span>
              </div>
              <div className="text-slate-500 text-[10px] mt-1 pt-1 border-t border-slate-800/60">
                Branch: <span className="text-slate-300">{condition.branch}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Call Stack */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Layers size={13} className="text-cyan-400" />
            <span className="font-semibold text-slate-300 text-xs">Call Stack</span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded p-2 font-mono text-[11px] text-slate-300 flex items-center justify-between">
            <span className="text-cyan-400">Main.main(args)</span>
            <span className="text-[10px] text-slate-500">line {lineNumber}</span>
          </div>
        </div>

        {/* AI Pedagogical Explanation */}
        <div className="bg-gradient-to-br from-cyan-950/20 to-slate-900/60 border border-cyan-800/30 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1.5 text-cyan-400 font-semibold text-xs">
            <Sparkles size={13} />
            <span>Execution Insight</span>
          </div>
          <p className="text-slate-300 text-[11.5px] leading-relaxed font-sans">
            {explanation}
          </p>

          {aiHint && (
            <div className="mt-2 pt-2 border-t border-cyan-900/30 text-[11px] text-slate-400 flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">Hint:</span>
              <span>{aiHint}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
