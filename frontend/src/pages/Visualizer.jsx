import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import StatePanel from '../components/StatePanel';
import OutputConsole from '../components/OutputConsole';
import Timeline from '../components/Timeline';
import SceneContainer from '../visualizers/SceneContainer';
import DsaSceneDispatcher from '../visualizers/DsaSceneDispatcher';
import AiAssistantModal from '../components/AiAssistantModal';
import QuizModal from '../components/QuizModal';
import CustomCodeModal from '../components/CustomCodeModal';
import CodeDoctorModal from '../components/CodeDoctorModal';
import { useExecutionTimeline } from '../hooks/useExecutionTimeline';
import { getExecutionTrace } from '../services/executionSimulator';
import { DEFAULT_JAVA_CODE, SAMPLE_PROGRAMS, LANGUAGE_DEFAULTS, CURRICULUM_CATEGORIES } from '../utils/sampleCodes';
import { executeProgram, analyzeCode, checkBackendHealth } from '../services/apiService';
import { useTheme } from '../context/ThemeContext';
import { Code2, Sparkles, HelpCircle, Layers, Cpu, Server, Check, Stethoscope } from 'lucide-react';

export default function Visualizer({ initialConcept }) {
  const { isBright } = useTheme();
  const [selectedSample, setSelectedSample] = useState(initialConcept || SAMPLE_PROGRAMS[0]);
  const [code, setCode] = useState(initialConcept?.code || DEFAULT_JAVA_CODE);
  const [language, setLanguage] = useState(initialConcept?.language || 'java');
  const [trace, setTrace] = useState(() => {
    if (initialConcept?.trace && initialConcept.trace.length > 0) {
      return initialConcept.trace;
    }
    return getExecutionTrace(initialConcept?.code || DEFAULT_JAVA_CODE, initialConcept?.language || 'java');
  });
  const [backendOnline, setBackendOnline] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState(initialConcept?.timeComplexity || SAMPLE_PROGRAMS[0].timeComplexity);
  const [spaceComplexity, setSpaceComplexity] = useState(initialConcept?.spaceComplexity || SAMPLE_PROGRAMS[0].spaceComplexity);

  // Modals & responsive view state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCustomCodeOpen, setIsCustomCodeOpen] = useState(false);
  const [isCodeDoctorOpen, setIsCodeDoctorOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('3d'); // '3d' | 'code' | 'state'

  const {
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    isAtStart,
    isAtEnd,
    nextStep,
    prevStep,
    goToStep,
    play,
    pause,
    reset,
  } = useExecutionTimeline(trace);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((isUp) => {
      setBackendOnline(isUp);
    });
  }, []);

  // Update visualizer state whenever initialConcept changes (e.g. from AI Doctor or DSA Hub)
  useEffect(() => {
    if (initialConcept) {
      setSelectedSample(initialConcept);
      setCode(initialConcept.code);
      if (initialConcept.language) {
        setLanguage(initialConcept.language);
      }
      setTimeComplexity(initialConcept.timeComplexity || 'O(n)');
      setSpaceComplexity(initialConcept.spaceComplexity || 'O(1)');

      // If AI Doctor or caller provided a custom 3D execution trace, use it directly!
      if (initialConcept.trace && initialConcept.trace.length > 0) {
        setTrace(initialConcept.trace);
        reset();
        setTimeout(() => play(), 100);
      } else if (backendOnline && initialConcept.id && initialConcept.id !== 'custom') {
        executeProgram(initialConcept.code, initialConcept.id, initialConcept.language || 'java')
          .then((res) => {
            if (res?.steps?.length > 0) {
              setTrace(res.steps);
            } else {
              setTrace(getExecutionTrace(initialConcept.code, initialConcept.language || 'java'));
            }
            reset();
            setTimeout(() => play(), 100);
          })
          .catch(() => {
            setTrace(getExecutionTrace(initialConcept.code, initialConcept.language || 'java'));
            reset();
            setTimeout(() => play(), 100);
          });
      } else {
        setTrace(getExecutionTrace(initialConcept.code, initialConcept.language || 'java'));
        reset();
        setTimeout(() => play(), 100);
      }
    }
  }, [initialConcept, backendOnline]);

  // Handle preset selection
  const handleSelectProgram = async (prog) => {
    setSelectedSample(prog);
    setCode(prog.code);
    setLanguage('java');
    setTimeComplexity(prog.timeComplexity);
    setSpaceComplexity(prog.spaceComplexity);

    // Fetch execution trace from backend if online
    if (backendOnline) {
      const res = await executeProgram(prog.code, prog.id, 'java');
      if (res && res.steps && res.steps.length > 0) {
        setTrace(res.steps);
        reset();
        setTimeout(() => play(), 100);
        return;
      }
    }

    // Fallback to local trace
    setTrace(getExecutionTrace(prog.code, 'java'));
    reset();
    setTimeout(() => play(), 100);
  };


  // Handle language change from editor
  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    const template = LANGUAGE_DEFAULTS[newLang] || DEFAULT_JAVA_CODE;
    setCode(template);
    setSelectedSample({
      id: 'custom',
      title: `${newLang.toUpperCase()} Traversal`,
      category: 'Multi-Language',
      description: `Dynamic ${newLang.toUpperCase()} execution trace in 3D space.`,
      difficulty: 'Beginner',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: template,
    });

    if (backendOnline) {
      const [execRes, astRes] = await Promise.all([
        executeProgram(template, 'custom', newLang),
        analyzeCode(template, newLang),
      ]);
      if (execRes && execRes.steps && execRes.steps.length > 0) {
        setTrace(execRes.steps);
        reset();
      }
      if (astRes) {
        if (astRes.timeComplexity) setTimeComplexity(astRes.timeComplexity);
        if (astRes.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
      }
    }
  };

  // Handle user applying custom code from modal
  const handleCustomCodeApply = async ({ code: customCode, language: customLang }) => {
    setLanguage(customLang);
    setCode(customCode);
    setSelectedSample({
      id: 'custom',
      title: `⚡ Custom ${customLang.toUpperCase()} Code`,
      category: 'Custom Algorithms',
      description: 'User-submitted code dynamically analyzed and rendered in 3D.',
      difficulty: 'Custom',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: customCode,
    });

    let newSteps = null;
    if (backendOnline) {
      try {
        const [execRes, astRes] = await Promise.all([
          executeProgram(customCode, 'custom', customLang),
          analyzeCode(customCode, customLang),
        ]);

        if (execRes && execRes.steps && execRes.steps.length > 0) {
          newSteps = execRes.steps;
        }
        if (astRes) {
          if (astRes.timeComplexity) setTimeComplexity(astRes.timeComplexity);
          if (astRes.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
        }
      } catch (err) {
        console.warn('Backend custom execution failed, using simulator:', err);
      }
    }

    if (!newSteps || newSteps.length === 0) {
      newSteps = getExecutionTrace(customCode, customLang);
    }

    if (newSteps && newSteps.length > 0) {
      setTrace(newSteps);
      reset();
      setTimeout(() => play(), 50);
    }
  };

  // Handle AI Code Doctor applied correction
  const handleApplyCorrectedCode = async ({ code: correctedCode, language: correctedLang, trace: correctedTrace }) => {
    setLanguage(correctedLang);
    setCode(correctedCode);
    setSelectedSample({
      id: 'custom',
      title: `🩺 Repaired ${correctedLang.toUpperCase()} Code`,
      category: 'AI Auto-Corrected',
      description: 'Automatically diagnosed, repaired, and simulated in 3D WebGL.',
      difficulty: 'Repaired',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: correctedCode,
    });

    if (correctedTrace && correctedTrace.length > 0) {
      setTrace(correctedTrace);
      reset();
      setTimeout(() => play(), 50);
    } else {
      let newSteps = null;
      if (backendOnline) {
        try {
          const [execRes, astRes] = await Promise.all([
            executeProgram(correctedCode, 'custom', correctedLang),
            analyzeCode(correctedCode, correctedLang),
          ]);
          if (execRes?.steps?.length > 0) newSteps = execRes.steps;
          if (astRes?.timeComplexity) setTimeComplexity(astRes.timeComplexity);
          if (astRes?.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
        } catch (err) {
          console.warn('Backend repaired execution failed, using simulator:', err);
        }
      }

      if (!newSteps || newSteps.length === 0) {
        newSteps = getExecutionTrace(correctedCode, correctedLang);
      }

      if (newSteps && newSteps.length > 0) {
        setTrace(newSteps);
        reset();
        setTimeout(() => play(), 50);
      }
    }
  };

  // Run user code dynamically against backend or simulator
  const handleRunCode = async () => {
    const isCustom = selectedSample.id === 'custom' || code.trim() !== (selectedSample.code || '').trim();
    const conceptIdToUse = isCustom ? 'custom' : selectedSample.id;

    let newSteps = null;

    if (backendOnline) {
      try {
        const [execRes, astRes] = await Promise.all([
          executeProgram(code, conceptIdToUse, language),
          analyzeCode(code, language),
        ]);

        if (execRes && execRes.steps && execRes.steps.length > 0) {
          newSteps = execRes.steps;
        }
        if (astRes) {
          if (astRes.timeComplexity) setTimeComplexity(astRes.timeComplexity);
          if (astRes.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
        }
      } catch (err) {
        console.warn('Backend execution error, using client simulator:', err);
      }
    }

    if (!newSteps || newSteps.length === 0) {
      newSteps = getExecutionTrace(code, language);
    }

    if (newSteps && newSteps.length > 0) {
      setTrace(newSteps);
      reset();
      setTimeout(() => play(), 50);
    } else {
      play();
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden select-none transition-colors duration-200 ${
      isBright ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Visualizer Header Controls */}
      <div className={`min-h-10 border-b px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-2 transition-colors ${
        isBright
          ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
          : 'bg-slate-900/95 border-slate-800/80 text-slate-300'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className={`font-semibold flex items-center gap-1.5 ${isBright ? 'text-slate-800' : 'text-slate-200'}`}>
            <Layers size={14} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
            <span className="hidden sm:inline">Concept:</span>
          </span>

          {/* Categorized Concept Dropdown grouped by 8 Curriculum Modules */}
          <select
            value={selectedSample.id}
            onChange={(e) => {
              const found = SAMPLE_PROGRAMS.find((p) => p.id === e.target.value);
              if (found) handleSelectProgram(found);
            }}
            className={`border rounded-md px-2 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[160px] sm:max-w-none transition-colors ${
              isBright
                ? 'bg-white border-slate-300 text-slate-900 font-semibold'
                : 'bg-slate-950 border-slate-700/80 text-cyan-300'
            }`}
          >
            {selectedSample.id === 'custom' && (
              <option value="custom">
                {selectedSample.title || '⚡ Custom Execution'}
              </option>
            )}
            {CURRICULUM_CATEGORIES.map((category) => {
              const items = SAMPLE_PROGRAMS.filter((p) => p.category === category);
              if (items.length === 0) return null;
              return (
                <optgroup key={category} label={`📂 ${category}`}>
                  {items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.difficulty})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>

          {/* Prominent AI Code Doctor Button */}
          <button
            onClick={() => setIsCodeDoctorOpen(true)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition shadow-sm shrink-0 border ${
              isBright
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
            title="AI Code Doctor: Fix broken syntax/loops and auto-visualize in 3D"
          >
            <Stethoscope size={13} className={isBright ? 'text-amber-600' : 'text-amber-400'} />
            <span>AI Doctor</span>
          </button>

          {/* Prominent "Input Any Code" Button */}
          <button
            onClick={() => setIsCustomCodeOpen(true)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition shadow-sm shrink-0 border ${
              isBright
                ? 'bg-cyan-100 text-cyan-900 border-cyan-300 hover:bg-cyan-200'
                : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border-cyan-500/40'
            }`}
            title="Input any code in JS, C, C++, Python, or Java to visualize in 3D"
          >
            <Code2 size={13} className={isBright ? 'text-cyan-700' : 'text-cyan-400'} />
            <span>Input Code ⚡</span>
          </button>
        </div>

        {/* Center: Complexity Badges & Backend status */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono shrink-0">
          <div className={`border rounded px-2 py-0.5 ${
            isBright ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-950/70 border-slate-800'
          }`}>
            Time: <strong className={isBright ? 'text-cyan-700 font-bold' : 'text-cyan-400 font-bold'}>{timeComplexity}</strong>
          </div>
          <div className={`border rounded px-2 py-0.5 ${
            isBright ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-950/70 border-slate-800'
          }`}>
            Space: <strong className={isBright ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold'}>{spaceComplexity}</strong>
          </div>
          <div className={`flex items-center gap-1.5 border rounded px-2 py-0.5 ${
            isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span className={`text-[10px] ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
              {backendOnline ? 'Spring Boot Active' : 'Standalone'}
            </span>
          </div>
        </div>

        {/* Right: AI Assistant & Quiz Mode triggers */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAiOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition border ${
              isBright
                ? 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-800'
                : 'bg-cyan-950/70 hover:bg-cyan-900 border-cyan-700/50 text-cyan-300'
            }`}
          >
            <Sparkles size={13} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
            <span>AI Tutor</span>
          </button>

          <button
            onClick={() => setIsQuizOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition border ${
              isBright
                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-emerald-950/70 hover:bg-emerald-900 border-emerald-700/50 text-emerald-300'
            }`}
          >
            <HelpCircle size={13} className={isBright ? 'text-emerald-600' : 'text-emerald-400'} />
            <span>Quiz Mode</span>
          </button>
        </div>
      </div>

      {/* Mobile View Switcher (Visible only on mobile devices) */}
      <div className={`md:hidden flex items-center border-b p-1 shrink-0 ${
        isBright ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800/80'
      }`}>
        <button
          onClick={() => setMobileTab('3d')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
            mobileTab === '3d'
              ? isBright
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-sm'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🧊 3D Scene</span>
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
            mobileTab === 'code'
              ? isBright
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-sm'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>💻 Code Editor</span>
        </button>
        <button
          onClick={() => setMobileTab('state')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
            mobileTab === 'state'
              ? isBright
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-sm'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>📊 Variables</span>
        </button>
      </div>


      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Column: Monaco Code Editor (4 cols on desktop, responsive on mobile) */}
        <div className={`${mobileTab === 'code' ? 'block' : 'hidden'} md:block md:col-span-4 h-full overflow-hidden`}>
          <CodeEditor
            code={code}
            onChangeCode={setCode}
            language={language}
            onChangeLanguage={handleLanguageChange}
            onOpenCustomCode={() => setIsCustomCodeOpen(true)}
            onOpenCodeDoctor={() => setIsCodeDoctorOpen(true)}
            currentLineNumber={currentStep?.lineNumber || null}
            isPlaying={isPlaying}
            onPlay={handleRunCode}
            onPause={pause}
            onNext={nextStep}
            onPrev={prevStep}
            onReset={reset}
            isAtStart={isAtStart}
            isAtEnd={isAtEnd}
          />
        </div>

        {/* Center Column: 3D Visualization + Console (5 cols on desktop, responsive on mobile) */}
        <div className={`${mobileTab === '3d' ? 'flex' : 'hidden'} md:flex md:col-span-5 h-full flex-col border-r border-slate-800/80 overflow-hidden`}>
          {/* 3D Canvas Viewport */}
          <div className="flex-1 relative min-h-[260px] sm:min-h-[340px]">
            <SceneContainer
              statusLabel={currentStep?.dataStructureState?.label || null}
              activeDetails={currentStep?.dataStructureState?.focusInfo || null}
            >
              <DsaSceneDispatcher
                dataStructureState={currentStep?.dataStructureState}
              />
            </SceneContainer>
          </div>

          {/* Integrated Output Console */}
          <div className="h-36 sm:h-44 shrink-0">
            <OutputConsole output={currentStep?.output || []} />
          </div>
        </div>

        {/* Right Column: Program State Inspector (3 cols on desktop, responsive on mobile) */}
        <div className={`${mobileTab === 'state' ? 'block' : 'hidden'} md:block md:col-span-3 h-full overflow-hidden`}>
          <StatePanel
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </div>
      </div>

      {/* Bottom Full-Width Time Machine Timeline */}
      <div className="w-full">
        <Timeline
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
          onPlay={play}
          onPause={pause}
          onPrev={prevStep}
          onNext={nextStep}
          onReset={reset}
          onGoToStep={goToStep}
          isAtStart={isAtStart}
          isAtEnd={isAtEnd}
        />
      </div>

      {/* Modals */}
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        code={code}
        currentLineNumber={currentStep?.lineNumber || 6}
        currentStepNumber={currentStepIndex + 1}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        conceptId={selectedSample.id}
      />

      <CustomCodeModal
        isOpen={isCustomCodeOpen}
        onClose={() => setIsCustomCodeOpen(false)}
        onApplyCustomCode={handleCustomCodeApply}
        currentLanguage={language}
      />

      <CodeDoctorModal
        isOpen={isCodeDoctorOpen}
        onClose={() => setIsCodeDoctorOpen(false)}
        onApplyCorrectedCode={handleApplyCorrectedCode}
        currentLanguage={language}
      />
    </div>
  );
}
