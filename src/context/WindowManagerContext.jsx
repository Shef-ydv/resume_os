import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

const WindowManagerContext = createContext();

const WINDOWS_STORAGE_KEY = 'resume_os_windows_v2';

export const WINDOW_CONFIGS = {
  projects: {
    id: 'projects',
    title: 'Finder — Projects & Repositories',
    appName: 'Finder',
    iconPath: '/icons/github.svg',
    defaultSize: { width: 840, height: 560 },
    defaultPos: { x: 80, y: 50 },
    minWidth: 460,
    minHeight: 360
  },
  notes: {
    id: 'notes',
    title: 'Notes — Profile & Architecture',
    appName: 'Notes',
    iconPath: '/icons/sticky-note.svg',
    defaultSize: { width: 820, height: 560 },
    defaultPos: { x: 130, y: 80 },
    minWidth: 460,
    minHeight: 360
  },
  resume: {
    id: 'resume',
    title: 'Preview — Shefali_Yadav_Resume.pdf',
    appName: 'Preview',
    iconPath: '/icons/file-text.svg',
    defaultSize: { width: 720, height: 620 },
    defaultPos: { x: 180, y: 60 },
    minWidth: 440,
    minHeight: 380
  },
  terminal: {
    id: 'terminal',
    title: 'shefaliyadav — zsh (80x24)',
    appName: 'Terminal',
    iconPath: '/icons/terminal.svg',
    defaultSize: { width: 680, height: 460 },
    defaultPos: { x: 230, y: 120 },
    minWidth: 440,
    minHeight: 320
  },
  calendar: {
    id: 'calendar',
    title: 'Calendar — Schedule & Milestones',
    appName: 'Calendar',
    iconPath: '/icons/googlecalendar.svg',
    defaultSize: { width: 720, height: 500 },
    defaultPos: { x: 260, y: 80 },
    minWidth: 480,
    minHeight: 360
  },
  mail: {
    id: 'mail',
    title: 'Mail — New Message',
    appName: 'Mail',
    iconPath: '/icons/mail.svg',
    defaultSize: { width: 620, height: 500 },
    defaultPos: { x: 300, y: 100 },
    minWidth: 420,
    minHeight: 360
  },
  music: {
    id: 'music',
    title: 'Music — Lo-Fi Chill',
    appName: 'Music',
    iconPath: '/icons/spotify.svg',
    defaultSize: { width: 340, height: 460 },
    defaultPos: { x: 360, y: 110 },
    minWidth: 320,
    minHeight: 400
  },
  settings: {
    id: 'settings',
    title: 'System Settings',
    appName: 'System Settings',
    iconPath: '/navbar-icons/apple.svg',
    defaultSize: { width: 780, height: 540 },
    defaultPos: { x: 160, y: 70 },
    minWidth: 500,
    minHeight: 400
  }
};

const getInitialWindows = () => {
  const defaults = {};
  Object.keys(WINDOW_CONFIGS).forEach((id, idx) => {
    defaults[id] = {
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 100 + idx,
      ...WINDOW_CONFIGS[id].defaultPos,
      ...WINDOW_CONFIGS[id].defaultSize
    };
  });

  try {
    const saved = localStorage.getItem(WINDOWS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved coordinates while defaulting isOpen to false for clean boot
      const merged = { ...defaults };
      Object.keys(parsed).forEach((k) => {
        if (merged[k]) {
          merged[k] = { ...merged[k], ...parsed[k], isOpen: false, isMinimized: false };
        }
      });
      return merged;
    }
  } catch {
    // Ignore localStorage errors
  }
  return defaults;
};

