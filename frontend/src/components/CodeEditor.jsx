import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FileCode, CheckCircle2, Code2, Sparkles, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  onOpenLeetCode,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  isAtStart,
  isAtEnd,
  isCodeDirty = false,
  onRunCode,
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);
  const { isBright } = useTheme();

  const currentLangConfig = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.java;

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Dark Theme definition - Deep obsidian palette harmonized with 3D canvas
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
        'editor.background': '#070b14',
        'editor.lineHighlightBackground': '#1e293b44',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#00f2fe',
      },
    });

    // Bright Theme definition
    monaco.editor.defineTheme('code3dLight', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0284c7', fontStyle: 'bold' },
        { token: 'type', foreground: '0369a1' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'd97706' },
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.lineHighlightBackground': '#f1f5f9',
        'editorLineNumber.foreground': '#94a3b8',
        'editorLineNumber.activeForeground': '#0284c7',
      },
    });

    monaco.editor.setTheme(isBright ? 'code3dLight' : 'code3dDark');

    // Register Ctrl+Enter / Cmd+Enter shortcut directly inside Monaco
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunCode) {
        onRunCode();
      } else if (onPlay) {
        onPlay();
      }
    });
  };

  // Switch editor theme whenever bright mode changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(isBright ? 'code3dLight' : 'code3dDark');
    }
  }, [isBright]);

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
    <div className={`flex flex-col h-full border-r select-none transition-colors duration-200 ${
      isBright ? 'bg-white border-slate-200' : 'bg-[#0b0f19] border-slate-800/80'
    }`}>
      {/* Editor Header Bar with Language Switcher */}
      <div className={`h-10 border-b px-3 flex items-center justify-between gap-2 transition-colors ${
        isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800/70'
      }`}>
        <div className="flex items-center gap-2">
          <FileCode size={14} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
          <span className={`text-xs font-mono font-medium ${isBright ? 'text-slate-800' : 'text-slate-200'}`}>
            {currentLangConfig.fileName}
          </span>

          {isCodeDirty && (
            <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Modified (Ctrl+Enter)</span>
            </span>
          )}
          
          {/* Language Selector Dropdown */}
          <select
            value={language}
            onChange={(e) => onChangeLanguage && onChangeLanguage(e.target.value)}
            className={`border rounded px-1.5 py-0.5 text-[11px] font-mono focus:outline-none focus:border-cyan-500 cursor-pointer ${
              isBright
                ? 'bg-white border-slate-300 text-slate-800'
                : 'bg-slate-950 border-slate-700 text-cyan-300'
            }`}
          >
            <option value="java">☕ Java</option>
            <option value="javascript">🟨 JavaScript</option>
            <option value="python">🐍 Python</option>
            <option value="c">🇨 C</option>
            <option value="cpp">⚡ C++</option>
          </select>

          <span className={`hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded font-mono ${
            isBright ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
          }`}>
            {currentLangConfig.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* LeetCode 1-300 Button */}
          {onOpenLeetCode && (
            <button
              onClick={onOpenLeetCode}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition font-mono font-medium shadow-sm ${
                isBright
                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                  : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border-amber-500/40'
              }`}
              title="Explore LeetCode 1 to 300 Questions in 3D"
            >
              <Trophy size={11} className="text-amber-400" />
              <span>LeetCode 🏆</span>
            </button>
          )}

          {/* AI Code Doctor Button */}
          {onOpenCodeDoctor && (
            <button
              onClick={onOpenCodeDoctor}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition font-mono font-medium shadow-sm ${
                isBright
                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
              title="AI Code Doctor: Fix broken syntax and visualize in 3D"
            >
              <span>🩺 AI Doctor</span>
            </button>
          )}

          {/* Direct "Input Any Code" Button */}
          {onOpenCustomCode && (
            <button
              onClick={onOpenCustomCode}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition font-mono font-medium shadow-sm ${
                isBright
                  ? 'bg-cyan-100 text-cyan-800 border-cyan-300 hover:bg-cyan-200'
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-cyan-950'
              }`}
              title="Input Any Code in JS, C, C++, Python, or Java to visualize in 3D"
            >
              <Code2 size={11} className={isBright ? 'text-cyan-700' : 'text-cyan-400'} />
              <span>Input Code ⚡</span>
            </button>
          )}

          {currentLineNumber && (
            <div className={`flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border ${
              isBright
                ? 'text-cyan-700 bg-cyan-50 border-cyan-300'
                : 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isBright ? 'bg-cyan-600' : 'bg-cyan-400'}`}></span>
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
          theme={isBright ? 'code3dLight' : 'code3dDark'}
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
      <div className={`border-t p-2.5 flex items-center justify-between gap-2 transition-colors ${
        isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800/80'
      }`}>
        <div className="flex items-center gap-1.5">
          {/* Play / Pause */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition ${
                isBright
                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              }`}
              title="Pause Simulation"
            >
              <Pause size={13} className="fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={isCodeDirty ? onRunCode || onPlay : onPlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition shadow-sm ${
                isCodeDirty
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/40 animate-pulse'
                  : isBright
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-600/20'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
              }`}
              title="Run / Play Simulation (Ctrl+Enter)"
            >
              <Play size={13} className="fill-current" />
              <span>{isCodeDirty ? 'Run ⚡' : isAtEnd ? 'Replay' : isAtStart ? 'Run' : 'Resume'}</span>
            </button>
          )}

          {/* Reset */}
          <button
            onClick={onReset}
            className={`p-1.5 rounded transition ${
              isBright
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
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
                ? 'opacity-40 cursor-not-allowed border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                : isBright
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
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
                ? 'opacity-40 cursor-not-allowed border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                : isBright
                  ? 'border-cyan-400 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
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

