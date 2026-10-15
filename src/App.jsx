import React, { useState } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import Nav from './components/Nav';
import Dock from './components/Dock';
import Widgets from './components/desktop/Widgets';
import ContextMenu from './components/desktop/ContextMenu';
import ControlCenter from './components/menubar/ControlCenter';
import Spotlight from './components/spotlight/Spotlight';
import LoadingScreen from './components/system/LoadingScreen';
import LockScreen from './components/system/LockScreen';

// Popovers, Overlays & Desktop Additions
import SnapPreview from './components/desktop/SnapPreview';
import MissionControl from './components/desktop/MissionControl';
import Cursor from './components/desktop/Cursor';

// Windows
import Github from './components/windows/Github';
import Note from './components/windows/Note';
import Resume from './components/windows/Resume';
import Cli from './components/windows/Cli';
import Calendar from './components/windows/Calendar';
import Mail from './components/windows/Mail';
import Spotify from './components/windows/Spotify';
import Settings from './components/windows/Settings';

const DesktopWorkspace = () => {
  const { hasBooted, isLocked, completeBoot } = useSettings();

  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });
  const [isEntering, setIsEntering] = useState(false);

  const handleLoadingComplete = () => {
    setIsEntering(true);
    completeBoot();
    setTimeout(() => setIsEntering(false), 800);
  };

  // Handle right-click on the desktop wallpaper
  const handleContextMenu = (e) => {
    // Only open if clicking on the workspace or background, not inside a window
    if (
      e.target.closest('.os-window') ||
      e.target.closest('.os-dock') ||
      e.target.closest('.os-menubar')
    ) {
      return;
    }
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // 1. Minimal Classic Loading Screen
  if (!hasBooted) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // 2. Lock Screen
  if (isLocked) {
    return <LockScreen />;
  }

  // 3. Desktop OS Experience
  return (
    <div
      className={`os-desktop ${isEntering ? 'loading-entering' : ''}`}
      onContextMenu={handleContextMenu}
    >
      {/* Top Menu Bar */}
      <Nav
        onToggleControlCenter={() => setIsControlCenterOpen((prev) => !prev)}
        onToggleSpotlight={() => setIsSpotlightOpen((prev) => !prev)}
      />

      {/* Main OS Workspace Area */}
      <div className="os-workspace">
        {/* Desktop Widgets */}
        <Widgets />

        {/* Managed Windows */}
        <Github />
        <Note />
        <Resume />
        <Cli />
        <Calendar />
        <Mail />
        <Spotify />
        <Settings />
      </div>

      {/* Bottom Dock */}
      <Dock />

      {/* Popovers, Menus, Modals */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
      />

      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
      />

      <Spotlight
        isOpen={isSpotlightOpen}
        onClose={(val) => setIsSpotlightOpen(typeof val === 'boolean' ? val : false)}
      />

      {/* Snap Preview Translucent Overlay */}
      <SnapPreview />

      {/* Mission Control Window Manager Overlay */}
      <MissionControl />

      {/* Interactive Mouse Follower */}
      <Cursor />
    </div>
  );
};

const App = () => {
  return (
    <SettingsProvider>
      <WindowManagerProvider>
        <DesktopWorkspace />
      </WindowManagerProvider>
    </SettingsProvider>
  );
};

export default App;