export const WindowManagerProvider = ({ children }) => {
  const [windows, setWindows] = useState(getInitialWindows);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [topZIndex, setTopZIndex] = useState(250);
  const [isMissionControlOpen, setIsMissionControlOpen] = useState(false);
  const [snapPreview, setSnapPreview] = useState(null); // null | 'left' | 'right' | 'top'
  const [openCounter, setOpenCounter] = useState(0);

  // Save coordinates to localStorage when changed
  useEffect(() => {
    try {
      const toSave = {};
      Object.keys(windows).forEach((k) => {
        toSave[k] = {
          x: windows[k].x,
          y: windows[k].y,
          width: windows[k].width,
          height: windows[k].height
        };
      });
      localStorage.setItem(WINDOWS_STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignore
    }
  }, [windows]);

  // Keyboard shortcuts: F3 or Ctrl+Up for Mission Control, Ctrl+Alt+T / Alt+T for Tile
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Mission Control: F3 or Ctrl + ArrowUp
      if (e.key === 'F3' || (e.ctrlKey && e.key === 'ArrowUp')) {
        e.preventDefault();
        toggleMissionControl();
      }
      // Tile Windows: Ctrl + Alt + T or Alt + T
      if ((e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') || (e.altKey && e.key.toLowerCase() === 't')) {
        e.preventDefault();
        tileWindows();
      }
      // Escape closes Mission Control
      if (e.key === 'Escape' && isMissionControlOpen) {
        setIsMissionControlOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMissionControlOpen]);

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
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => {
        const currentWin = w[id];
        // If opening for first time or was closed, cascade offset it
        const nextCount = openCounter + 1;
        setOpenCounter(nextCount);

        const cascadeX = Math.min(70 + (nextCount * 36) % Math.max(100, screenWidth - 520), screenWidth - 460);
        const cascadeY = Math.min(45 + (nextCount * 30) % Math.max(100, screenHeight - 420), screenHeight - 340);

        return {
          ...w,
          [id]: {
            ...currentWin,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
            x: currentWin.x ?? cascadeX,
            y: Math.max(34, currentWin.y ?? cascadeY)
          }
        };
      });
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
      [id]: {
        ...w[id],
        x: pos.x,
        y: Math.max(32, pos.y) // Title bar can NEVER go under the top menubar!
      }
    }));
  };

  const updateSize = (id, size) => {
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], width: size.width, height: size.height }
    }));
  };

  // 1. Cascade Windows (offset diagonal overlap)
  const cascadeWindows = () => {
    sounds.click();
    const openIds = Object.keys(windows).filter((k) => windows[k].isOpen && !windows[k].isMinimized);
    if (openIds.length === 0) return;

    setWindows((w) => {
      const next = { ...w };
      openIds.forEach((id, idx) => {
        next[id] = {
          ...next[id],
          isMaximized: false,
          x: 60 + idx * 40,
          y: 45 + idx * 35,
          zIndex: 260 + idx
        };
      });
      return next;
    });
  };

  // 2. Tile Windows Side by Side (all open windows visible simultaneously)
  const tileWindows = () => {
    sounds.click();
    let openIds = Object.keys(windows).filter((k) => windows[k].isOpen && !windows[k].isMinimized);

    // If no windows open, open Projects and Terminal to demonstrate tile
    if (openIds.length === 0) {
      openIds = ['projects', 'terminal'];
    }

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const availableHeight = screenHeight - 34 - 82; // below 34px menubar and above dock

    setWindows((w) => {
      const next = { ...w };
      const N = openIds.length;

      if (N === 1) {
        const id = openIds[0];
        next[id] = {
          ...next[id],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: Math.max(20, (screenWidth - 860) / 2),
          y: 40,
          width: Math.min(860, screenWidth - 40),
          height: availableHeight
        };
      } else if (N === 2) {
        const colWidth = Math.floor((screenWidth - 24) / 2);
        // Window 1: Left 50%
        next[openIds[0]] = {
          ...next[openIds[0]],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: 8,
          y: 36,
          width: colWidth,
          height: availableHeight
        };
        // Window 2: Right 50%
        next[openIds[1]] = {
          ...next[openIds[1]],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: colWidth + 16,
          y: 36,
          width: colWidth,
          height: availableHeight
        };
      } else if (N === 3) {
        const colWidth = Math.floor((screenWidth - 24) / 2);
        const halfHeight = Math.floor((availableHeight - 10) / 2);
        // Window 1: Left 50% (full height)
        next[openIds[0]] = {
          ...next[openIds[0]],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: 8,
          y: 36,
          width: colWidth,
          height: availableHeight
        };
        // Window 2: Right Top 50%
        next[openIds[1]] = {
          ...next[openIds[1]],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: colWidth + 16,
          y: 36,
          width: colWidth,
          height: halfHeight
        };
        // Window 3: Right Bottom 50%
        next[openIds[2]] = {
          ...next[openIds[2]],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x: colWidth + 16,
          y: 36 + halfHeight + 10,
          width: colWidth,
          height: halfHeight
        };
      } else {
        // 4 or more: 2x2 grid
        const colWidth = Math.floor((screenWidth - 24) / 2);
        const rowHeight = Math.floor((availableHeight - 12) / 2);
        openIds.slice(0, 4).forEach((id, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          next[id] = {
            ...next[id],
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            x: 8 + col * (colWidth + 8),
            y: 36 + row * (rowHeight + 8),
            width: colWidth,
            height: rowHeight
          };
        });
      }
      return next;
    });

    sounds.pop();
  };

  // 3. Mission Control (Show all open windows in scaled preview grid)
  const toggleMissionControl = () => {
    sounds.click();
    setIsMissionControlOpen((prev) => !prev);
  };

  // Apply edge snap to window on release
  const applySnap = (id, snapType) => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const availableHeight = screenHeight - 34 - 76;

    if (snapType === 'top') {
      sounds.pop();
      setWindows((w) => ({
        ...w,
        [id]: { ...w[id], isMaximized: true }
      }));
    } else if (snapType === 'left') {
      sounds.pop();
      setWindows((w) => ({
        ...w,
        [id]: {
          ...w[id],
          isMaximized: false,
          x: 8,
          y: 36,
          width: Math.floor(screenWidth / 2) - 12,
          height: availableHeight
        }
      }));
    } else if (snapType === 'right') {
      sounds.pop();
      setWindows((w) => ({
        ...w,
        [id]: {
          ...w[id],
          isMaximized: false,
          x: Math.floor(screenWidth / 2) + 4,
          y: 36,
          width: Math.floor(screenWidth / 2) - 12,
          height: availableHeight
        }
      }));
    }
    setSnapPreview(null);
  };

  // Signature Recruiter Mode: Neatly tiles Resume + Projects + Mail with celebratory confetti!
  const recruiterMode = () => {
    sounds.success();
    confetti({
      particleCount: 90,
      spread: 75,
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
          y: 42,
          width: isSmall ? screenWidth - 40 : 560,
          height: 600
        },
        projects: {
          ...w.projects,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: baseZ + 2,
          x: isSmall ? 40 : 620,
          y: 42,
          width: isSmall ? screenWidth - 80 : Math.min(680, screenWidth - 640),
          height: 380
        },
        mail: {
          ...w.mail,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: baseZ + 1,
          x: isSmall ? 60 : 660,
          y: 442,
          width: isSmall ? screenWidth - 100 : Math.min(600, screenWidth - 680),
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
          y: 48,
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
          y: 48,
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
        cascadeWindows,
        tileWindows,
        isMissionControlOpen,
        toggleMissionControl,
        snapPreview,
        setSnapPreview,
        applySnap,
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
