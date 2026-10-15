import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const BootScreen = () => {
  const { completeBoot } = useSettings();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => completeBoot(), 200);
          return 100;
        }
        return prev + 6;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [completeBoot]);

  return (
    <div className="boot-screen">
      <div className="boot-logo">
        <img
          src="/navbar-icons/apple.svg"
          alt="Apple"
          style={{ filter: 'invert(1)' }}
        />
      </div>

      <div className="boot-progress-container">
        <div
          className="boot-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default BootScreen;
