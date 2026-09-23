import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
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

export default function CodeEditor({ code, onChangeCode, currentLineNumber, language = 'java', onChangeLanguage, isCodeDirty, onRunCode }) {
  const runRef = useRef(onRunCode);
  runRef.current = onRunCode;
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
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current?.());
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
    <div className={`flex flex-col h-full min-h-0 min-w-0 border-r select-none transition-colors duration-200 ${
      isBright ? 'bg-white border-slate-200' : 'bg-[#0b0f19] border-slate-800/80'
    }`}>
      <header className="source-header">
        <span>{currentLangConfig.fileName}{isCodeDirty ? ' *' : ''}</span>
        <select aria-label="Code language" value={language} onChange={event => onChangeLanguage(event.target.value)}>
          <option value="java">Java</option><option value="javascript">JavaScript</option><option value="python">Python</option><option value="c">C</option><option value="cpp">C++</option>
        </select>
        <span className="source-line">L{currentLineNumber || 1}</span>
      </header>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
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

    </div>
  );
}
