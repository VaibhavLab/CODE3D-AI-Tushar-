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
import StriverSheetDrawer from '../components/StriverSheetDrawer';
import { useExecutionTimeline } from '../hooks/useExecutionTimeline';
import { getExecutionTrace, extractNumbersFromCode } from '../services/executionSimulator';
import { DEFAULT_JAVA_CODE, SAMPLE_PROGRAMS, LANGUAGE_DEFAULTS, CURRICULUM_CATEGORIES } from '../utils/sampleCodes';
import { STRIVER_PROBLEMS } from '../utils/striverCatalog';
import { executeProgram, analyzeCode, checkBackendHealth, recordExecutionHistory } from '../services/apiService';
import { useTheme } from '../context/ThemeContext';
import { Code2, SlidersHorizontal } from 'lucide-react';

const DEFAULT_SAMPLE = SAMPLE_PROGRAMS.find((sample) => sample.id === 'array-loop');

export default function Visualizer({ initialConcept, initialOpenStriver = false }) {
  const { isBright } = useTheme();
  const [selectedSample, setSelectedSample] = useState(initialConcept || DEFAULT_SAMPLE);
  const [code, setCode] = useState(initialConcept?.code || DEFAULT_JAVA_CODE);
  const [lastExecutedCode, setLastExecutedCode] = useState(initialConcept?.code || DEFAULT_JAVA_CODE);
  const isCodeDirty = code !== lastExecutedCode;

  const [language, setLanguage] = useState(initialConcept?.language || 'java');
  const [trace, setTrace] = useState(() => {
    if (initialConcept?.trace && initialConcept.trace.length > 0) {
      return initialConcept.trace;
    }
    return getExecutionTrace(initialConcept?.code || DEFAULT_JAVA_CODE, initialConcept?.language || 'java');
  });
  const [backendOnline, setBackendOnline] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState(initialConcept?.timeComplexity || DEFAULT_SAMPLE.timeComplexity);
  const [spaceComplexity, setSpaceComplexity] = useState(initialConcept?.spaceComplexity || DEFAULT_SAMPLE.spaceComplexity);

  // View Layout Toggles requested by user:
  // 1. Program State panel visibility toggle
  // 2. 100% Fullscreen 3D Theater Mode
  const [showStatePanel, setShowStatePanel] = useState(true);
  const [isFull3DView, setIsFull3DView] = useState(false);

  // Direct Form User Input
  const [formInputValues, setFormInputValues] = useState('10, 20, 30, 40');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState(null);

  // Modals & responsive view state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCustomCodeOpen, setIsCustomCodeOpen] = useState(false);
  const [isCodeDoctorOpen, setIsCodeDoctorOpen] = useState(false);
  const [isStriverSheetOpen, setIsStriverSheetOpen] = useState(initialOpenStriver);
  const [activeStriverProblem, setActiveStriverProblem] = useState(null);
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
    cumulativeOutput,
    finalCorrectOutput,
  } = useExecutionTimeline(trace);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((isUp) => {
      setBackendOnline(isUp);
    });
  }, []);

  // Synchronize formInputValues whenever code or selected sample changes
  useEffect(() => {
    const nums = extractNumbersFromCode(code);
    if (nums && nums.length > 0) {
      setFormInputValues(nums.join(', '));
    }
  }, [selectedSample]);

  // Update visualizer state whenever initialConcept changes
  useEffect(() => {
    if (initialConcept) {
      setSelectedSample(initialConcept);
      setCode(initialConcept.code);
      setLastExecutedCode(initialConcept.code);
      if (initialConcept.language) {
        setLanguage(initialConcept.language);
      }
      setTimeComplexity(initialConcept.timeComplexity || 'O(n)');
      setSpaceComplexity(initialConcept.spaceComplexity || 'O(1)');

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
    setLastExecutedCode(prog.code);
    setLanguage('java');
    setTimeComplexity(prog.timeComplexity);
    setSpaceComplexity(prog.spaceComplexity);

    // Update form input field with preset numbers
    const nums = extractNumbersFromCode(prog.code);
    if (nums && nums.length > 0) {
      setFormInputValues(nums.join(', '));
    }

    let finalSteps = null;
    if (backendOnline) {
      try {
        const res = await executeProgram(prog.code, prog.id, 'java');
        if (res && res.steps && res.steps.length > 0) {
          finalSteps = res.steps;
        }
      } catch (e) {}
    }

    if (!finalSteps || finalSteps.length === 0) {
      finalSteps = getExecutionTrace(prog.code, 'java');
    }

    setTrace(finalSteps);
    reset();
    setTimeout(() => play(), 100);

    recordExecutionHistory({
      programTitle: prog.title,
      conceptId: prog.id,
      language: 'java',
      totalSteps: finalSteps.length,
      status: 'COMPLETED',
      code: prog.code,
    });
  };

  // Handle language change from editor
  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    const template = LANGUAGE_DEFAULTS[newLang] || DEFAULT_JAVA_CODE;
    setCode(template);
    setLastExecutedCode(template);
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

    const nums = extractNumbersFromCode(template);
    if (nums && nums.length > 0) {
      setFormInputValues(nums.join(', '));
    }

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
    } else {
      setTrace(getExecutionTrace(template, newLang));
      reset();
    }
  };

  // Directly apply User Form Input into code and 3D visualizer
  const applyNewValuesToCode = async (vals) => {
    if (!vals || vals.length === 0) return;

    const inputStr = vals.join(', ');
    setFormInputValues(inputStr);

    let updatedCode = code;
    const hasBracketNumbers = /\[[0-9,\s\-]+\]/.test(updatedCode);
    const hasBraceNumbers = /\{[0-9,\s\-]+\}/.test(updatedCode);

    if (language === 'python' || language === 'javascript') {
      if (hasBracketNumbers) {
        updatedCode = updatedCode.replace(/\[[0-9,\s\-]+\]/, `[${inputStr}]`);
        setCode(updatedCode);
        setLastExecutedCode(updatedCode);
      }
    } else {
      if (hasBraceNumbers) {
        updatedCode = updatedCode.replace(/\{[0-9,\s\-]+\}/, `{${inputStr}}`);
        setCode(updatedCode);
        setLastExecutedCode(updatedCode);
      }
    }

    // Run dynamic trace with new input values preserving the algorithm
    let newSteps = getExecutionTrace(
      updatedCode,
      language,
      inputStr,
      activeStriverProblem?.archetype
    );

    if (newSteps && newSteps.length > 0) {
      setTrace(newSteps);
      reset();
      setTimeout(() => play(), 60);
    }
  };

  const handleApplyFormInput = () => {
    const vals = extractNumbersFromCode(formInputValues);
    applyNewValuesToCode(vals);
  };

  const handleApplyPresetValues = (vals) => {
    setFormInputValues(vals.join(', '));
    applyNewValuesToCode(vals);
  };

  // Handle user applying custom code from modal
  const handleCustomCodeApply = async ({ code: customCode, language: customLang }) => {
    setLanguage(customLang);
    setCode(customCode);
    setLastExecutedCode(customCode);
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

    const nums = extractNumbersFromCode(customCode);
    if (nums && nums.length > 0) {
      setFormInputValues(nums.join(', '));
    }

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

      recordExecutionHistory({
        programTitle: `Custom ${customLang.toUpperCase()} Code`,
        conceptId: 'custom',
        language: customLang,
        totalSteps: newSteps.length,
        status: 'COMPLETED',
        code: customCode,
      });
    }
  };

  // Execute User Code Pipeline: Code Editor -> Verification -> 3D Trace -> Animation
  const handleRunCode = async () => {
    // If currently playing, clicking pause halts animation
    if (isPlaying) {
      pause();
      return;
    }
    // If paused mid-way and code has not changed, clicking resumes
    if (!isCodeDirty && !isAtEnd && !isAtStart) {
      play();
      return;
    }
    if (!isCodeDirty && isAtStart) {
      play();
      return;
    }

    if (!code || !code.trim()) {
      setExecutionError('Cannot execute empty code! Please write code or select a sample problem.');
      return;
    }

    const nums = extractNumbersFromCode(code);
    if (nums && nums.length > 0) {
      setFormInputValues(nums.join(', '));
    }

    setIsExecuting(true);
    setExecutionError(null);

    try {
      let newSteps = null;
      if (backendOnline) {
        try {
          const conceptId = activeStriverProblem ? `striver-${activeStriverProblem.striverId || activeStriverProblem.id}` : 'custom';
          const [execRes, astRes] = await Promise.all([
            executeProgram(code, conceptId, language, formInputValues),
            analyzeCode(code, language),
          ]);
          if (execRes?.steps?.length > 0) newSteps = execRes.steps;
          if (astRes?.timeComplexity) setTimeComplexity(astRes.timeComplexity);
          if (astRes?.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
        } catch (backendErr) {
          console.warn('Backend execution failed, falling back to simulator:', backendErr);
        }
      }

      if (!newSteps || newSteps.length === 0) {
        newSteps = getExecutionTrace(code, language, formInputValues, activeStriverProblem?.archetype);
      }

      if (newSteps && newSteps.length > 0) {
        setTrace(newSteps);
        setLastExecutedCode(code);
        reset();
        setTimeout(() => play(), 60);

        recordExecutionHistory({
          programTitle: selectedSample?.title || (activeStriverProblem ? activeStriverProblem.title : 'Custom Code Execution'),
          conceptId: activeStriverProblem ? `striver-${activeStriverProblem.striverId || activeStriverProblem.id}` : (selectedSample?.id || 'custom'),
          language: language,
          totalSteps: newSteps.length,
          status: 'COMPLETED',
          code: code,
        });
      } else {
        setExecutionError('Could not parse execution steps for this code. Please check for syntax errors or missing brackets.');
      }
    } catch (err) {
      console.error('Execution pipeline error:', err);
      setExecutionError(`Execution Error: ${err.message || 'Unknown error occurred while parsing code.'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetCode = () => {
    const templateCode = selectedSample?.code || DEFAULT_JAVA_CODE;
    setCode(templateCode);
    setLastExecutedCode(templateCode);
    setExecutionError(null);
    const traceSteps = getExecutionTrace(templateCode, language);
    setTrace(traceSteps);
    reset();
  };

  // Handle Personal Problem applied solution & 3D visualization
  const handleApplyCorrectedCode = async ({
    code: correctedCode,
    language: correctedLang,
    trace: correctedTrace,
    problemTitle,
    timeComplexity: tc,
    spaceComplexity: sc,
    launch3D = true,
  }) => {
    setLanguage(correctedLang);
    setCode(correctedCode);
    setLastExecutedCode(correctedCode);
    if (tc) setTimeComplexity(tc);
    if (sc) setSpaceComplexity(sc);
    setSelectedSample({
      id: 'personal-problem',
      title: problemTitle ? `💡 ${problemTitle}` : `💡 Personal Problem (${correctedLang.toUpperCase()})`,
      category: 'Personal Problem',
      description: 'Custom personal problem solved and fully simulated in 3D WebGL.',
      difficulty: 'Custom',
      timeComplexity: tc || 'O(n)',
      spaceComplexity: sc || 'O(1)',
      code: correctedCode,
    });

    const nums = extractNumbersFromCode(correctedCode);
    if (nums && nums.length > 0) {
      setFormInputValues(nums.join(', '));
    }

    if (correctedTrace && correctedTrace.length > 0) {
      setTrace(correctedTrace);
      reset();
      if (launch3D) {
        setTimeout(() => play(), 50);
      }
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
        if (launch3D) {
          setTimeout(() => play(), 50);
        }
      }
    }

    recordExecutionHistory({
      programTitle: problemTitle ? `💡 ${problemTitle}` : `💡 Personal Problem (${correctedLang.toUpperCase()})`,
      conceptId: 'personal-problem',
      language: correctedLang,
      totalSteps: (correctedTrace?.length || 1),
      status: 'COMPLETED',
      code: correctedCode,
    });
  };

  // Handle user selecting a Striver SDE Sheet question from drawer
  const handleSelectStriverProblem = async (problem) => {
    setIsStriverSheetOpen(false); // Automatically dismiss drawer so 3D scene is immediately visible
    setActiveStriverProblem(problem);
    const sampleObj = {
      id: problem.id || `striver-${problem.striverId}`,
      title: problem.title,
      category: problem.category,
      description: `${problem.day}: ${problem.title}`,
      difficulty: problem.difficulty,
      timeComplexity: problem.timeComplexity,
      spaceComplexity: problem.spaceComplexity,
      code: problem.code,
    };
    setSelectedSample(sampleObj);
    setCode(problem.code);
    setLastExecutedCode(problem.code);
    if (problem.language) setLanguage(problem.language);
    setTimeComplexity(problem.timeComplexity);
    setSpaceComplexity(problem.spaceComplexity);

    if (problem.defaultInput) {
      setFormInputValues(problem.defaultInput);
    }

    // Synthesize verified 3D execution trace with matched archetype and accurate inputs/outputs
    const newSteps = getExecutionTrace(
      problem.code,
      problem.language || language,
      problem.defaultInput,
      problem.archetype
    );

    // Enrich complexity metrics in background if backend is online
    if (backendOnline) {
      analyzeCode(problem.code, problem.language || language)
        .then((astRes) => {
          if (astRes?.timeComplexity) setTimeComplexity(astRes.timeComplexity);
          if (astRes?.spaceComplexity) setSpaceComplexity(astRes.spaceComplexity);
        })
        .catch(() => {});
    }

    if (newSteps && newSteps.length > 0) {
      setTrace(newSteps);
      reset();
      setTimeout(() => play(), 60);

      recordExecutionHistory({
        programTitle: problem.title,
        conceptId: `striver-${problem.striverId || problem.id}`,
        language: problem.language || language,
        totalSteps: newSteps.length,
        status: 'COMPLETED',
        code: problem.code,
      });
    }
  };

  // Synchronized Timeline Play handler
  const handleTimelinePlay = () => {
    if (isCodeDirty) {
      handleRunCode();
    } else {
      if (isAtEnd) {
        goToStep(0);
      }
      play();
    }
  };

  // Window-level Ctrl+Enter / Cmd+Enter listener to trigger instant 3D execution
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.defaultPrevented && !isExecuting && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language, backendOnline, isCodeDirty, isExecuting]);

  return (
    <div className={`studio ${isBright ? 'studio-light' : ''}`}>
      <header className="studio-toolbar">
        <div className="studio-heading"><span className="studio-eyebrow">WORKSPACE</span><h1>Algorithm studio</h1></div>
        <div className="studio-algorithm">
          <select
            value={selectedSample.id}
            onChange={(e) => {
              const val = e.target.value;
              if (val.startsWith('striver-')) {
                const id = parseInt(val.replace('striver-', ''), 10);
                const p = STRIVER_PROBLEMS.find((prob) => prob.id === id);
                if (p) {
                  handleSelectStriverProblem({
                    id: `striver-${p.id}`,
                    striverId: p.id,
                    title: p.title,
                    shortTitle: p.shortTitle,
                    day: p.day,
                    dayNumber: p.dayNumber,
                    category: p.category,
                    difficulty: p.difficulty,
                    archetype: p.archetype,
                    timeComplexity: p.timeComplexity,
                    spaceComplexity: p.spaceComplexity,
                    description: p.description,
                    defaultInput: p.defaultInput,
                    code: p.javaCode,
                    language: 'java',
                  });
                }
              } else {
                const found = SAMPLE_PROGRAMS.find((p) => p.id === val);
                if (found) handleSelectProgram(found);
              }
            }}
            aria-label="Algorithm"
            className="studio-select"
          >
            {(selectedSample.id === 'custom' || selectedSample.id === 'personal-problem') && (
              <option value={selectedSample.id}>
                {selectedSample.title || '⚡ Custom Execution'}
              </option>
            )}
            <optgroup label="📜 Striver SDE Sheet (Top Flagships)">
              {STRIVER_PROBLEMS.slice(0, 40).map((p) => (
                <option key={`striver-${p.id}`} value={`striver-${p.id}`}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </optgroup>
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
        </div>
        <div className="studio-actions">
          <button className="studio-button" onClick={() => setIsCustomCodeOpen(true)}><Code2 size={15} /> Import code</button>
          <details className="studio-tools">
            <summary className="studio-button">Tools <SlidersHorizontal size={14} /></summary>
            <div className="studio-menu" onClick={(event) => { if (event.target.closest('button')) event.currentTarget.parentElement.open = false; }}>
              <button onClick={() => setIsStriverSheetOpen(true)}>Problem library</button>
              <button onClick={() => setIsCodeDoctorOpen(true)}>Code assistant</button>
              <button onClick={() => setIsAiOpen(true)}>Explain this step</button>
              <button onClick={() => setIsQuizOpen(true)}>Practice quiz</button>
              <button onClick={handleResetCode}>Restore example code</button>
              <button onClick={() => setShowStatePanel(value => !value)}>{showStatePanel ? 'Hide' : 'Show'} state panel</button>
            </div>
          </details>
        </div>
      </header>
      <div className="studio-meta"><span>Learning simulation <span className="studio-meta-note">/ Pattern-based, not compiled execution</span></span><span>Time <b>{timeComplexity}</b> <span className="studio-meta-space">Space <b>{spaceComplexity}</b></span></span></div>
      {!isFull3DView && <nav className="studio-tabs" aria-label="Workspace panels">
        {[['code', 'Code'], ['3d', 'Scene'], ['state', 'State']].map(([id, label]) => <button key={id} aria-pressed={mobileTab === id} onClick={() => setMobileTab(id)}>{label}</button>)}
      </nav>}
      {executionError && <div className="studio-error" role="alert"><span>{executionError}</span><button onClick={() => setExecutionError(null)}>Dismiss</button></div>}
      <div className={`studio-grid ${isFull3DView ? 'studio-focus' : ''} ${!showStatePanel ? 'studio-no-state' : ''}`} data-panel={mobileTab}>
        {!isFull3DView && <section className="studio-editor" aria-label="Source code">
          <CodeEditor code={code} onChangeCode={setCode} language={language} onChangeLanguage={handleLanguageChange}
            currentLineNumber={currentStep?.lineNumber || null} isCodeDirty={isCodeDirty} onRunCode={handleRunCode} />
        </section>}
        <section className="studio-scene" aria-label="Visualization">
          <form className="studio-input" onSubmit={(event) => { event.preventDefault(); handleApplyFormInput(); }}>
            <label htmlFor="simulation-input">Input</label>
            <input id="simulation-input" value={formInputValues} onChange={(event) => setFormInputValues(event.target.value)} placeholder="10, 20, 30, 40" />
            <button className="studio-button" disabled={isExecuting} type="submit">Apply</button>
          </form>
          <div className="studio-viewport">
            <SceneContainer currentStep={currentStep} code={code} statusLabel={currentStep?.dataStructureState?.label}
              isFull3DView={isFull3DView} onToggleFull3D={() => setIsFull3DView(value => !value)}>
              <DsaSceneDispatcher dataStructureState={currentStep?.dataStructureState} />
            </SceneContainer>
          </div>
          {!isFull3DView && <div className="studio-output"><OutputConsole output={cumulativeOutput} correctOutput={finalCorrectOutput} isAtEnd={isAtEnd} /></div>}
        </section>
        {!isFull3DView && <aside className="studio-state" aria-label="Program state"><StatePanel currentStep={currentStep} totalSteps={totalSteps} correctOutput={finalCorrectOutput} isAtEnd={isAtEnd} /></aside>}
      </div>
      <Timeline currentStepIndex={currentStepIndex} totalSteps={totalSteps} isPlaying={isPlaying}
        playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} onPlay={handleTimelinePlay}
        isExecuting={isExecuting} isCodeDirty={isCodeDirty} onPause={pause} onPrev={() => { pause(); prevStep(); }} onNext={() => { pause(); nextStep(); }}
        onReset={reset} onGoToStep={index => { pause(); goToStep(index); }} isAtStart={isAtStart} isAtEnd={isAtEnd} />
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
        currentCode={code}
      />

      <StriverSheetDrawer
        isOpen={isStriverSheetOpen}
        onToggle={() => setIsStriverSheetOpen((prev) => !prev)}
        onSelectProblem={handleSelectStriverProblem}
        currentLanguage={language}
      />
    </div>
  );
}
