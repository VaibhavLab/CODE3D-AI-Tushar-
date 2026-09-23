import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export default function Timeline({ currentStepIndex, totalSteps, isPlaying, playbackSpeed, setPlaybackSpeed,
  onPlay, onPause, onPrev, onNext, onReset, onGoToStep, isAtStart, isAtEnd, isCodeDirty, isExecuting }) {
  return (
    <footer className="studio-timeline" aria-label="Simulation playback">
      <div className="studio-playback">
        <button className="studio-icon-button" onClick={onReset} disabled={isExecuting || !totalSteps} aria-label="Reset playback"><RotateCcw size={16} /></button>
        <button className="studio-icon-button" onClick={onPrev} disabled={isExecuting || isAtStart} aria-label="Previous step"><SkipBack size={16} /></button>
        <button className="studio-button studio-primary" disabled={isExecuting || (!totalSteps && !isCodeDirty)} onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          {isExecuting ? 'Preparing...' : isPlaying ? 'Pause' : isCodeDirty ? 'Run code' : isAtEnd ? 'Replay' : 'Play'}
        </button>
        <button className="studio-icon-button" onClick={onNext} disabled={isExecuting || isAtEnd} aria-label="Next step"><SkipForward size={16} /></button>
      </div>
      <div className="studio-scrubber">
        <label htmlFor="execution-step">Step {totalSteps ? currentStepIndex + 1 : 0}<span> / {totalSteps}</span></label>
        <input id="execution-step" type="range" min="0" max={Math.max(0, totalSteps - 1)} value={currentStepIndex}
          disabled={isExecuting || totalSteps < 2} onChange={event => onGoToStep(Number(event.target.value))}
          aria-valuetext={`Step ${currentStepIndex + 1} of ${totalSteps}`} />
      </div>
      <label className="studio-speed">Speed
        <select aria-label="Playback speed" value={playbackSpeed} onChange={event => setPlaybackSpeed(Number(event.target.value))}>
          {[0.5, 1, 1.5, 2].map(speed => <option key={speed} value={speed}>{speed}x</option>)}
        </select>
      </label>
    </footer>
  );
}
