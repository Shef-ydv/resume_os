import React, { useState, useEffect, useRef } from 'react';
import MacWindow from './MacWindow';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSettings } from '../../context/SettingsContext';
import { PROFILE } from '../../data/profileData';
import { PROJECTS } from '../../data/projectsData';

const ASCII_LOGO = `
    ███████╗██╗  ██╗███████╗███████╗ █████╗ ██╗     ██╗
    ██╔════╝██║  ██║██╔════╝██╔════╝██╔══██╗██║     ██║
    ███████╗███████║█████╗  █████╗  ███████║██║     ██║
    ╚════██║██╔══██║██╔══╝  ██╔══╝  ██╔══██║██║     ██║
    ███████║██║  ██║███████╗██║     ██║  ██║███████╗██║
    ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝
`;

const COMMANDS_LIST = [
  'help',
  'whoami',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'contact',
  'resume',
  'github',
  'linkedin',
  'theme',
  'neofetch',
  'date',
  'ls',
  'cat',
  'sudo',
  'matrix',
  'clear'
];

const Cli = () => {
  const { openWindow } = useWindowManager();
  const { theme, wallpaper, accent, updateSettings } = useSettings();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    {
      type: 'output',
      content: `Welcome to Shefali Yadav's Portfolio Terminal (zsh)\nType 'help' to view available commands or 'neofetch' for system info.`
    }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);
  const matrixCanvasRef = useRef(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on click anywhere in terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Matrix Rain Animation
  useEffect(() => {
    if (!isMatrixActive) return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const chars = '0123456789ABCDEF@#$%&*+=-~SHEFALI';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);

    const handleExitMatrix = (e) => {
      if (e.key === 'Escape' || e.key === 'c' && e.ctrlKey) {
        setIsMatrixActive(false);
      }
    };
    window.addEventListener('keydown', handleExitMatrix);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleExitMatrix);
    };
  }, [isMatrixActive]);

  const executeCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newEntries = [{ type: 'input', content: trimmed }];

    switch (command) {
      case 'help':
        newEntries.push({
          type: 'output',
          content: `Available Commands:
  • whoami          Display current developer profile
  • about           Learn about Shefali Yadav
  • skills          List technical frontend & backend skills
  • projects        List featured development projects
  • experience      Professional work & internship history
  • education       University degree & certifications
  • contact         Get contact channels & social links
  • resume          View / download official PDF resume
  • github          Open official GitHub profile
  • linkedin        Open official LinkedIn profile
  • theme <name>    Switch theme (dark, light, aurora, sunset, cyberpunk)
  • neofetch        Render system specs & ASCII banner
  • date            Print current system timestamp
  • ls              List workspace files
  • cat <file>      Read file content (e.g. cat resume.pdf)
  • sudo <cmd>      Execute administrative command
  • matrix          Run digital rain screensaver (ESC to exit)
  • clear           Clear the terminal console`
        });
        break;

      case 'whoami':
        newEntries.push({
          type: 'output',
          content: `${PROFILE.name} — ${PROFILE.title}\n${PROFILE.location} • ${PROFILE.status}`
        });
        break;

      case 'about':
        newEntries.push({
          type: 'output',
          content: `${PROFILE.name}\n${PROFILE.bio}`
        });
        break;

      case 'skills':
        const fe = PROFILE.skills.frontend.map((s) => s.name).join(', ');
        const be = PROFILE.skills.backend.map((s) => s.name).join(', ');
        const tools = PROFILE.skills.tools.join(', ');
        newEntries.push({
          type: 'output',
          content: `Frontend: ${fe}\nBackend:  ${be}\nTools:    ${tools}`
        });
        break;

      case 'projects':
        const projList = PROJECTS.map(
          (p) => `• ${p.title} [${p.tags.slice(0, 3).join(', ')}] -> ${p.demoLink}`
        ).join('\n');
        newEntries.push({
          type: 'output',
          content: `Recent Projects:\n${projList}\n\nTip: You can also explore them in the Finder app.`
        });
        break;

      case 'experience':
        const expList = PROFILE.experience
          .map(
            (e) =>
              `• ${e.role} @ ${e.company} (${e.duration})\n  - ${e.responsibilities[0]}`
          )
          .join('\n\n');
        newEntries.push({
          type: 'output',
          content: expList
        });
        break;

      case 'education':
        const edu = PROFILE.education[0];
        newEntries.push({
          type: 'output',
          content: `• ${edu.degree} in ${edu.field}\n  ${edu.institution} (${edu.period})\n  ${edu.grade}`
        });
        break;

      case 'contact':
        newEntries.push({
          type: 'output',
          content: `Email:    ${PROFILE.email}\nGitHub:   ${PROFILE.github}\nLinkedIn: ${PROFILE.linkedin}\nLocation: ${PROFILE.location}`
        });
        break;

      case 'resume':
        openWindow('resume');
        newEntries.push({
          type: 'success',
          content: `Opening Resume PDF in Preview window...`
        });
        break;

      case 'github':
        window.open(PROFILE.github, '_blank', 'noopener,noreferrer');
        newEntries.push({
          type: 'success',
          content: `Opening ${PROFILE.github} in browser...`
        });
        break;

      case 'linkedin':
        window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer');
        newEntries.push({
          type: 'success',
          content: `Opening ${PROFILE.linkedin} in browser...`
        });
        break;

      case 'theme':
        if (!args[0]) {
          newEntries.push({
            type: 'output',
            content: `Usage: theme <name>\nOptions: dark, light, aurora, sunset, cyberpunk, forest, ocean, animated-gradient`
          });
        } else {
          const themeName = args[0].toLowerCase();
          if (['dark', 'light'].includes(themeName)) {
            updateSettings('theme', themeName);
            newEntries.push({ type: 'success', content: `Theme mode set to ${themeName}` });
          } else if (
            ['dark-bokeh', 'aurora', 'sunset', 'cyberpunk', 'forest', 'ocean', 'animated-gradient', 'minimal-light'].includes(
              themeName
            )
          ) {
            updateSettings('wallpaper', themeName);
            newEntries.push({ type: 'success', content: `Wallpaper preset set to ${themeName}` });
          } else {
            newEntries.push({
              type: 'error',
              content: `Unknown theme: '${themeName}'. Available: dark, light, aurora, sunset, cyberpunk, forest, ocean`
            });
          }
        }
        break;

      case 'neofetch':
        newEntries.push({
          type: 'neofetch',
          content: {
            user: 'shefali@portfolio-macbook',
            os: 'Resume OS 2.4 Sequoia x86_64',
            host: 'MacBookPro18,1 (Apple M1 Pro)',
            kernel: 'Darwin 24.0.0',
            uptime: '4 hours, 20 mins',
            packages: '8 (React 19, SCSS, Vite, Lucide)',
            shell: 'zsh 5.9',
            wm: 'ResumeWindowManager (Quartz)',
            terminal: 'zsh-cli-emulator',
            cpu: 'Apple M1 Pro (10-Core)',
            memory: '4096MiB / 16384MiB'
          }
        });
        break;

      case 'date':
        newEntries.push({
          type: 'output',
          content: new Date().toString()
        });
        break;

      case 'ls':
        newEntries.push({
          type: 'output',
          content: `drwxr-xr-x  projects/
drwxr-xr-x  skills/
-rw-r--r--  resume.pdf
-rw-r--r--  bio.txt
-rw-r--r--  contact.vcf`
        });
        break;

      case 'cat':
        if (!args[0]) {
          newEntries.push({ type: 'error', content: `Usage: cat <filename>` });
        } else if (args[0] === 'bio.txt') {
          newEntries.push({ type: 'output', content: PROFILE.bio });
        } else if (args[0] === 'resume.pdf') {
          openWindow('resume');
          newEntries.push({ type: 'success', content: `Opened resume.pdf in Preview.` });
        } else {
          newEntries.push({ type: 'error', content: `cat: ${args[0]}: No such file or directory` });
        }
        break;

      case 'sudo':
        newEntries.push({
          type: 'error',
          content: `Nice try! shefali is not in the sudoers file. This incident will be reported to Santa.`
        });
        break;

      case 'matrix':
        setIsMatrixActive(true);
        newEntries.push({
          type: 'success',
          content: `Matrix rain started. Press ESC to return.`
        });
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        newEntries.push({
          type: 'error',
          content: `zsh: command not found: ${command}. Type 'help' to see available commands.`
        });
    }

    setHistory((prev) => [...prev, ...newEntries]);
  };

  const handleKeyDown = (e) => {
    // History Navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim();
      if (current) {
        const match = COMMANDS_LIST.find((c) => c.startsWith(current.toLowerCase()));
        if (match) {
          setInputVal(match);
        }
      }
    } else if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    }
  };

  return (
    <MacWindow windowId="terminal">
      <div className="terminal-container" onClick={handleTerminalClick}>
        {isMatrixActive && <canvas ref={matrixCanvasRef} className="matrix-canvas" />}

        <div className="terminal-body">
          {history.map((entry, idx) => {
            if (entry.type === 'input') {
              return (
                <div key={idx} className="terminal-line is-input">
                  <div className="terminal-prompt">
                    <span className="prompt-user">shefaliyadav</span>
                    <span className="prompt-symbol">@</span>
                    <span className="prompt-path">~ %</span>
                  </div>
                  <span>{entry.content}</span>
                </div>
              );
            }

            if (entry.type === 'neofetch') {
              const info = entry.content;
              return (
                <div key={idx} className="neofetch-output">
                  <div className="ascii-art">{ASCII_LOGO}</div>
                  <div className="neofetch-info">
                    <div style={{ fontWeight: '700', marginBottom: '4px', color: 'var(--accent)' }}>
                      {info.user}
                    </div>
                    <div className="info-row"><span className="info-key">OS:</span><span className="info-val">{info.os}</span></div>
                    <div className="info-row"><span className="info-key">Host:</span><span className="info-val">{info.host}</span></div>
                    <div className="info-row"><span className="info-key">Kernel:</span><span className="info-val">{info.kernel}</span></div>
                    <div className="info-row"><span className="info-key">Uptime:</span><span className="info-val">{info.uptime}</span></div>
                    <div className="info-row"><span className="info-key">Packages:</span><span className="info-val">{info.packages}</span></div>
                    <div className="info-row"><span className="info-key">Shell:</span><span className="info-val">{info.shell}</span></div>
                    <div className="info-row"><span className="info-key">Memory:</span><span className="info-val">{info.memory}</span></div>
                    <div className="color-blocks">
                      <span style={{ background: '#ff5f56' }} />
                      <span style={{ background: '#ffbd2e' }} />
                      <span style={{ background: '#27c93f' }} />
                      <span style={{ background: '#007aff' }} />
                      <span style={{ background: '#af52de' }} />
                      <span style={{ background: '#34c759' }} />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`terminal-line ${
                  entry.type === 'error'
                    ? 'is-error'
                    : entry.type === 'success'
                    ? 'is-success'
                    : 'is-output'
                }`}
              >
                {entry.content}
              </div>
            );
          })}

          {/* Current Active Input Prompt */}
          <div className="terminal-line is-input">
            <div className="terminal-prompt">
              <span className="prompt-user">shefaliyadav</span>
              <span className="prompt-symbol">@</span>
              <span className="prompt-path">~ %</span>
            </div>
            <div className="terminal-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </MacWindow>
  );
};

export default Cli;