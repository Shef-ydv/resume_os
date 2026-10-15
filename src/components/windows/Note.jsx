import React, { useState, useEffect } from 'react';
import MacWindow from './MacWindow';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierDuneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { PROFILE } from '../../data/profileData';
import { Code, BookOpen, User, Briefcase, GraduationCap, Award } from 'lucide-react';

const NOTE_DOCS = [
  {
    id: 'about',
    title: 'About Shefali Yadav',
    icon: User,
    date: 'Oct 15, 2026',
    preview: 'Full Stack Developer crafting delightful web experiences...'
  },
  {
    id: 'skills',
    title: 'Skills & Tech Stack',
    icon: Code,
    date: 'Oct 14, 2026',
    preview: 'React 19, TypeScript, Node.js, Express, MongoDB, AWS...'
  },
  {
    id: 'experience',
    title: 'Work Experience',
    icon: Briefcase,
    date: 'Oct 12, 2026',
    preview: 'TechFlow Systems & CodeWave Solutions milestones...'
  },
  {
    id: 'education',
    title: 'Education & Qualifications',
    icon: GraduationCap,
    date: 'Oct 10, 2026',
    preview: 'B.Tech in Computer Science at KIET Group of Institutions...'
  },
  {
    id: 'code_view',
    title: 'Resume.ts (Code Interface)',
    icon: Award,
    date: 'Live Source',
    preview: 'Full TypeScript OOP architecture of profile...'
  }
];

const Note = () => {
  const [selectedNoteId, setSelectedNoteId] = useState('about');
  const [markdown, setMarkdown] = useState(null);
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' | 'code'

  useEffect(() => {
    fetch('/note.txt')
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch(() => setMarkdown('// Error loading note.txt'));
  }, []);

  return (
    <MacWindow windowId="notes">
      <div className="notes-window">
        {/* Notes Sidebar */}
        <div className="notes-sidebar">
          <div className="sidebar-header">Portfolio Notes</div>

          <div className="notes-list">
            {NOTE_DOCS.map((doc) => {
              const IconComponent = doc.icon;
              const isActive = selectedNoteId === doc.id;

              return (
                <div
                  key={doc.id}
                  className={`note-list-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    setSelectedNoteId(doc.id);
                    if (doc.id === 'code_view') {
                      setViewMode('code');
                    }
                  }}
                >
                  <div className="note-title">{doc.title}</div>
                  <div className="note-preview">{doc.preview}</div>
                  <div className="note-date">{doc.date}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes Editor / Content Area */}
        <div className="notes-editor">
          {/* Notes Toolbar */}
          <div className="notes-toolbar">
            <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              iCloud Notes • Synced
            </div>

            <div className="editor-mode-toggle">
              <button
                type="button"
                className={viewMode === 'formatted' ? 'is-active' : ''}
                onClick={() => setViewMode('formatted')}
              >
                <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Formatted
              </button>
              <button
                type="button"
                className={viewMode === 'code' ? 'is-active' : ''}
                onClick={() => setViewMode('code')}
              >
                <Code size={12} style={{ display: 'inline', marginRight: '4px' }} />
                TypeScript
              </button>
            </div>
          </div>

          {/* Content View */}
          <div className="notes-content-scroll">
            {viewMode === 'code' || selectedNoteId === 'code_view' ? (
              <div className="syntax-view">
                {markdown ? (
                  <SyntaxHighlighter language="typescript" style={atelierDuneDark}>
                    {markdown}
                  </SyntaxHighlighter>
                ) : (
                  <p style={{ padding: '20px' }}>Loading TypeScript code definition...</p>
                )}
              </div>
            ) : (
              <div className="note-body">
                {selectedNoteId === 'about' && (
                  <>
                    <h1 className="note-doc-title">{PROFILE.name}</h1>
                    <div className="note-doc-meta">
                      {PROFILE.title} • {PROFILE.location} • {PROFILE.status}
                    </div>

                    <h2>Personal Philosophy</h2>
                    <p>{PROFILE.bio}</p>
                    <p>
                      I believe high quality software combines rock-solid architectural fundamentals with
                      intuitive, fluid micro-interactions. Whether writing backend endpoints in Node.js
                      or crafting bespoke desktop interfaces in React, attention to detail and user
                      empathy drive every line of code.
                    </p>

                    <h2>Quick Links & Contact</h2>
                    <ul>
                      <li>
                        <strong>Email:</strong> {PROFILE.email}
                      </li>
                      <li>
                        <strong>GitHub:</strong>{' '}
                        <a href={PROFILE.github} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                          {PROFILE.github}
                        </a>
                      </li>
                      <li>
                        <strong>LinkedIn:</strong>{' '}
                        <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                          {PROFILE.linkedin}
                        </a>
                      </li>
                    </ul>
                  </>
                )}

                {selectedNoteId === 'skills' && (
                  <>
                    <h1 className="note-doc-title">Technical Skills & Matrix</h1>
                    <div className="note-doc-meta">Proficiencies & Tooling Breakdown</div>

                    <h2>Frontend Engineering</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', margin: '14px 0' }}>
                      {PROFILE.skills.frontend.map((s) => (
                        <div key={s.name} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '10px', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong>{s.name}</strong>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>{s.proficiency}%</span>
                          </div>
                          <div style={{ height: '4px', background: 'var(--control-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${s.proficiency}%`, height: '100%', background: 'var(--accent)' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <h2>Backend & Database Engineering</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', margin: '14px 0' }}>
                      {PROFILE.skills.backend.map((s) => (
                        <div key={s.name} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '10px', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong>{s.name}</strong>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>{s.proficiency}%</span>
                          </div>
                          <div style={{ height: '4px', background: 'var(--control-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${s.proficiency}%`, height: '100%', background: 'var(--accent)' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <h2>Tools, DevOps & Cloud</h2>
                    <p>{PROFILE.skills.tools.join(' • ')}</p>
                  </>
                )}

                {selectedNoteId === 'experience' && (
                  <>
                    <h1 className="note-doc-title">Professional Experience</h1>
                    <div className="note-doc-meta">Career Milestones & Engineering Impact</div>

                    {PROFILE.experience.map((exp) => (
                      <div key={exp.company} style={{ marginBottom: '24px' }}>
                        <h2>{exp.role} — {exp.company}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '-6px' }}>
                          {exp.duration} • {exp.location}
                        </p>
                        <ul>
                          {exp.responsibilities.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                )}

                {selectedNoteId === 'education' && (
                  <>
                    <h1 className="note-doc-title">Education & Academics</h1>
                    <div className="note-doc-meta">University Degree & Coursework</div>

                    {PROFILE.education.map((edu) => (
                      <div key={edu.institution}>
                        <h2>{edu.degree} in {edu.field}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '-6px' }}>
                          {edu.institution} • {edu.period} • {edu.grade}
                        </p>
                        <ul>
                          {edu.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default Note;