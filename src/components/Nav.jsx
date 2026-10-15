import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Wifi,
  Sliders,
  Search,
  Check,
  Power,
  Lock,
  Moon,
  Sun
} from 'lucide-react';
import { useWindowManager } from '../context/WindowManagerContext';
import { useSettings } from '../context/SettingsContext';
import DateTime from './DateTime';

const Nav = ({ onToggleControlCenter, onToggleSpotlight }) => {
  const {
    getActiveApp,
    activeWindowId,
    closeWindow,
    closeAllWindows,
    recruiterMode,
    developerMode,
    openWindow,
    toggleMaximize,
    minimizeWindow
  } = useWindowManager();

  const {
    theme,
    updateSettings,
    soundEnabled,
    toggleSound,
    lockScreen,
    restartSystem
  } = useSettings();

  const [activeMenu, setActiveMenu] = useState(null);
  const navRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menuName) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleMenuAction = (action) => {
    setActiveMenu(null);
    action();
  };

  const activeApp = getActiveApp();

  return (
    <nav ref={navRef} className="os-menubar">
      {/* Left items */}
      <div className="menubar-left">
        {/* Apple Menu */}
        <div
          className={`menubar-item apple-logo ${activeMenu === 'apple' ? 'is-active' : ''}`}
          onClick={() => toggleDropdown('apple')}
        >
          <img src="/navbar-icons/apple.svg" alt="Apple" />

          {activeMenu === 'apple' && (
            <div className="menubar-dropdown">
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(() => openWindow('settings'))}
              >
                <span>About This Portfolio</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(() => openWindow('settings'))}
              >
                <span>System Settings...</span>
                <span className="dropdown-shortcut">⌘,</span>
              </div>
              <div className="dropdown-divider" />
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(recruiterMode)}
              >
                <span>Recruiter Mode ✨</span>
                <span className="dropdown-shortcut">⌘R</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(developerMode)}
              >
                <span>Developer Mode 💻</span>
                <span className="dropdown-shortcut">⌘D</span>
              </div>
              <div className="dropdown-divider" />
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(lockScreen)}
              >
                <span>Lock Screen</span>
                <span className="dropdown-shortcut">^⌘Q</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(restartSystem)}
              >
                <span>Restart Resume OS...</span>
              </div>
            </div>
          )}
        </div>

        {/* Active App Title */}
        <div
          className={`menubar-item app-name ${activeMenu === 'app' ? 'is-active' : ''}`}
          onClick={() => toggleDropdown('app')}
        >
          <span>{activeApp}</span>

          {activeMenu === 'app' && (
            <div className="menubar-dropdown">
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(() => openWindow('settings'))}
              >
                <span>Preferences...</span>
              </div>
              {activeWindowId && (
                <>
                  <div className="dropdown-divider" />
                  <div
                    className="dropdown-item"
                    onClick={() => handleMenuAction(() => minimizeWindow(activeWindowId))}
                  >
                    <span>Hide {activeApp}</span>
                    <span className="dropdown-shortcut">⌘H</span>
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleMenuAction(() => closeWindow(activeWindowId))}
                  >
                    <span>Quit {activeApp}</span>
                    <span className="dropdown-shortcut">⌘Q</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* File Menu */}
        <div
          className={`menubar-item hide-on-mobile ${activeMenu === 'file' ? 'is-active' : ''}`}
          onClick={() => toggleDropdown('file')}
        >
          <span>File</span>
          {activeMenu === 'file' && (
            <div className="menubar-dropdown">
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(() => openWindow('projects'))}
              >
                <span>Open Projects</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(() => openWindow('terminal'))}
              >
                <span>Open Terminal</span>
              </div>
              <div className="dropdown-divider" />
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(closeAllWindows)}
              >
                <span>Close All Windows</span>
                <span className="dropdown-shortcut">⌥⌘W</span>
              </div>
            </div>
          )}
        </div>

        {/* Window Menu */}
        <div
          className={`menubar-item hide-on-mobile ${activeMenu === 'window' ? 'is-active' : ''}`}
          onClick={() => toggleDropdown('window')}
        >
          <span>Window</span>
          {activeMenu === 'window' && (
            <div className="menubar-dropdown">
              <div
                className="dropdown-item"
                onClick={() =>
                  handleMenuAction(() => {
                    if (activeWindowId) minimizeWindow(activeWindowId);
                  })
                }
              >
                <span>Minimize</span>
                <span className="dropdown-shortcut">⌘M</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() =>
                  handleMenuAction(() => {
                    if (activeWindowId) toggleMaximize(activeWindowId);
                  })
                }
              >
                <span>Zoom</span>
              </div>
              <div className="dropdown-divider" />
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(recruiterMode)}
              >
                <span>Arrange for Recruiter</span>
              </div>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div
          className={`menubar-item hide-on-mobile ${activeMenu === 'help' ? 'is-active' : ''}`}
          onClick={() => toggleDropdown('help')}
        >
          <span>Help</span>
          {activeMenu === 'help' && (
            <div className="menubar-dropdown">
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(onToggleSpotlight)}
              >
                <span>Spotlight Search</span>
                <span className="dropdown-shortcut">⌘K</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => handleMenuAction(() => openWindow('notes'))}
              >
                <span>Portfolio Documentation</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right items */}
      <div className="menubar-right">
        {/* Recruiter Mode Pill */}
        <button
          type="button"
          className="recruiter-pill"
          onClick={recruiterMode}
          title="One-click Recruiter Mode (Opens Resume, Projects & Mail)"
        >
          <Sparkles />
          <span>Recruiter Mode</span>
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          className="status-icon-btn"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute UI Audio' : 'Unmute UI Audio'}
        >
          {soundEnabled ? <Volume2 /> : <VolumeX />}
        </button>

        {/* Spotlight Search Trigger */}
        <button
          type="button"
          className="status-icon-btn"
          onClick={onToggleSpotlight}
          title="Spotlight Search (Cmd+K)"
        >
          <Search />
        </button>

        {/* Control Center Toggle */}
        <button
          type="button"
          className="status-icon-btn"
          onClick={onToggleControlCenter}
          title="Control Center"
        >
          <Sliders />
        </button>

        {/* Live Date Time - Clicking opens Calendar app */}
        <div
          className="datetime-display"
          onClick={() => openWindow('calendar')}
          title="Open Calendar"
        >
          <DateTime />
        </div>
      </div>
    </nav>
  );
};

export default Nav;