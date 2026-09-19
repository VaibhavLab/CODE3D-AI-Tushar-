import React, { useState } from 'react';
import { X, Play, Sparkles, Stethoscope, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, Bug, Wrench } from 'lucide-react';
import { correctAndVisualizeCode } from '../services/apiService';

const BROKEN_SAMPLES = [
  {
    name: 'Broken Java (Boundary & Syntax)',
    lang: 'java',
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10 20 30 40}

        // Off-by-one bug: i <= arr.length will throw exception!
        for(int i = 0; i <= arr.length; i++) {
            printfln(arr[i])
        }
    // Missing closing brace!
`
  },
  {
    name: 'Broken Python (Colon & Foreign Syntax)',
    lang: 'python',
    code: `numbers = [15 42 8 99 23]

# Missing colon on loop and foreign print statement
for i in range(len(numbers))
    System.out.println(numbers[i])
`
  },
  {
    name: 'Broken JavaScript (Loop & Logger)',
    lang: 'javascript',
    code: `const arr = [12 28 45 67 89]

for(let i = 0; i <= arr.length; i++) {
    consol.log(arr[i])
// Missing brace
`
  },
  {
    name: 'Raw Numbers Only',
    lang: 'java',
    code: `45, 12, 89, 3, 27, 60`
  },
  {
    name: 'Raw Pseudo-code',
    lang: 'python',
    code: `sort 88 12 45 3 29`
  }
];

export default function CodeDoctorModal({
  isOpen,
  onClose,
  onApplyCorrectedCode,
  currentLanguage = 'java'
}) {
  const [selectedLang, setSelectedLang] = useState(currentLanguage || 'java');
  const [inputCode, setInputCode] = useState(BROKEN_SAMPLES[0].code);
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  if (!isOpen) return null;

  const handleSelectSample = (sample) => {
    setSelectedLang(sample.lang);
    setInputCode(sample.code);
    setDiagnosisResult(null);
  };

  const handleDiagnose = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);
    try {
      const res = await correctAndVisualizeCode(inputCode, selectedLang);
      setDiagnosisResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch3D = () => {
    if (!diagnosisResult) return;
    onApplyCorrectedCode({
      code: diagnosisResult.correctedCode,
      language: diagnosisResult.language || selectedLang,
      trace: diagnosisResult.executionTrace?.steps || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-white tracking-wide">
                  AI Code Doctor &amp; Auto-Correction Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center gap-1">
                  <Wrench size={10} /> Auto-Fix Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enter any random or broken code. Our AST engine diagnoses syntax errors, repairs bugs, and visualizes in 3D.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Try Broken Samples Carousel */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Bug size={12} className="text-amber-400" />
              <span>Or Try a Broken Sample:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BROKEN_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition hover:border-cyan-500/40"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector Bar */}
          <div className="flex items-center justify-between gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium text-xs">Target Language:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 gap-1">
              {[
                { id: 'java', label: '☕ Java' },
                { id: 'javascript', label: '🟨 JavaScript' },
                { id: 'python', label: '🐍 Python' },
                { id: 'c', label: '🇨 C' },
                { id: 'cpp', label: '⚡ C++' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLang(lang.id);
                    setDiagnosisResult(null);
                  }}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition ${
                    selectedLang === lang.id
                      ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code Input & Diff Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Raw / Broken Code Input */}
            <div className="space-y-1.5 flex flex-col">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono flex items-center gap-1">
                  <AlertTriangle size={12} className="text-amber-400" />
                  Your Input Code (Can be broken/incomplete)
                </span>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setDiagnosisResult(null);
                }}
                rows={9}
                spellCheck={false}
                placeholder="Paste any code here with errors, missing brackets, raw numbers, or pseudo-code..."
                className="w-full flex-1 bg-[#050811] text-amber-200/90 font-mono text-xs p-3 rounded-xl border border-amber-500/30 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
              />
            </div>

            {/* Right: Corrected Code Preview */}
            <div className="space-y-1.5 flex flex-col">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  Corrected &amp; Executable Code
                </span>
                {diagnosisResult && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Validated
                  </span>
                )}
              </div>
              <div className="w-full flex-1 bg-[#050811] text-emerald-300 font-mono text-xs p-3 rounded-xl border border-emerald-500/30 overflow-y-auto leading-relaxed whitespace-pre min-h-[180px]">
                {diagnosisResult ? (
                  diagnosisResult.correctedCode
                ) : (
                  <span className="text-slate-600 italic">
                    Click "Diagnose &amp; Auto-Correct" below to analyze syntax, repair bugs, and preview valid code.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Diagnostic Issues Breakdown */}
          {diagnosisResult && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-cyan-400" />
                  <h4 className="font-bold text-white text-xs">Diagnostic Assessment &amp; Repairs Applied:</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {diagnosisResult.errorsFound.length} Bug(s) Resolved
                </span>
              </div>

              {diagnosisResult.errorsFound.length > 0 ? (
                <div className="space-y-1.5">
                  {diagnosisResult.errorsFound.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-emerald-400">
                  ✓ Code was already syntactically clean! No modifications were needed.
                </p>
              )}

              <p className="text-[11px] text-slate-400 italic">
                {diagnosisResult.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setInputCode('');
              setDiagnosisResult(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Clear Editor
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDiagnose}
              disabled={loading || !inputCode.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Diagnosing...' : 'Diagnose & Auto-Correct'}</span>
            </button>

            <button
              onClick={handleLaunch3D}
              disabled={!diagnosisResult}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/25 disabled:opacity-40"
            >
              <Play size={13} className="fill-current" />
              <span>Visualize in 3D Now</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
