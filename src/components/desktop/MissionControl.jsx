import React from 'react';
import { useWindowManager, WINDOW_CONFIGS } from '../../context/WindowManagerContext';
import { LayoutGrid, X } from 'lucide-react';

const MissionControl = () => {
  const {
    windows,
    isMissionControlOpen,
    toggleMissionControl,
    bringToFront
  } = useWindowManager();

  if (!isMissionControlOpen) return null;

  const openWindows = Object.keys(windows).filter(
    (k) => windows[k].isOpen && !windows[k].isMinimized
  );

  const handleSelectWindow = (id) => {
    toggleMissionControl();
    bringToFront(id);
  };

  return (
    <div className="mission-control-overlay" onClick={toggleMissionControl}>
      <div className="mission-control-header" onClick={(e) => e.stopPropagation()}>
        <div className="mc-title">
          <LayoutGrid size={22} />
          <span>Mission Control — Active Windows</span>
        </div>
        <div className="mc-hint">
          Click any window to focus • Press ESC or F3 to exit
        </div>
      </div>

      <div className="mission-control-grid" onClick={(e) => e.stopPropagation()}>
        {openWindows.length === 0 ? (
          <div className="mc-empty">No active windows open on this desktop.</div>
        ) : (
          openWindows.map((id) => {
            const config = WINDOW_CONFIGS[id] || {};
            const win = windows[id];

            return (
              <div
                key={id}
                className="mc-window-card"
                onClick={() => handleSelectWindow(id)}
                data-cursor="pointer"
                data-cursor-text="Focus"
              >
                <div className="mc-card-header">
                  <div className="mc-app-icon">
                    <img src={config.iconPath} alt={config.appName} />
                  </div>
                  <span className="mc-window-title">{config.title}</span>
                </div>

                <div className="mc-card-body">
                  <div style={{ opacity: 0.85, fontWeight: 500 }}>
                    {config.appName}
                  </div>
                  <span className="mc-badge">
                    {win.isMaximized ? 'Maximized' : `${win.width} × ${win.height}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MissionControl;
