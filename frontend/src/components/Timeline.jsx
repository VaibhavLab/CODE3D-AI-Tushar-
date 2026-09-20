import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Clock,
  Gauge,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Timeline({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  onPlay,
  onPause,
  onPrev,
  onNext,
  onReset,
  onGoToStep,
  isAtStart,
  isAtEnd,
  isCodeDirty = false,
}) {
  const { isBright } = useTheme();
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className={`border-t px-4 py-2.5 select-none flex flex-col gap-2 transition-colors ${
      isBright
        ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
        : 'bg-[#070b14]/95 border-slate-800/90 text-slate-200'
    }`}>
      {/* Top Bar: Controls & Status */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            className={`p-1.5 rounded-lg transition ${
              isBright
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Reset to Step 1"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={onPrev}
            disabled={isAtStart}
            className={`p-1.5 rounded-lg border transition ${
              isAtStart
                ? isBright
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-800 text-slate-600 cursor-not-allowed'
                : isBright
                ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Step Back"
          >
            <SkipBack size={15} />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isBright
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              }`}
              title="Pause Simulation"
            >
              <Pause size={14} className="fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-md ${
                isCodeDirty
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/40 animate-pulse'
                  : isBright
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-600/30'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
              }`}
              title={isCodeDirty ? 'Execute newly modified code in 3D (Ctrl+Enter)' : 'Play Simulation'}
            >
              <Play size={14} className="fill-current" />
              <span>{isCodeDirty ? 'Run ⚡' : isAtEnd ? 'Replay' : 'Play'}</span>
            </button>
          )}

          <button
            onClick={onNext}
            disabled={isAtEnd}
            className={`p-1.5 rounded-lg border transition ${
              isAtEnd
                ? isBright
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-800 text-slate-600 cursor-not-allowed'
                : isBright
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                : 'border-cyan-600/70 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60'
            }`}
            title="Step Forward"
          >
            <SkipForward size={15} />
          </button>
        </div>

        {/* Time Machine Label */}
        <div className="flex items-center gap-2 shrink-0">
          <Clock size={14} className={isBright ? 'text-cyan-600' : 'text-cyan-400'} />
          <span className={`text-xs font-semibold tracking-wider uppercase ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
            Time Machine
          </span>
          <span className={`text-xs font-mono font-medium ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
            [Step {currentStepIndex + 1} / {totalSteps}]
          </span>
        </div>

        {/* Playback Speed Switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Gauge size={13} className={isBright ? 'text-slate-400' : 'text-slate-500'} />
          <span className={`text-[11px] mr-1 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                playbackSpeed === s
                  ? isBright
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-400 font-bold'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                  : isBright
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Step Timeline Scrubber */}
      <div className="relative pt-1.5 pb-1 flex items-center">
        {/* Background track line */}
        <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full ${
          isBright ? 'bg-slate-200' : 'bg-slate-800'
        }`}></div>

        {/* Progress track line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-200"
          style={{
            width: `${(currentStepIndex / Math.max(1, totalSteps - 1)) * 100}%`,
          }}
        ></div>

        {/* Step Nodes / Dots */}
        <div className="relative w-full flex justify-between items-center z-10">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <button
                key={idx}
                onClick={() => onGoToStep(idx)}
                className={`group relative flex flex-col items-center focus:outline-none transition-transform ${
                  isActive ? 'scale-125' : 'hover:scale-110'
                }`}
                title={`Jump to Step ${idx + 1}`}
              >
                {/* Outer halo / dot */}
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? isBright
                        ? 'bg-cyan-600 ring-4 ring-cyan-400/40 shadow-md'
                        : 'bg-cyan-400 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-400/50'
                      : isCompleted
                      ? isBright
                        ? 'bg-cyan-500 border border-cyan-400'
                        : 'bg-cyan-600 border border-cyan-400/50'
                      : isBright
                      ? 'bg-slate-300 border border-slate-400 group-hover:border-slate-500'
                      : 'bg-slate-800 border border-slate-700 group-hover:border-slate-500'
                  }`}
                >
                  {isActive && <div className={`w-1.5 h-1.5 rounded-full ${isBright ? 'bg-white' : 'bg-slate-950'}`} />}
                </div>

                {/* Step number label under dot */}
                <span
                  className={`text-[10px] font-mono mt-1 transition-colors ${
                    isActive
                      ? isBright
                        ? 'text-cyan-800 font-bold'
                        : 'text-cyan-300 font-bold'
                      : isCompleted
                      ? isBright
                        ? 'text-slate-600'
                        : 'text-slate-400'
                      : isBright
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
