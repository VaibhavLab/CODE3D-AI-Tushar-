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
import { DEFAULT_JAVA_CODE, SAMPLE_PROGRAMS, LANGUAGE_DEFAULTS } from '../utils/sampleCodes';
import { executeProgram, analyzeCode, checkBackendHealth } from '../services/apiService';
import { Code2, Sparkles, HelpCircle, Layers, Cpu, Server, Check, Stethoscope } from 'lucide-react';

export default function Visualizer({ initialConcept }) {
  const [selectedSample, setSelectedSample] = useState(initialConcept || SAMPLE_PROGRAMS[0]);
  const [code, setCode] = useState(initialConcept?.code || DEFAULT_JAVA_CODE);
  const [language, setLanguage] = useState('java');
  const [trace, setTrace] = useState(getExecutionTrace(initialConcept?.code || DEFAULT_JAVA_CODE));
  const [backendOnline, setBackendOnline] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState(initialConcept?.timeComplexity || SAMPLE_PROGRAMS[0].timeComplexity);
  const [spaceComplexity, setSpaceComplexity] = useState(initialConcept?.spaceComplexity || SAMPLE_PROGRAMS[0].spaceComplexity);

  // Modals & responsive view state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCustomCodeOpen, setIsCustomCodeOpen] = useState(false);
  const [isCodeDoctorOpen, setIsCodeDoctorOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('3d'); // '3d' | 'code' | 'state'

  useEffect(() => {
    if (initialConcept) {
      setSelectedSample(initialConcept);
      setCode(initialConcept.code);
      setTimeComplexity(initialConcept.timeComplexity);
      setSpaceComplexity(initialConcept.spaceComplexity);
      setTrace(getExecutionTrace(initialConcept.code));
    }
  }, [initialConcept]);

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
        return;
      }
    }

    // Fallback to local trace
    setTrace(getExecutionTrace(prog.code));
    reset();
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

    if (backendOnline) {
      const [execRes, astRes] = await Promise.all([
        executeProgram(customCode, 'custom', customLang),
        analyzeCode(customCode, customLang),
      ]);

      if (execRes && execRes.steps && execRes.steps.length > 0) {
        setTrace(execRes.steps);
      }
      if (astRes) {
        if (astRes.timeComplexity) setTimeComplexity(astRes.timeComplexity);
        if (astRes.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
      }
      reset();
      play();
    } else {
      setTrace(getExecutionTrace(customCode));
      reset();
      play();
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
      play();
    } else if (backendOnline) {
      const [execRes, astRes] = await Promise.all([
        executeProgram(correctedCode, 'custom', correctedLang),
        analyzeCode(correctedCode, correctedLang),
      ]);
      if (execRes?.steps?.length > 0) setTrace(execRes.steps);
      if (astRes?.timeComplexity) setTimeComplexity(astRes.timeComplexity);
      if (astRes?.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
      reset();
      play();
    } else {
      setTrace(getExecutionTrace(correctedCode));
      reset();
      play();
    }
  };

  // Run user code dynamically against backend
  const handleRunCode = async () => {
    if (backendOnline) {
      const [execRes, astRes] = await Promise.all([
        executeProgram(code, selectedSample.id, language),
        analyzeCode(code, language),
      ]);

      if (execRes && execRes.steps && execRes.steps.length > 0) {
        setTrace(execRes.steps);
      }
      if (astRes) {
        if (astRes.timeComplexity) setTimeComplexity(astRes.timeComplexity);
        if (astRes.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
      }
    }
    play();
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-950 select-none">
      {/* Visualizer Header Controls */}
      <div className="min-h-10 bg-slate-900/95 border-b border-slate-800/80 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300 overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Layers size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Concept:</span>
          </span>
          <select
            value={selectedSample.id}
            onChange={(e) => {
              const found = SAMPLE_PROGRAMS.find((p) => p.id === e.target.value);
              if (found) handleSelectProgram(found);
            }}
            className="bg-slate-950 border border-slate-700/80 rounded-md px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[140px] sm:max-w-none"
          >
            {SAMPLE_PROGRAMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>

          {/* Prominent AI Code Doctor Button */}
          <button
            onClick={() => setIsCodeDoctorOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold transition shadow-sm shrink-0"
            title="AI Code Doctor: Fix broken syntax/loops and auto-visualize in 3D"
          >
            <Stethoscope size={13} className="text-amber-400" />
            <span>AI Doctor</span>
          </button>

          {/* Prominent "Input Any Code" Button */}
          <button
            onClick={() => setIsCustomCodeOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition shadow-sm shrink-0"
            title="Input any code in JS, C, C++, Python, or Java to visualize in 3D"
          >
            <Code2 size={13} className="text-cyan-400" />
            <span>Input Code ⚡</span>
          </button>
        </div>

        {/* Center: Complexity Badges & Backend status */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono shrink-0">
          <div className="bg-slate-950/70 border border-slate-800 rounded px-2 py-0.5">
            Time: <strong className="text-cyan-400 font-bold">{timeComplexity}</strong>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded px-2 py-0.5">
            Space: <strong className="text-emerald-400 font-bold">{spaceComplexity}</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded px-2 py-0.5">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-400 text-[10px]">
              {backendOnline ? 'Spring Boot Active' : 'Standalone'}
            </span>
          </div>
        </div>

        {/* Right: AI Assistant & Quiz Mode triggers */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAiOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/50 text-cyan-300 px-2.5 py-1 rounded-md text-xs font-semibold transition"
          >
            <Sparkles size={13} className="text-cyan-400" />
            <span>AI Tutor</span>
          </button>

          <button
            onClick={() => setIsQuizOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 px-2.5 py-1 rounded-md text-xs font-semibold transition"
          >
            <HelpCircle size={13} className="text-emerald-400" />
            <span>Quiz Mode</span>
          </button>
        </div>
      </div>

      {/* Mobile View Switcher (Visible only on mobile devices) */}
      <div className="md:hidden flex items-center bg-slate-950 border-b border-slate-800/80 p-1 shrink-0">
        <button
          onClick={() => setMobileTab('3d')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
            mobileTab === '3d'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🧊 3D Scene</span>
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
            mobileTab === 'code'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>💻 Code Editor</span>
        </button>
        <button
          onClick={() => setMobileTab('state')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
            mobileTab === 'state'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
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
          onPlay={handleRunCode}
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
