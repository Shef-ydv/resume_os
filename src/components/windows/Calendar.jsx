import React, { useState } from 'react';
import MacWindow from './MacWindow';
import { PROFILE } from '../../data/profileData';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDateNum = today.getDate();

  // Create grid cells
  const cells = [];
  // Empty cells for preceding month
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ day: '', isCurrentMonth: false });
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isCurrentMonth && d === todayDateNum;
    cells.push({ day: d, isCurrentMonth: true, isToday });
  }

  return (
    <MacWindow windowId="calendar">
      <div className="calendar-window">
        {/* Calendar Sidebar */}
        <div className="calendar-sidebar">
          <div className="sidebar-section-title">Upcoming Schedule</div>

          <div className="events-list">
            {PROFILE.calendarEvents.map((evt, idx) => (
              <div key={idx} className="event-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={12} color="var(--accent)" />
                  <span className="event-title">{evt.title}</span>
                </div>
                <div className="event-date">
                  {evt.month} {evt.day} • {evt.date}
                </div>
                <div className="event-desc">{evt.desc}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 'auto',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(var(--accent-rgb), 0.1)',
              border: '1px solid var(--accent)',
              fontSize: '0.8125rem',
              lineHeight: '1.45'
            }}
          >
            <strong>Looking for full-time talent?</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              Shefali is available for interviews this week. Schedule a chat via Mail!
            </p>
          </div>
        </div>

        {/* Calendar Main Grid */}
        <div className="calendar-main">
          {/* Calendar Header Navigation */}
          <div className="calendar-header">
            <div className="month-title">
              {monthName} {year}
            </div>

            <div className="month-nav">
              <button type="button" onClick={prevMonth} title="Previous Month">
                <ChevronLeft size={14} />
              </button>
              <button type="button" onClick={goToToday}>
                Today
              </button>
              <button type="button" onClick={nextMonth} title="Next Month">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((dayName) => (
              <div key={dayName} className="calendar-day-name">
                {dayName}
              </div>
            ))}

            {cells.map((cell, idx) => (
              <div
                key={idx}
                className={`calendar-cell ${
                  !cell.isCurrentMonth ? 'other-month' : ''
                } ${cell.isToday ? 'is-today' : ''}`}
              >
                {cell.day && <div className="cell-number">{cell.day}</div>}
                {cell.isToday && <div className="cell-dot" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default Calendar;
