import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for Time Machine execution controls
 */
export function useExecutionTimeline(trace = []) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 1.5, 2
  const timerRef = useRef(null);

  const totalSteps = trace.length;
  const currentStep = trace[currentStepIndex] || null;
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      pause();
      return prev;
    });
  }, [totalSteps, pause]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, totalSteps - 1));
    setCurrentStepIndex(clamped);
  }, [totalSteps]);

  const play = useCallback(() => {
    if (isAtEnd) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [isAtEnd]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const reset = useCallback(() => {
    pause();
    setCurrentStepIndex(0);
  }, [pause]);

  // Interval timer for playback
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1500 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, totalSteps]);

  return {
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
    togglePlay,
    reset,
  };
}
