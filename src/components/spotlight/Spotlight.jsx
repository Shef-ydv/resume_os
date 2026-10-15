import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Folder, Terminal, FileText, Calendar, Mail, Music, Settings, Sparkles, Download, Moon, Sun, ArrowRight } from 'lucide-react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSettings } from '../../context/SettingsContext';
import { PROJECTS } from '../../data/projectsData';
import { PROFILE } from '../../data/profileData';

const Spotlight = ({ isOpen, onClose }) => {
  const { openWindow, recruiterMode } = useWindowManager();
  const { theme, updateSettings, lockScreen } = useSettings();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // Toggle open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchItems = useMemo(() => {
    const list = [
      // Quick Actions
      { id: 'recruiter', title: 'Recruiter Mode ✨', category: 'Actions', icon: Sparkles, action: () => recruiterMode() },
      { id: 'download_resume', title: 'Download Resume PDF', category: 'Actions', icon: Download, action: () => {
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Shefali_Yadav_Resume.pdf';
        link.click();
      }},
      { id: 'toggle_theme', title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, category: 'Actions', icon: theme === 'dark' ? Sun : Moon, action: () => updateSettings('theme', theme === 'dark' ? 'light' : 'dark') },
      { id: 'lock', title: 'Lock Screen', category: 'Actions', icon: ArrowRight, action: () => lockScreen() },

      // Apps
      { id: 'app_projects', title: 'Finder (Projects)', category: 'Applications', icon: Folder, action: () => openWindow('projects') },
      { id: 'app_notes', title: 'Notes (Profile & Skills)', category: 'Applications', icon: FileText, action: () => openWindow('notes') },
      { id: 'app_resume', title: 'Preview (Resume)', category: 'Applications', icon: FileText, action: () => openWindow('resume') },
      { id: 'app_terminal', title: 'Terminal (zsh)', category: 'Applications', icon: Terminal, action: () => openWindow('terminal') },
      { id: 'app_calendar', title: 'Calendar', category: 'Applications', icon: Calendar, action: () => openWindow('calendar') },
      { id: 'app_mail', title: 'Mail Composer', category: 'Applications', icon: Mail, action: () => openWindow('mail') },
      { id: 'app_music', title: 'Music Player', category: 'Applications', icon: Music, action: () => openWindow('music') },
      { id: 'app_settings', title: 'System Settings', category: 'Applications', icon: Settings, action: () => openWindow('settings') }
    ];

    // Add Projects
    PROJECTS.forEach((proj) => {
      list.push({
        id: `proj_${proj.id}`,
        title: proj.title,
        subtitle: proj.tags.join(', '),
        category: 'Projects',
        icon: Folder,
        action: () => {
          openWindow('projects');
        }
      });
    });

    // Add Key Skills
    [...PROFILE.skills.frontend, ...PROFILE.skills.backend].forEach((skill) => {
      list.push({
        id: `skill_${skill.name}`,
        title: `${skill.name} (${skill.level})`,
        subtitle: `Proficiency: ${skill.proficiency}%`,
        category: 'Skills',
        icon: FileText,
        action: () => openWindow('notes')
      });
    });

    return list;
  }, [theme, updateSettings, lockScreen, openWindow, recruiterMode]);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return searchItems.slice(0, 8);
    return searchItems
      .filter((item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [query, searchItems]);

  const handleSelect = (item) => {
    onClose();
    item.action();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="spotlight-backdrop" onClick={onClose}>
      <div className="spotlight-modal" onClick={(e) => e.stopPropagation()}>
        <div className="spotlight-search-header">
          <Search />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search (apps, projects, skills, commands)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="spotlight-esc-badge">ESC</span>
        </div>

        <div className="spotlight-results">
          {filteredItems.length === 0 ? (
            <div className="spotlight-empty">No results found for "{query}"</div>
          ) : (
            filteredItems.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  className={`spotlight-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="item-left">
                    <div className="item-icon">
                      <IconComp size={16} />
                    </div>
                    <div className="item-text">
                      <div className="item-title">{item.title}</div>
                      {item.subtitle && (
                        <div className="item-subtitle">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <span className="item-action-tag">{item.category}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Spotlight;
