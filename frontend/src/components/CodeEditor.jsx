import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FileCode, CheckCircle2, Code2, Sparkles } from 'lucide-react';

const LANGUAGE_CONFIG = {
  java: {
    monacoLang: 'java',
    fileName: 'Main.java',
    badge: 'Java 21',
    icon: '☕'
  },
  python: {
    monacoLang: 'python',
    fileName: 'main.py',
    badge: 'Python 3.12',
    icon: '🐍'
  },
  c: {
    monacoLang: 'c',
    fileName: 'main.c',
    badge: 'C17 Standard',
    icon: '🇨'
  },
  cpp: {
    monacoLang: 'cpp',
    fileName: 'main.cpp',
    badge: 'C++20 STL',
    icon: '⚡'
  },
  javascript: {
    monacoLang: 'javascript',
    fileName: 'main.js',
    badge: 'Node.js / ES2024',
    icon: '🟨'
  }
};

export default function CodeEditor({
  code,
  onChangeCode,
  currentLineNumber,
  language = 'java',
  onChangeLanguage,
  onOpenCustomCode,
  onOpenCodeDoctor,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  isAtStart,
  isAtEnd,
}) {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  const currentLangConfig = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.java;

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom styling rules for line decoration and tokens
    monaco.editor.defineTheme('code3dDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '00f2fe', fontStyle: 'bold' },
        { token: 'type', foreground: '38bdf8' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#0b0f19',
        'editor.lineHighlightBackground': '#1e293b55',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#00f2fe',
      },
    });

    monaco.editor.setTheme('code3dDark');
  };

  // Update line highlighting whenever currentLineNumber changes
  useEffect(() => {
    if (!editorRef.current || !currentLineNumber) return;

    const editor = editorRef.current;

    const newDecorations = [
      {
        range: {
          startLineNumber: currentLineNumber,
          startColumn: 1,
          endLineNumber: currentLineNumber,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: 'active-execution-line-bg',
          glyphMarginClassName: 'active-execution-line-glyph',
        },
      },
    ];

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
    editor.revealLineInCenterIfOutsideViewport(currentLineNumber);
  }, [currentLineNumber]);

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border-r border-slate-800/80 select-none">
      {/* Editor Header Bar with Language Switcher */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-800/70 px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileCode size={14} className="text-cyan-400" />
          <span className="text-xs font-mono font-medium text-slate-200">
            {currentLangConfig.fileName}
          </span>
          
          {/* Language Selector Dropdown */}
          <select
            value={language}
            onChange={(e) => onChangeLanguage && onChangeLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="java">☕ Java</option>
            <option value="javascript">🟨 JavaScript</option>
            <option value="python">🐍 Python</option>
            <option value="c">🇨 C</option>
            <option value="cpp">⚡ C++</option>
          </select>

          <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {currentLangConfig.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* AI Code Doctor Button */}
          {onOpenCodeDoctor && (
            <button
              onClick={onOpenCodeDoctor}
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition font-mono font-medium shadow-sm"
              title="AI Code Doctor: Fix broken syntax and visualize in 3D"
            >
              <span>🩺 AI Doctor</span>
            </button>
          )}

          {/* Direct "Input Any Code" Button */}
          {onOpenCustomCode && (
            <button
              onClick={onOpenCustomCode}
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition font-mono font-medium shadow-sm shadow-cyan-950"
              title="Input Any Code in JS, C, C++, Python, or Java to visualize in 3D"
            >
              <Code2 size={11} className="text-cyan-400" />
              <span>Input Code ⚡</span>
            </button>
          )}

          {currentLineNumber && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Line {currentLineNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 w-full overflow-hidden">
        <Editor
          height="100%"
          language={currentLangConfig.monacoLang}
          theme="vs-dark"
          value={code}
          onChange={(val) => onChangeCode && onChangeCode(val)}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13.5,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            renderLineHighlight: 'all',
            glyphMargin: true,
            folding: true,
          }}
        />
      </div>

      {/* Editor Controls Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 p-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Play / Pause */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-medium transition"
              title="Pause Simulation"
            >
              <Pause size={13} className="fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-semibold transition shadow-sm shadow-cyan-500/20"
              title="Run / Play Simulation"
            >
              <Play size={13} className="fill-current" />
              <span>{isAtEnd ? 'Replay' : isAtStart ? 'Run' : 'Resume'}</span>
            </button>
          )}

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition"
            title="Reset to Step 1"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Step-by-Step Step Back / Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={isAtStart}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition border ${
              isAtStart
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Previous Execution Step"
          >
            <SkipBack size={12} />
            <span>Prev</span>
          </button>

          <button
            onClick={onNext}
            disabled={isAtEnd}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition border ${
              isAtEnd
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                : 'border-cyan-600/60 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60'
            }`}
            title="Next Execution Step"
          >
            <span>Next</span>
            <SkipForward size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
