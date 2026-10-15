import React, { useState } from 'react';
import MacWindow from './MacWindow';
import { useSettings } from '../../context/SettingsContext';
import { WALLPAPERS, ACCENT_COLORS } from '../../data/wallpapersData';
import { PROFILE } from '../../data/profileData';
import {
  Palette,
  Image as ImageIcon,
  Sliders,
  Info,
  Check,
  Volume2,
  ExternalLink,
  Download
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const {
    theme,
    wallpaper,
    accent,
    dockSize,
    dockMagnification,
    dockPosition,
    soundEnabled,
    updateSettings
  } = useSettings();

  return (
    <MacWindow windowId="settings">
      <div className="settings-window">
        {/* Left Sidebar */}
        <div className="settings-sidebar">
          <div className="sidebar-category-header">System</div>

          <div
            className={`sidebar-item ${activeTab === 'appearance' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette />
            <span>Appearance</span>
          </div>

          <div
            className={`sidebar-item ${activeTab === 'wallpaper' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('wallpaper')}
          >
            <ImageIcon />
            <span>Wallpaper</span>
          </div>

          <div
            className={`sidebar-item ${activeTab === 'dock' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('dock')}
          >
            <Sliders />
            <span>Desktop & Dock</span>
          </div>

          <div className="sidebar-category-header" style={{ marginTop: '12px' }}>
            System Info
          </div>

          <div
            className={`sidebar-item ${activeTab === 'about' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Info />
            <span>About This OS</span>
          </div>
        </div>

        {/* Right Content */}
        <div className="settings-content">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div>
              <div className="settings-section-title">Appearance</div>
              <div className="settings-section-subtitle">
                Customize window chrome, color scheme, and system accent colors.
              </div>

              {/* Light / Dark / Auto Cards */}
              <div className="theme-mode-grid">
                <div
                  className={`theme-mode-card ${theme === 'dark' ? 'is-active' : ''}`}
                  onClick={() => updateSettings('theme', 'dark')}
                >
                  <div className="theme-preview preview-dark">
                    <div className="preview-bar" />
                  </div>
                  <span>Dark</span>
                </div>

                <div
                  className={`theme-mode-card ${theme === 'light' ? 'is-active' : ''}`}
                  onClick={() => updateSettings('theme', 'light')}
                >
                  <div className="theme-preview preview-light">
                    <div className="preview-bar" />
                  </div>
                  <span>Light</span>
                </div>

                <div
                  className={`theme-mode-card ${theme === 'auto' ? 'is-active' : ''}`}
                  onClick={() => updateSettings('theme', 'auto')}
                >
                  <div className="theme-preview preview-auto">
                    <div className="preview-bar" />
                  </div>
                  <span>Auto</span>
                </div>
              </div>

              {/* Accent Color Section */}
              <div className="settings-card">
                <div className="card-row">
                  <div className="row-label">
                    <span>Accent Color</span>
                    <small>Buttons, highlights, and CLI prompt colors</small>
                  </div>
                  <div className="accent-swatches">
                    {ACCENT_COLORS.map((col) => (
                      <div
                        key={col.id}
                        className={`accent-swatch ${accent === col.id ? 'is-active' : ''}`}
                        style={{ backgroundColor: col.hex }}
                        onClick={() => updateSettings('accent', col.id)}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="card-row">
                  <div className="row-label">
                    <span>Play UI Sound Effects</span>
                    <small>Subtle clicks, pops, and startup chimes via Web Audio</small>
                  </div>
                  <div
                    className={`ios-toggle ${soundEnabled ? 'is-on' : ''}`}
                    onClick={() => updateSettings('soundEnabled', !soundEnabled)}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WALLPAPER */}
          {activeTab === 'wallpaper' && (
            <div>
              <div className="settings-section-title">Wallpapers</div>
              <div className="settings-section-subtitle">
                Choose from 8 curated dynamic themes, including CSS aurora and fluid mesh animations.
              </div>

              <div className="wallpaper-grid">
                {WALLPAPERS.map((wp) => {
                  const isActive = wallpaper === wp.id;
                  return (
                    <div
                      key={wp.id}
                      className={`wallpaper-thumb-card ${isActive ? 'is-active' : ''}`}
                      onClick={() => updateSettings('wallpaper', wp.id)}
                    >
                      <div
                        className="wallpaper-thumb-preview"
                        style={{ background: wp.previewGradient }}
                      />
                      <div className="wallpaper-title">{wp.name}</div>
                      {isActive && (
                        <div className="active-badge">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DOCK */}
          {activeTab === 'dock' && (
            <div>
              <div className="settings-section-title">Desktop & Dock</div>
              <div className="settings-section-subtitle">
                Adjust dock scaling, parabolic hover magnification, and orientation.
              </div>

              <div className="settings-card">
                <div className="card-row">
                  <div className="row-label">
                    <span>Size</span>
                    <small>Dock icon dimensions ({dockSize}px)</small>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="68"
                    value={dockSize}
                    onChange={(e) => updateSettings('dockSize', Number(e.target.value))}
                    style={{ width: '160px', accentColor: 'var(--accent)' }}
                  />
                </div>

                <div className="card-row">
                  <div className="row-label">
                    <span>Magnification</span>
                    <small>Enlarge dock icons on mouse hover</small>
                  </div>
                  <div
                    className={`ios-toggle ${dockMagnification ? 'is-on' : ''}`}
                    onClick={() => updateSettings('dockMagnification', !dockMagnification)}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>

                <div className="card-row">
                  <div className="row-label">
                    <span>Position on Screen</span>
                    <small>Pin dock to bottom or left edge</small>
                  </div>
                  <div className="segmented-control">
                    <button
                      type="button"
                      className={`segment-btn ${dockPosition === 'bottom' ? 'is-selected' : ''}`}
                      onClick={() => updateSettings('dockPosition', 'bottom')}
                    >
                      Bottom
                    </button>
                    <button
                      type="button"
                      className={`segment-btn ${dockPosition === 'left' ? 'is-selected' : ''}`}
                      onClick={() => updateSettings('dockPosition', 'left')}
                    >
                      Left
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT THIS OS */}
          {activeTab === 'about' && (
            <div>
              <div className="settings-section-title">About This Portfolio</div>
              <div className="settings-section-subtitle">
                Resume OS Sequoia Edition • Engineered by {PROFILE.name}
              </div>

              <div className="settings-card" style={{ textAlign: 'center', padding: '24px' }}>
                <img
                  src="/navbar-icons/apple.svg"
                  alt="Apple"
                  style={{
                    width: '54px',
                    height: '54px',
                    margin: '0 auto 16px',
                    filter: 'invert(1)'
                  }}
                />
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                  Resume OS 2.4 (Sequoia)
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '18px' }}>
                  Interactive Web Desktop Experience
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    textAlign: 'left',
                    background: 'var(--glass-subtle)',
                    padding: '14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    marginBottom: '20px'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Architect:</span>{' '}
                    <strong>{PROFILE.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Role:</span>{' '}
                    <strong>{PROFILE.title}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Framework:</span>{' '}
                    <strong>React 19 + SCSS</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Engine:</span>{' '}
                    <strong>Vite 7 (Dart Sass)</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <a
                    href="/resume.pdf"
                    download="Shefali_Yadav_Resume.pdf"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'var(--accent)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    <Download size={14} /> Download Resume
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'var(--control-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    <ExternalLink size={14} /> GitHub Profile
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MacWindow>
  );
};

export default Settings;
