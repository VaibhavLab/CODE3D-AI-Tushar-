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
}) {
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="bg-slate-900/95 border-t border-slate-800/90 px-4 py-3 select-none flex flex-col gap-2">
      {/* Top Bar: Controls & Status */}
      <div className="flex items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Reset Time Machine (Step 1)"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={onPrev}
            disabled={isAtStart}
            className={`p-1.5 rounded-lg border transition ${
              isAtStart
                ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Step Back"
          >
            <SkipBack size={15} />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold transition"
            >
              <Pause size={14} className="fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-bold transition shadow-md shadow-cyan-500/20"
            >
              <Play size={14} className="fill-current" />
              <span>{isAtEnd ? 'Replay' : 'Play'}</span>
            </button>
          )}

          <button
            onClick={onNext}
            disabled={isAtEnd}
            className={`p-1.5 rounded-lg border transition ${
              isAtEnd
                ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                : 'border-cyan-600/70 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60'
            }`}
            title="Step Forward"
          >
            <SkipForward size={15} />
          </button>
        </div>

        {/* Time Machine Label */}
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Time Machine
          </span>
          <span className="text-xs font-mono text-slate-500">
            [Step {currentStepIndex + 1} / {totalSteps}]
          </span>
        </div>

        {/* Playback Speed Switcher */}
        <div className="flex items-center gap-1.5">
          <Gauge size={13} className="text-slate-500" />
          <span className="text-[11px] text-slate-400 mr-1">Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                playbackSpeed === s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Step Timeline Scrubber */}
      <div className="relative pt-2 pb-1 flex items-center">
        {/* Background track line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full"></div>

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
                      ? 'bg-cyan-400 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-400/50'
                      : isCompleted
                      ? 'bg-cyan-600 border border-cyan-400/50'
                      : 'bg-slate-800 border border-slate-700 group-hover:border-slate-500'
                  }`}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>

                {/* Step number label under dot */}
                <span
                  className={`text-[10px] font-mono mt-1 transition-colors ${
                    isActive
                      ? 'text-cyan-300 font-bold'
                      : isCompleted
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
