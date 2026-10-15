import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  Bluetooth,
  Radio,
  Sun,
  Moon,
  Volume2,
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSettings } from '../../context/SettingsContext';

const ControlCenter = ({ isOpen, onClose }) => {
  const { recruiterMode } = useWindowManager();
  const { theme, updateSettings, soundEnabled, toggleSound } = useSettings();

  const [wifiActive, setWifiActive] = useState(true);
  const [bluetoothActive, setBluetoothActive] = useState(true);
  const [airdropActive, setAirdropActive] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(80);

  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={popoverRef} className="control-center-popover">
      {/* 2x2 Quick Modules */}
      <div className="control-modules-grid">
        {/* Wifi */}
        <div
          className={`control-tile ${wifiActive ? 'is-active' : ''}`}
          onClick={() => setWifiActive(!wifiActive)}
        >
          <div className="tile-icon">
            <Wifi />
          </div>
          <div className="tile-info">
            <span className="tile-label">Wi-Fi</span>
            <span className="tile-status">{wifiActive ? 'Home 5G' : 'Off'}</span>
          </div>
        </div>

        {/* Bluetooth */}
        <div
          className={`control-tile ${bluetoothActive ? 'is-active' : ''}`}
          onClick={() => setBluetoothActive(!bluetoothActive)}
        >
          <div className="tile-icon">
            <Bluetooth />
          </div>
          <div className="tile-info">
            <span className="tile-label">Bluetooth</span>
            <span className="tile-status">{bluetoothActive ? 'AirPods Pro' : 'Off'}</span>
          </div>
        </div>

        {/* AirDrop */}
        <div
          className={`control-tile ${airdropActive ? 'is-active' : ''}`}
          onClick={() => setAirdropActive(!airdropActive)}
        >
          <div className="tile-icon">
            <Radio />
          </div>
          <div className="tile-info">
            <span className="tile-label">AirDrop</span>
            <span className="tile-status">{airdropActive ? 'Contacts' : 'Off'}</span>
          </div>
        </div>

        {/* Theme Dark/Light Mode */}
        <div
          className="control-tile is-active"
          onClick={() => updateSettings('theme', theme === 'dark' ? 'light' : 'dark')}
        >
          <div className="tile-icon">
            {theme === 'dark' ? <Moon /> : <Sun />}
          </div>
          <div className="tile-info">
            <span className="tile-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            <span className="tile-status">Appearance</span>
          </div>
        </div>
      </div>

      {/* Recruiter Mode One-Click Card */}
      <div
        className="recruiter-mode-card"
        onClick={() => {
          onClose();
          recruiterMode();
        }}
      >
        <div className="card-left">
          <div className="sparkle-badge">
            <Sparkles size={16} />
          </div>
          <div className="text-wrap">
            <strong>Recruiter Mode ✨</strong>
            <small>Tile Resume, Projects & Mail</small>
          </div>
        </div>
        <button type="button" className="btn-open-recruiter">
          Launch
        </button>
      </div>

      {/* Display Brightness Slider */}
      <div className="control-slider-module">
        <div className="slider-label-row">
          <span>Display</span>
          <Sun />
        </div>
        <input
          type="range"
          min="40"
          max="100"
          value={brightness}
          onChange={(e) => {
            const val = e.target.value;
            setBrightness(val);
            document.documentElement.style.filter = `brightness(${val}%)`;
          }}
        />
      </div>

      {/* Sound Volume Slider */}
      <div className="control-slider-module">
        <div className="slider-label-row">
          <span>Sound</span>
          <Volume2 />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={soundEnabled ? volume : 0}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            if (!soundEnabled) toggleSound();
          }}
        />
      </div>
    </div>
  );
};

export default ControlCenter;
