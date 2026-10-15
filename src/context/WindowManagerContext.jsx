import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

const WindowManagerContext = createContext();

export const WINDOW_CONFIGS = {
  projects: {
    id: 'projects',
    title: 'Finder — Projects & Repositories',
    appName: 'Finder',
    defaultSize: { width: 840, height: 560 },
    defaultPos: { x: 120, y: 55 },
    minWidth: 480,
    minHeight: 360
  },
  notes: {
    id: 'notes',
    title: 'Notes — Profile & Architecture',
    appName: 'Notes',
    defaultSize: { width: 820, height: 560 },
    defaultPos: { x: 180, y: 75 },
    minWidth: 480,
    minHeight: 360
  },
  resume: {
    id: 'resume',
    title: 'Preview — Shefali_Yadav_Resume.pdf',
    appName: 'Preview',
    defaultSize: { width: 720, height: 640 },
    defaultPos: { x: 260, y: 50 },
    minWidth: 440,
    minHeight: 400
  },
  terminal: {
    id: 'terminal',
    title: 'shefaliyadav — zsh (80x24)',
    appName: 'Terminal',
    defaultSize: { width: 680, height: 460 },
    defaultPos: { x: 220, y: 110 },
    minWidth: 440,
    minHeight: 300
  },
  calendar: {
    id: 'calendar',
    title: 'Calendar — Schedule & Milestones',
    appName: 'Calendar',
    defaultSize: { width: 720, height: 500 },
    defaultPos: { x: 200, y: 80 },
    minWidth: 480,
    minHeight: 360
  },
  mail: {
    id: 'mail',
    title: 'Mail — New Message',
    appName: 'Mail',
    defaultSize: { width: 620, height: 500 },
    defaultPos: { x: 250, y: 90 },
    minWidth: 400,
    minHeight: 360
  },
  music: {
    id: 'music',
    title: 'Music — Lo-Fi Chill',
    appName: 'Music',
    defaultSize: { width: 330, height: 440 },
    defaultPos: { x: 360, y: 110 },
    minWidth: 300,
    minHeight: 400
  },
  settings: {
    id: 'settings',
    title: 'System Settings',
    appName: 'System Settings',
    defaultSize: { width: 780, height: 540 },
    defaultPos: { x: 160, y: 70 },
    minWidth: 500,
    minHeight: 400
  }
};

export const WindowManagerProvider = ({ children }) => {
  const [windows, setWindows] = useState({
    projects: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 101, ...WINDOW_CONFIGS.projects.defaultPos, ...WINDOW_CONFIGS.projects.defaultSize },
    notes: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 102, ...WINDOW_CONFIGS.notes.defaultPos, ...WINDOW_CONFIGS.notes.defaultSize },
    resume: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 103, ...WINDOW_CONFIGS.resume.defaultPos, ...WINDOW_CONFIGS.resume.defaultSize },
    terminal: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 104, ...WINDOW_CONFIGS.terminal.defaultPos, ...WINDOW_CONFIGS.terminal.defaultSize },
    calendar: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 105, ...WINDOW_CONFIGS.calendar.defaultPos, ...WINDOW_CONFIGS.calendar.defaultSize },
    mail: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 106, ...WINDOW_CONFIGS.mail.defaultPos, ...WINDOW_CONFIGS.mail.defaultSize },
    music: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 107, ...WINDOW_CONFIGS.music.defaultPos, ...WINDOW_CONFIGS.music.defaultSize },
    settings: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 108, ...WINDOW_CONFIGS.settings.defaultPos, ...WINDOW_CONFIGS.settings.defaultSize }
  });

  const [activeWindowId, setActiveWindowId] = useState(null);
  const [topZIndex, setTopZIndex] = useState(200);

  const bringToFront = (id) => {
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => ({
        ...w,
        [id]: { ...w[id], zIndex: nextZ, isMinimized: false }
      }));
      return nextZ;
    });
    setActiveWindowId(id);
  };

  const openWindow = (id) => {
    sounds.pop();
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => ({
        ...w,
        [id]: {
          ...w[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ
        }
      }));
      return nextZ;
    });
    setActiveWindowId(id);
  };

  const closeWindow = (id) => {
    sounds.click();
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isOpen: false, isMaximized: false }
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id) => {
    sounds.click();
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isMinimized: true }
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleMaximize = (id) => {
    sounds.click();
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isMaximized: !w[id]?.isMaximized }
    }));
  };

  const updatePosition = (id, pos) => {
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], x: pos.x, y: pos.y }
    }));
  };

  const updateSize = (id, size) => {
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], width: size.width, height: size.height }
    }));
  };

  // Signature Recruiter Mode: Neatly tiles Resume + Projects + Mail with celebratory confetti!
  const recruiterMode = () => {
    sounds.success();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const isSmall = screenWidth < 1000;

    setTopZIndex((prev) => {
      const baseZ = prev + 10;
      setWindows((w) => ({
        ...w,
        resume: {
          ...w.resume,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: baseZ + 3,
          x: isSmall ? 20 : 40,
          y: 45,
          width: isSmall ? screenWidth - 40 : 540,
          height: 600
        },
        projects: {
          ...w.projects,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: baseZ + 2,
          x: isSmall ? 40 : 600,
          y: 45,
          width: isSmall ? screenWidth - 80 : Math.min(680, screenWidth - 620),
          height: 380
        },
        mail: {
          ...w.mail,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: baseZ + 1,
          x: isSmall ? 60 : 640,
          y: 445,
          width: isSmall ? screenWidth - 100 : Math.min(580, screenWidth - 660),
          height: 250
        }
      }));
      return baseZ + 4;
    });

    setActiveWindowId('resume');
  };

  // Developer Mode: Tiles Terminal and Notes with code view
  const developerMode = () => {
    sounds.click();
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

    setTopZIndex((prev) => {
      const baseZ = prev + 10;
      setWindows((w) => ({
        ...w,
        terminal: {
          ...w.terminal,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: baseZ + 2,
          x: 40,
          y: 50,
          width: Math.min(580, (screenWidth - 100) / 2),
          height: 560
        },
        notes: {
          ...w.notes,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: baseZ + 1,
          x: Math.min(640, (screenWidth - 100) / 2 + 60),
          y: 50,
          width: Math.min(640, (screenWidth - 100) / 2),
          height: 560
        }
      }));
      return baseZ + 3;
    });

    setActiveWindowId('terminal');
  };

  // Close all open windows
  const closeAllWindows = () => {
    setWindows((w) => {
      const next = {};
      Object.keys(w).forEach((key) => {
        next[key] = { ...w[key], isOpen: false };
      });
      return next;
    });
    setActiveWindowId(null);
  };

  const getActiveApp = () => {
    if (!activeWindowId) return 'Finder';
    return WINDOW_CONFIGS[activeWindowId]?.appName || 'Finder';
  };

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        toggleMaximize,
        bringToFront,
        updatePosition,
        updateSize,
        recruiterMode,
        developerMode,
        closeAllWindows,
        getActiveApp
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider');
  }
  return context;
};
