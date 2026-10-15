import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LOADING_CONFIG } from '../../data/loadingConfig';

const LoadingScreen = ({ onComplete }) => {
  const { texts, timings } = LOADING_CONFIG;

  const [nameVisible, setNameVisible] = useState(false);
  const [underlineVisible, setUnderlineVisible] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const hasExitedRef = useRef(false);
  const timersRef = useRef([]);

  // Safe exit and completion trigger
  const handleComplete = useCallback(() => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    // Trigger exit fade & scale
    setIsExiting(true);

    try {
      sessionStorage.setItem('resume_os_intro_seen', 'true');
    } catch {
      // sessionStorage unavailable
    }

    const exitTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, timings.exitDuration);

    timersRef.current.push(exitTimer);
  }, [onComplete, timings.exitDuration]);

  // Skip handler (click anywhere or press any key)
  const handleSkip = useCallback(() => {
    if (hasExitedRef.current) return;
    // Clear all pending staged timers
    timersRef.current.forEach((t) => clearTimeout(t));
    handleComplete();
  }, [handleComplete]);

  // Main Staggered Timeline
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setNameVisible(true);
      setUnderlineVisible(true);
      setRoleVisible(true);
      setProgressVisible(true);
      setProgress(100);

      const fastTimer = setTimeout(() => {
        handleComplete();
      }, 1000);
      timersRef.current.push(fastTimer);
      return () => clearTimeout(fastTimer);
    }

    // Stage 1: Name fades in & moves up
    const t1 = setTimeout(() => {
      setNameVisible(true);
    }, timings.nameFadeDelay);

    // Stage 2: Underline draws outward
    const t2 = setTimeout(() => {
      setUnderlineVisible(true);
    }, timings.underlineDelay);

    // Stage 3: Role fades in with soft blinking cursor
    const t3 = setTimeout(() => {
      setRoleVisible(true);
    }, timings.roleFadeDelay);

    // Stage 4: Progress line container fades in
    const t4 = setTimeout(() => {
      setProgressVisible(true);
    }, timings.progressStartDelay);

    timersRef.current.push(t1, t2, t3, t4);

    // Animate progress line smoothly from 0 to 100
    const progressStartTime = Date.now() + timings.progressStartDelay;
    const progressEndTime = progressStartTime + timings.progressDuration;

    const progressInterval = setInterval(() => {
      const now = Date.now();
      if (now < progressStartTime) return;

      if (now >= progressEndTime) {
        setProgress(100);
        clearInterval(progressInterval);
        const exitTimer = setTimeout(() => {
          handleComplete();
        }, 150);
        timersRef.current.push(exitTimer);
      } else {
        const elapsed = now - progressStartTime;
        const currentPercent = Math.min(100, (elapsed / timings.progressDuration) * 100);
        setProgress(currentPercent);
      }
    }, 25);

    return () => {
      clearInterval(progressInterval);
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, [timings, handleComplete]);

  // Global "Press any key to skip" listener
  useEffect(() => {
    const handleKeyDown = () => {
      handleSkip();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  return (
    <div
      className={`loading-screen ${isExiting ? 'is-exiting' : ''}`}
      onClick={handleSkip}
      role="banner"
      aria-label="Loading Screen"
    >
      {/* Centered Hero Content */}
      <div className="loading-content">
        {/* Hero Name: "Shefali Yadav" */}
        <h1 className={`loading-name ${nameVisible ? 'is-visible' : ''}`}>
          {texts.name}
        </h1>

        {/* Thin Accent Underline */}
        <div
          className={`loading-underline ${underlineVisible ? 'is-visible' : ''}`}
          aria-hidden="true"
        />

        {/* Subtitle: "Full Stack Developer" + soft blinking cursor */}
        <div className={`loading-role ${roleVisible ? 'is-visible' : ''}`}>
          <span>{texts.role}</span>
          <span className="loading-cursor" aria-hidden="true">_</span>
        </div>
      </div>

      {/* Bottom Area: Thin Progress Line & "Loading..." */}
      <div className={`loading-bottom ${progressVisible ? 'is-visible' : ''}`}>
        <div className="loading-track" aria-hidden="true">
          <div
            className="loading-fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <div className="loading-status">{texts.loadingText}</div>
      </div>

      {/* Bottom Corner: "Resume OS v2.0" */}
      <div className="loading-version" aria-hidden="true">
        {texts.versionText}
      </div>
    </div>
  );
};

export default LoadingScreen;
