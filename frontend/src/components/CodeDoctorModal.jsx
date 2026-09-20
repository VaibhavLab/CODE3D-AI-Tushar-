import React, { useState } from 'react';
import { X, Play, Sparkles, Stethoscope, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, Bug, Wrench } from 'lucide-react';
import { correctAndVisualizeCode } from '../services/apiService';
import { useTheme } from '../context/ThemeContext';

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
  const { isBright } = useTheme();
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
      <div className={`relative w-full max-w-4xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200 ${
        isBright
          ? 'bg-white border-slate-300 shadow-slate-300 text-slate-900'
          : 'bg-[#090d16] border-cyan-500/30 shadow-cyan-950/60 text-white'
      }`}>
        {/* Header */}
        <div className={`p-4 md:p-5 border-b flex items-center justify-between transition-colors ${
          isBright
            ? 'bg-gradient-to-r from-slate-50 via-amber-50/40 to-cyan-50/40 border-slate-200'
            : 'bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-md ${
              isBright
                ? 'bg-gradient-to-br from-amber-100 to-cyan-100 border-amber-300 text-amber-800'
                : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400'
            }`}>
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base md:text-lg font-bold tracking-wide ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  AI Code Doctor &amp; Auto-Correction Engine
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border flex items-center gap-1 ${
                  isBright
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-cyan-950 text-cyan-400 border-cyan-800/60'
                }`}>
                  <Wrench size={10} /> Auto-Fix Active
                </span>
              </div>
              <p className={`text-xs ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                Enter any random or broken code. Our AST engine diagnoses syntax errors, repairs bugs, and visualizes in 3D.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isBright ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Try Broken Samples Carousel */}
          <div className="space-y-1.5">
            <div className={`text-[11px] font-medium flex items-center gap-1.5 ${
              isBright ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <Bug size={12} className={isBright ? 'text-amber-600' : 'text-amber-400'} />
              <span>Or Try a Broken Sample:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BROKEN_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition cursor-pointer ${
                    isBright
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:border-cyan-500'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:border-cyan-500/40'
                  }`}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector Bar */}
          <div className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-colors ${
            isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
          }`}>
            <span className={`font-medium text-xs ${isBright ? 'text-slate-700' : 'text-slate-400'}`}>Target Language:</span>
            <div className={`inline-flex rounded-lg p-1 border gap-1 ${
              isBright ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
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
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition cursor-pointer ${
                    selectedLang === lang.id
                      ? isBright
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                      : isBright
                      ? 'text-slate-600 hover:text-slate-900'
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
              <div className={`flex items-center justify-between text-[11px] ${
                isBright ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <span className="font-mono flex items-center gap-1">
                  <AlertTriangle size={12} className={isBright ? 'text-amber-600' : 'text-amber-400'} />
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
                className={`w-full flex-1 font-mono text-xs p-3 rounded-xl border transition resize-none leading-relaxed focus:outline-none ${
                  isBright
                    ? 'bg-amber-50/60 text-amber-950 border-amber-300 focus:border-cyan-600'
                    : 'bg-[#050811] text-amber-200/90 border-amber-500/30 focus:border-cyan-500'
                }`}
              />
            </div>

            {/* Right: Corrected Code Preview */}
            <div className="space-y-1.5 flex flex-col">
              <div className={`flex items-center justify-between text-[11px] ${
                isBright ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <span className="font-mono flex items-center gap-1">
                  <CheckCircle2 size={12} className={isBright ? 'text-emerald-600' : 'text-emerald-400'} />
                  Corrected &amp; Executable Code
                </span>
                {diagnosisResult && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    isBright
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}>
                    Validated
                  </span>
                )}
              </div>
              <div className={`w-full flex-1 font-mono text-xs p-3 rounded-xl border overflow-y-auto leading-relaxed whitespace-pre min-h-[180px] transition-colors ${
                isBright
                  ? 'bg-emerald-50/60 text-emerald-950 border-emerald-300'
                  : 'bg-[#050811] text-emerald-300 border-emerald-500/30'
              }`}>
                {diagnosisResult ? (
                  diagnosisResult.correctedCode
                ) : (
                  <span className={`italic ${isBright ? 'text-slate-400' : 'text-slate-600'}`}>
                    Click "Diagnose &amp; Auto-Correct" below to analyze syntax, repair bugs, and preview valid code.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Diagnostic Issues Breakdown */}
          {diagnosisResult && (
            <div className={`p-4 rounded-xl border space-y-2.5 animate-fadeIn transition-colors ${
              isBright
                ? 'bg-slate-50 border-slate-300 text-slate-800'
                : 'bg-slate-900/90 border-cyan-500/30 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
                  <h4 className={`font-bold text-xs ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    Diagnostic Assessment &amp; Repairs Applied:
                  </h4>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isBright
                    ? 'bg-cyan-100 text-cyan-800 border-cyan-300 font-bold'
                    : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                }`}>
                  {diagnosisResult.errorsFound.length} Bug(s) Resolved
                </span>
              </div>

              {diagnosisResult.errorsFound.length > 0 ? (
                <div className="space-y-1.5">
                  {diagnosisResult.errorsFound.map((err, i) => (
                    <div key={i} className={`flex items-start gap-2 text-[11px] p-2 rounded-lg border ${
                      isBright
                        ? 'bg-white text-slate-800 border-slate-200'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800'
                    }`}>
                      <span className={`font-bold ${isBright ? 'text-emerald-600' : 'text-emerald-400'}`}>✓</span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-[11px] ${isBright ? 'text-emerald-700 font-medium' : 'text-emerald-400'}`}>
                  ✓ Code was already syntactically clean! No modifications were needed.
                </p>
              )}

              <p className={`text-[11px] italic ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                {diagnosisResult.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className={`p-4 border-t flex items-center justify-between transition-colors ${
          isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <button
            onClick={() => {
              setInputCode('');
              setDiagnosisResult(null);
            }}
            className={`text-xs transition cursor-pointer ${
              isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clear Editor
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDiagnose}
              disabled={loading || !inputCode.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer disabled:opacity-50 ${
                isBright
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Diagnosing...' : 'Diagnose & Auto-Correct'}</span>
            </button>

            <button
              onClick={handleLaunch3D}
              disabled={!diagnosisResult}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition shadow-lg cursor-pointer disabled:opacity-40 ${
                isBright
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/25'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25'
              }`}
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
