import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';

const Cursor = () => {
  const { cursorStyle = 'glow' } = useSettings();

  // If cursor is turned off or set to system default, don't render custom cursor elements
  if (cursorStyle === 'off' || cursorStyle === 'default') {
    return null;
  }

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState({
    isHovering: false,
    isGrab: false,
    isGrabbing: false,
    isText: false,
    badgeText: ''
  });
  const [ripples, setRipples] = useState([]);
  const [trail, setTrail] = useState([]);

  const mousePosRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef(null);
  const trailTimerRef = useRef(0);

  // Mouse movement listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mousePosRef.current = { x: clientX, y: clientY };
      setMousePos({ x: clientX, y: clientY });

      // Trail particles when 'trail' cursor style is selected
      if (cursorStyle === 'trail') {
        const now = Date.now();
        if (now - trailTimerRef.current > 45) {
          trailTimerRef.current = now;
          setTrail((prev) => [
            ...prev.slice(-5),
            { id: now, x: clientX, y: clientY }
          ]);
        }
      }

      // Detect hover target
      const target = document.elementFromPoint(clientX, clientY);
      if (!target) return;

      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      const badgeAttr = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
      const isInput = target.closest('input, textarea, [contenteditable="true"]');
      const isClickable = target.closest('button, a, .dock-item, .clickable, [role="button"]');
      const isHeader = target.closest('.window-header');

      let nextHover = !!isClickable;
      let nextGrab = !!isHeader;
      let nextGrabbing = cursorAttr === 'grabbing';
      let nextText = !!isInput;
      let nextBadge = badgeAttr || '';

      if (isClickable && !nextBadge) {
        if (target.closest('.dock-item')) nextBadge = 'Open';
        else if (target.closest('.btn-demo, .btn-repo')) nextBadge = 'Visit';
        else if (target.closest('.theme-mode-card, .wallpaper-thumb-card')) nextBadge = 'Select';
      }

      setCursorState({
        isHovering: nextHover,
        isGrab: nextGrab,
        isGrabbing: nextGrabbing,
        isText: nextText,
        badgeText: nextBadge
      });
    };

    const handleMouseDown = (e) => {
      // Add click ripple
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [cursorStyle]);

  // Smooth lerp for trailing ring
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;
      const target = mousePosRef.current;
      const current = ringPosRef.current;

      // Lerp with 0.18 easing factor
      const nextX = current.x + (target.x - current.x) * 0.18;
      const nextY = current.y + (target.y - current.y) * 0.18;

      ringPosRef.current = { x: nextX, y: nextY };
      setRingPos({ x: nextX, y: nextY });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Clean up old ripples
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 500);
    return () => clearTimeout(timer);
  }, [ripples]);

  // Clean up old trail particles
  useEffect(() => {
    if (trail.length === 0) return;
    const timer = setTimeout(() => {
      setTrail((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timer);
  }, [trail]);

  return (
    <div className="custom-cursor-layer" aria-hidden="true">
      {/* 1. Sparkle Trail Particles */}
      {cursorStyle === 'trail' &&
        trail.map((p) => (
          <div
            key={p.id}
            className="cursor-trail-particle"
            style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
          />
        ))}

      {/* 2. Click Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="cursor-click-ripple"
          style={{ transform: `translate(${r.x}px, ${r.y}px)` }}
        />
      ))}

      {/* 3. Smooth Lerp Ring */}
      <div
        className={`cursor-ring ${cursorState.isHovering ? 'is-hovering' : ''} ${
          cursorState.isGrab ? 'is-grab' : ''
        } ${cursorState.isGrabbing ? 'is-grabbing' : ''} ${
          cursorState.isText ? 'is-text' : ''
        }`}
        style={{
          transform: `translate(${ringPos.x}px, ${ringPos.y}px)`
        }}
      >
        {cursorState.badgeText && (
          <span className="cursor-badge-text">{cursorState.badgeText}</span>
        )}
      </div>

      {/* 4. Solid Immediate Dot */}
      <div
        className={`cursor-dot ${cursorState.isText ? 'is-text' : ''}`}
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      />
    </div>
  );
};

export default Cursor;
