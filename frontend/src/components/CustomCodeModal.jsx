import React, { useState } from 'react';
import { X, Play, Code2, Sparkles, Cpu, Layers, Braces, Terminal, ArrowRight } from 'lucide-react';

const LANGUAGE_TEMPLATES = {
  python: `# Python 3.12 - Custom Array Analysis
numbers = [14, 52, 8, 91, 33]

print("Starting custom Python execution:")
for i in range(len(numbers)):
    val = numbers[i]
    print(f"Index {i} -> {val}")
`,
  c: `// C Standard - Contiguous Array Traversal
#include <stdio.h>

int main() {
    int arr[] = {25, 60, 15, 80, 45};
    int n = 5;

    for (int i = 0; i < n; i++) {
        printf("Element: %d\\n", arr[i]);
    }
    return 0;
}
`,
  cpp: `// C++ Standard - STL Vector Iteration
#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {10, 40, 25, 70, 95};

    for (int i = 0; i < arr.size(); i++) {
        std::cout << "Vector item: " << arr[i] << std::endl;
    }
    return 0;
}
`,
  java: `// Java 21 - Dynamic 3D Array Execution
public class Main {
    public static void main(String[] args) {
        int[] arr = {18, 45, 9, 62, 31};

        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}
`,
  javascript: `// JavaScript (ES6+ / Node.js 20) - 3D Array Execution
const arr = [12, 36, 48, 72, 96];

console.log("Starting 3D JavaScript execution:");
for (let i = 0; i < arr.length; i++) {
    console.log(\`Element [\${i}] = \${arr[i]}\`);
}
`
};

export default function CustomCodeModal({
  isOpen,
  onClose,
  onApplyCustomCode,
  currentLanguage = 'java'
}) {
  const [selectedLang, setSelectedLang] = useState(currentLanguage || 'java');
  const [code, setCode] = useState(LANGUAGE_TEMPLATES[currentLanguage] || LANGUAGE_TEMPLATES.java);
  const [customArrayInput, setCustomArrayInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setCode(LANGUAGE_TEMPLATES[lang] || '');
  };

  const handleApplyArrayValues = () => {
    if (!customArrayInput.trim()) return;
    const cleanNumbers = customArrayInput
      .replace(/[[\]{}]/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => !isNaN(s) && s !== '')
      .join(', ');

    if (!cleanNumbers) return;

    if (selectedLang === 'python') {
      setCode(`numbers = [${cleanNumbers}]\n\nfor i in range(len(numbers)):\n    print(numbers[i])\n`);
    } else if (selectedLang === 'c') {
      const count = cleanNumbers.split(',').length;
      setCode(`#include <stdio.h>\n\nint main() {\n    int arr[] = {${cleanNumbers}};\n    int n = ${count};\n    for(int i = 0; i < n; i++) {\n        printf("%d\\n", arr[i]);\n    }\n    return 0;\n}\n`);
    } else if (selectedLang === 'cpp') {
      setCode(`#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> arr = {${cleanNumbers}};\n    for(int i = 0; i < arr.size(); i++) {\n        std::cout << arr[i] << std::endl;\n    }\n    return 0;\n}\n`);
    } else {
      setCode(`public class Main {\n    public static void main(String[] args) {\n        int[] arr = {${cleanNumbers}};\n        for(int i = 0; i < arr.length; i++) {\n            System.out.println(arr[i]);\n        }\n    }\n}\n`);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setIsSubmitting(true);
    try {
      await onApplyCustomCode({
        code,
        language: selectedLang,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Code2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-white tracking-wide">
                  Input Any Custom Code for 3D Execution
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  Universal Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Write or paste code in C, C++, Python, or Java. Values and loops render directly in 3D.
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

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Language Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Select Language:</span>
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 gap-1">
                {[
                  { id: 'java', label: 'Java', icon: '☕' },
                  { id: 'javascript', label: 'JavaScript', icon: '🟨' },
                  { id: 'python', label: 'Python', icon: '🐍' },
                  { id: 'c', label: 'C', icon: '🇨' },
                  { id: 'cpp', label: 'C++', icon: '⚡' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`px-2.5 py-1 rounded-md font-mono text-xs font-semibold flex items-center gap-1.5 transition ${
                      selectedLang === lang.id
                        ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Array Values Shortcut */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. 5, 22, 9, 81, 33"
                value={customArrayInput}
                onChange={(e) => setCustomArrayInput(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
              />
              <button
                type="button"
                onClick={handleApplyArrayValues}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-mono text-[11px] transition"
                title="Inject array values into code template"
              >
                Set Array
              </button>
            </div>
          </div>

          {/* Code Textarea Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono flex items-center gap-1">
                <Terminal size={12} className="text-cyan-400" />
                Source Code ({selectedLang.toUpperCase()})
              </span>
              <span className="text-slate-500">Edit array values or loop conditions freely</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full bg-[#050811] text-slate-200 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition resize-none leading-relaxed"
            />
          </div>

          {/* Simulation Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-cyan-950 text-cyan-400">
                <Cpu size={14} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-300">AST Analysis</p>
                <p className="text-[10px] text-slate-500">Extracts loops & Big-O</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-purple-950 text-purple-400">
                <Layers size={14} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-300">Custom 3D Scene</p>
                <p className="text-[10px] text-slate-500">Renders your array values</p>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-emerald-950 text-emerald-400">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-300">Time Travel</p>
                <p className="text-[10px] text-slate-500">Step-by-step playback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCode(LANGUAGE_TEMPLATES[selectedLang])}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Reset to Template
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !code.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/25 disabled:opacity-50"
            >
              <Play size={14} className="fill-current" />
              <span>{isSubmitting ? 'Analyzing & Simulating...' : 'Analyze & Visualize in 3D'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
