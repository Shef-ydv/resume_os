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
  hasBooted: false,
  isLocked: false
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed, isLocked: false };
      }
    } catch {
      // localStorage unavailable or invalid JSON
    }
    return DEFAULT_SETTINGS;
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
    updateSettings({ hasBooted: true, isLocked: true });
    sounds.startupChime();
  };

  const restartSystem = () => {
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
        restartSystem
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
