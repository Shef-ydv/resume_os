import React, { useState, useRef } from 'react';
import { useWindowManager } from '../context/WindowManagerContext';
import { useSettings } from '../context/SettingsContext';
import { Settings as SettingsIcon, Terminal as TerminalIcon, FileText, Music, Mail, ExternalLink } from 'lucide-react';

const DOCK_APPS = [
  {
    id: 'projects',
    title: 'Finder (Projects)',
    type: 'app',
    iconClass: 'icon-finder',
    svgPath: '/icons/github.svg',
    useCustomSvg: false
  },
  {
    id: 'notes',
    title: 'Notes (Bio & Skills)',
    type: 'app',
    iconClass: 'icon-notes',
    svgPath: '/icons/sticky-note.svg',
    useCustomSvg: true
  },
  {
    id: 'resume',
    title: 'Resume PDF',
    type: 'app',
    iconClass: 'icon-resume',
    svgPath: '/icons/file-text.svg',
    useCustomSvg: true
  },
  {
    id: 'calendar',
    title: 'Calendar',
    type: 'app',
    iconClass: 'icon-calendar',
    isCalendar: true
  },
  {
    id: 'mail',
    title: 'Mail',
    type: 'app',
    iconClass: 'icon-mail',
    svgPath: '/icons/mail.svg',
    useCustomSvg: true
  },
  {
    id: 'terminal',
    title: 'Terminal (zsh)',
    type: 'app',
    iconClass: 'icon-terminal',
    svgPath: '/icons/terminal.svg',
    useCustomSvg: true
  },
  {
    id: 'music',
    title: 'Music Player',
    type: 'app',
    iconClass: 'icon-music',
    svgPath: '/icons/spotify.svg',
    useCustomSvg: true
  },
  {
    id: 'settings',
    title: 'System Settings',
    type: 'app',
    iconClass: 'icon-settings',
    isSettings: true
  },
  {
    id: 'divider',
    type: 'divider'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile',
    type: 'link',
    iconClass: 'icon-linkedin',
    svgPath: '/icons/link.svg',
    url: 'https://www.linkedin.com/in/shefali-yadav-0806b0328'
  },
  {
    id: 'github_profile',
    title: 'GitHub Profile',
    type: 'link',
    iconClass: 'icon-github',
    svgPath: '/icons/github.svg',
    url: 'https://github.com/shefaliyadav1709'
  }
];

const Dock = () => {
  const { windows, openWindow, bringToFront } = useWindowManager();
  const { dockSize, dockMagnification, dockPosition } = useSettings();
  const [bouncingApp, setBouncingApp] = useState(null);
  const [hoveredAppIndex, setHoveredAppIndex] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const dockRef = useRef(null);

  const today = new Date();
  const currentMonthShort = today.toLocaleString('default', { month: 'short' }).toUpperCase();
  const currentDate = today.getDate();

  const handleAppClick = (app) => {
    if (app.type === 'link') {
      window.open(app.url, '_blank', 'noopener,noreferrer');
      return;
    }

    setBouncingApp(app.id);
    setTimeout(() => setBouncingApp(null), 900);

    const win = windows[app.id];
    if (win && win.isOpen && !win.isMinimized) {
      bringToFront(app.id);
    } else {
      openWindow(app.id);
    }
  };

  const handleMouseMove = (e) => {
    if (!dockMagnification || !dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    if (dockPosition === 'left') {
      setMousePos(e.clientY - rect.top);
    } else {
      setMousePos(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    setHoveredAppIndex(null);
    setMousePos(null);
  };

  // Calculate magnification scale for an item
  const getItemScale = (index) => {
    if (!dockMagnification || hoveredAppIndex === null) return 1;
    const distance = Math.abs(index - hoveredAppIndex);
    if (distance === 0) return 1.34;
    if (distance === 1) return 1.18;
    if (distance === 2) return 1.07;
    return 1;
  };

  return (
    <div className={`os-dock-container ${dockPosition === 'left' ? 'is-left' : ''}`}>
      <footer
        ref={dockRef}
        className="os-dock"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ '--dock-item-size': `${dockSize}px` }}
      >
        {DOCK_APPS.map((item, idx) => {
          if (item.type === 'divider') {
            return <div key="dock-divider" className="dock-divider" />;
          }

          const isOpen = windows[item.id]?.isOpen;
          const isBouncing = bouncingApp === item.id;
          const scale = getItemScale(idx);

          return (
            <div
              key={item.id}
              className="dock-item-wrapper"
              onMouseEnter={() => setHoveredAppIndex(idx)}
            >
              {hoveredAppIndex === idx && (
                <div className="dock-tooltip">{item.title}</div>
              )}

              <div
                className={`dock-item ${item.iconClass} ${
                  isBouncing ? 'is-bouncing' : ''
                }`}
                style={{
                  transform: `scale(${scale}) translateY(${scale > 1 ? `-${(scale - 1) * 35}px` : '0px'})`
                }}
                onClick={() => handleAppClick(item)}
              >
                {item.isCalendar ? (
                  <>
                    <div className="calendar-top">{currentMonthShort}</div>
                    <div className="calendar-date">{currentDate}</div>
                  </>
                ) : item.isSettings ? (
                  <SettingsIcon color="#ffffff" />
                ) : (
                  <img src={item.svgPath} alt={item.title} />
                )}
              </div>

              {isOpen && <div className="dock-indicator" />}
            </div>
          );
        })}
      </footer>
    </div>
  );
};

export default Dock;