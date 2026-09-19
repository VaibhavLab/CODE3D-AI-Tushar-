import React, { useState } from 'react';
import { Sparkles, HelpCircle, Lightbulb, Compass, Code, X, ChevronRight, Check } from 'lucide-react';
import { requestAiExplanation } from '../services/apiService';

export default function AiAssistantModal({ isOpen, onClose, code, currentLineNumber, currentStepNumber }) {
  const [level, setLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeQuery, setActiveQuery] = useState('WHY');

  if (!isOpen) return null;

  const handleAsk = async (queryType) => {
    setActiveQuery(queryType);
    setLoading(true);
    const res = await requestAiExplanation(code, currentLineNumber, currentStepNumber, queryType, level);
    if (res) {
      setResponse(res);
    } else {
      // Fallback local explanation
      setResponse({
        explanation: `Analysis (${level} mode): The code executes line ${currentLineNumber} during step ${currentStepNumber}. In Java, operations inside loops are validated against invariant bounds before accessing array memory.`,
        hint: "Observe how variables change monotonically with each iteration.",
        keyTakeaway: "Loop invariants ensure safety and predictable termination."
      });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                CODE3D AI Tutor <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">Real-time</span>
              </h2>
              <p className="text-xs text-slate-400">Pedagogical execution reasoning &amp; algorithmic hints</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Level Selector */}
        <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Explanation Level:</span>
          <div className="flex gap-1.5">
            {['Beginner', 'Intermediate', 'DSA'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  level === lvl
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 border-b border-slate-800/60 bg-slate-900/40">
          <button
            onClick={() => handleAsk('WHY')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left ${
              activeQuery === 'WHY' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <HelpCircle size={15} className="text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold">Why?</div>
              <div className="text-[10px] text-slate-500 font-normal">Deep operation reasoning</div>
            </div>
          </button>

          <button
            onClick={() => handleAsk('HINT')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left ${
              activeQuery === 'HINT' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Lightbulb size={15} className="text-amber-400 shrink-0" />
            <div>
              <div className="font-bold">Give Hint</div>
              <div className="text-[10px] text-slate-500 font-normal">Progressive clue</div>
            </div>
          </button>

          <button
            onClick={() => handleAsk('PREDICT_NEXT')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left ${
              activeQuery === 'PREDICT_NEXT' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Compass size={15} className="text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold">Predict Next</div>
              <div className="text-[10px] text-slate-500 font-normal">Next execution step</div>
            </div>
          </button>

          <button
            onClick={() => handleAsk('EXPLAIN_LINE')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left ${
              activeQuery === 'EXPLAIN_LINE' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Code size={15} className="text-blue-400 shrink-0" />
            <div>
              <div className="font-bold">Explain Line {currentLineNumber}</div>
              <div className="text-[10px] text-slate-500 font-normal">Single statement breakdown</div>
            </div>
          </button>

          <button
            onClick={() => handleAsk('EXPLAIN_CODE')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left sm:col-span-2 ${
              activeQuery === 'EXPLAIN_CODE' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Sparkles size={15} className="text-purple-400 shrink-0" />
            <div>
              <div className="font-bold">Explain Full Algorithm</div>
              <div className="text-[10px] text-slate-500 font-normal">Architecture &amp; complexity analysis</div>
            </div>
          </button>
        </div>

        {/* AI Output Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-400 font-mono">Synthesizing pedagogical explanation...</span>
            </div>
          ) : response ? (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block mb-1">
                  Reasoning
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {response.explanation}
                </p>
              </div>

              {response.hint && (
                <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3.5 flex items-start gap-2.5">
                  <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Pro Tip / Hint</span>
                    <p className="text-xs text-amber-200/90 mt-0.5">{response.hint}</p>
                  </div>
                </div>
              )}

              {response.keyTakeaway && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3.5 flex items-start gap-2.5">
                  <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Key Takeaway</span>
                    <p className="text-xs text-emerald-200/90 mt-0.5">{response.keyTakeaway}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              Select one of the questions above to receive an explanation tailored to the current execution state.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
