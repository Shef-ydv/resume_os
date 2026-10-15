import React, { useEffect, useRef } from 'react';
import { Image, Terminal, Settings, Sparkles, Download, Lock, RefreshCw } from 'lucide-react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSettings } from '../../context/SettingsContext';

const ContextMenu = ({ x, y, isOpen, onClose }) => {
  const { openWindow, recruiterMode, tileWindows, cascadeWindows, toggleMissionControl } = useWindowManager();
  const { lockScreen } = useSettings();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClick);
    }
    return () => window.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Keep menu within screen viewport
  const adjustedX = Math.min(x, window.innerWidth - 230);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  const handleAction = (cb) => {
    onClose();
    cb();
  };

  return (
    <div
      ref={menuRef}
      className="desktop-context-menu"
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
    >
      <div
        className="context-item"
        onClick={() => handleAction(() => openWindow('settings'))}
      >
        <Image />
        <span>Change Wallpaper...</span>
      </div>

      <div
        className="context-item"
        onClick={() => handleAction(() => openWindow('terminal'))}
      >
        <Terminal />
        <span>Open Terminal</span>
      </div>

      <div
        className="context-item"
        onClick={() => handleAction(() => openWindow('settings'))}
      >
        <Settings />
        <span>System Settings</span>
      </div>

      <div className="context-divider" />

      {/* Arrange Windows */}
      <div
        className="context-item"
        onClick={() => handleAction(tileWindows)}
      >
        <span>Tile Windows Side by Side</span>
      </div>

      <div
        className="context-item"
        onClick={() => handleAction(cascadeWindows)}
      >
        <span>Cascade Windows</span>
      </div>

      <div
        className="context-item"
        onClick={() => handleAction(toggleMissionControl)}
      >
        <span>Mission Control (F3)</span>
      </div>

      <div className="context-divider" />

      <div
        className="context-item"
        onClick={() => handleAction(recruiterMode)}
      >
        <Sparkles style={{ color: 'var(--accent)' }} />
        <span>Recruiter Mode ✨</span>
      </div>

      <div
        className="context-item"
        onClick={() =>
          handleAction(() => {
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Shefali_Yadav_Resume.pdf';
            link.click();
          })
        }
      >
        <Download />
        <span>Download Resume PDF</span>
      </div>

      <div className="context-divider" />

      <div
        className="context-item"
        onClick={() => handleAction(lockScreen)}
      >
        <Lock />
        <span>Lock Screen</span>
      </div>
    </div>
  );
};

export default ContextMenu;
