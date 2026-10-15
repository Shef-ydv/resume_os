import React, { createContext, useContext, useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';

const SettingsContext = createContext();

const STORAGE_KEY = 'resume_os_settings_v2';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  wallpaper: 'dark-bokeh',
  accent: 'blue',
  dockSize: 50,
  dockMagnification: true,
  dockPosition: 'bottom',
  soundEnabled: true,
  fontSize: 'medium', // 'small' | 'medium' | 'large'
  cursorStyle: 'glow', // 'glow' | 'trail' | 'default' | 'off'
  showIntro: true, // Show minimal classic loading screen on startup
  hasBooted: false,
  isLocked: false
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    let initialHasBooted = false;
    try {
      const introSeen = sessionStorage.getItem('resume_os_intro_seen') === 'true';
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.showIntro === false || introSeen) {
          initialHasBooted = true;
        }
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          hasBooted: initialHasBooted,
          isLocked: false
        };
      } else if (introSeen) {
        initialHasBooted = true;
      }
    } catch {
      // storage unavailable
    }
    return { ...DEFAULT_SETTINGS, hasBooted: initialHasBooted };
  });

  // Keep sound effects synchronized
  useEffect(() => {
    sounds.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Synchronize CSS attributes on root document
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    // Handle theme (support auto based on system)
    let activeTheme = settings.theme;
    if (activeTheme === 'auto') {
      activeTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    root.setAttribute('data-theme', activeTheme);
    root.setAttribute('data-wallpaper', settings.wallpaper);
    root.setAttribute('data-accent', settings.accent);

    // Dynamic Font Scale
    const fontScales = { small: '0.9', medium: '1', large: '1.15' };
    const activeScale = fontScales[settings.fontSize] || '1';
    root.style.setProperty('--font-scale', activeScale);

    // Cursor Style
    root.setAttribute('data-cursor-style', settings.cursorStyle || 'glow');
  }, [settings]);

  const updateSettings = (keyOrObj, value) => {
    setSettings((prev) => {
      if (typeof keyOrObj === 'object') {
        return { ...prev, ...keyOrObj };
      }
      return { ...prev, [keyOrObj]: value };
    });
  };

  const toggleSound = () => {
    updateSettings('soundEnabled', !settings.soundEnabled);
  };

  const lockScreen = () => {
    updateSettings('isLocked', true);
  };

  const unlockScreen = () => {
    updateSettings('isLocked', false);
    sounds.click();
  };

  const completeBoot = () => {
    try {
      sessionStorage.setItem('resume_os_intro_seen', 'true');
    } catch {
      // storage unavailable
    }
    updateSettings({ hasBooted: true, isLocked: false });
  };

  const restartSystem = () => {
    try {
      sessionStorage.removeItem('resume_os_intro_seen');
    } catch {
      // storage unavailable
    }
    updateSettings({ hasBooted: false, isLocked: false });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        updateSettings,
        toggleSound,
        lockScreen,
        unlockScreen,
        completeBoot,
        restartSystem,
        replayIntro: restartSystem
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
