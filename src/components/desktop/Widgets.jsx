import React, { useState, useEffect } from 'react';
import { Clock, CloudSun, Hammer, MapPin } from 'lucide-react';

const Widgets = () => {
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      setTime(`${hours}:${minutes} ${ampm}`);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setDateStr(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="desktop-widgets-column">
      {/* 1. Clock Widget */}
      <div className="os-widget widget-clock">
        <div className="widget-header">
          <span className="widget-tag">World Clock</span>
          <Clock />
        </div>
        <div className="clock-time">{time}</div>
        <div className="clock-date">{dateStr}</div>
      </div>

      {/* 2. Weather Widget */}
      <div className="os-widget widget-weather">
        <div className="widget-header">
          <span className="widget-tag">Weather</span>
          <CloudSun />
        </div>
        <div className="weather-temp-row">
          <span className="temp">26°</span>
          <span className="condition">Mostly Sunny</span>
        </div>
        <div className="weather-location">
          <MapPin size={10} style={{ display: 'inline', marginRight: '3px' }} />
          Ghaziabad / Delhi NCR
        </div>
      </div>

      {/* 3. Now Building Widget */}
      <div className="os-widget widget-building">
        <div className="widget-header">
          <span className="widget-tag">Now Building</span>
          <Hammer />
        </div>
        <div className="building-title">Real-Time Web Apps</div>
        <div className="building-desc">
          Building high-performance React + Node microservices & UI architectures.
        </div>
        <div>
          <span className="status-pill">
            <span className="pulse-dot" /> Open to Roles
          </span>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
