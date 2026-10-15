import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { PROFILE } from '../../data/profileData';
import { ArrowRight, User } from 'lucide-react';

const LockScreen = () => {
  const { unlockScreen } = useSettings();
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes}`);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      setDateStr(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Unlock on Enter key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        unlockScreen();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [unlockScreen]);

  return (
    <div className="lock-screen" onClick={unlockScreen}>
      {/* Top Clock */}
      <div className="lock-time-wrap">
        <div className="lock-time">{time}</div>
        <div className="lock-date">{dateStr}</div>
      </div>

      {/* User Login Card */}
      <div className="lock-user-card" onClick={(e) => e.stopPropagation()}>
        <div className="user-avatar">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
            alt={PROFILE.name}
          />
        </div>

        <div className="user-name">{PROFILE.name}</div>

        <button
          type="button"
          className="btn-enter-os"
          onClick={unlockScreen}
        >
          <span>Click to Enter</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Footer */}
      <div className="lock-footer">
        Press Return or Click anywhere to unlock • Resume OS Sonoma
      </div>
    </div>
  );
};

export default LockScreen;
