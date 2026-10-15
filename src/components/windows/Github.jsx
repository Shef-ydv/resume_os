import React, { useState, useMemo } from 'react';
import MacWindow from './MacWindow';
import { PROJECTS, PROJECT_CATEGORIES } from '../../data/projectsData';
import {
  Folder,
  Layers,
  Layout,
  Heart,
  Wrench,
  Search,
  Grid,
  List,
  ExternalLink,
  GitBranch,
  Sparkles
} from 'lucide-react';

const CATEGORY_ICONS = {
  all: Folder,
  fullstack: Layers,
  frontend: Layout,
  social: Heart,
  tools: Wrench
};

const Github = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <MacWindow windowId="projects">
      <div className="projects-window">
        {/* Finder Sidebar */}
        <div className="projects-sidebar">
          <div className="sidebar-heading">Categories</div>

          {PROJECT_CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.id] || Folder;
            const count =
              cat.id === 'all'
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.category === cat.id).length;

            return (
              <div
                key={cat.id}
                className={`sidebar-btn ${
                  selectedCategory === cat.id ? 'is-active' : ''
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className="sidebar-btn-left">
                  <IconComponent />
                  <span>{cat.name}</span>
                </div>
                <span className="badge-count">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Finder Main Content */}
        <div className="projects-main">
          {/* Top Finder Toolbar */}
          <div className="projects-toolbar">
            <div className="search-box">
              <Search />
              <input
                type="text"
                placeholder="Search projects, tags, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="view-toggles">
              <button
                type="button"
                className={viewMode === 'grid' ? 'is-active' : ''}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid />
              </button>
              <button
                type="button"
                className={viewMode === 'list' ? 'is-active' : ''}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List />
              </button>
            </div>
          </div>

          {/* Scrollable View Area */}
          <div className="projects-scroll">
            {filteredProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
                No projects matched your search criteria.
              </div>
            ) : viewMode === 'grid' ? (
              <div className="projects-grid">
                {filteredProjects.map((proj) => (
                  <div key={proj.id} className="project-card">
                    <div className="card-media">
                      <img src={proj.image} alt={proj.title} loading="lazy" />
                      {proj.featured && (
                        <div className="featured-tag">
                          <Sparkles size={10} style={{ display: 'inline', marginRight: '3px' }} />
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="card-body">
                      <h4 className="card-title">{proj.title}</h4>
                      <p className="card-description">{proj.description}</p>

                      <div className="tag-chips">
                        {proj.tags.map((tag) => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="card-actions">
                        <a
                          href={proj.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-demo"
                        >
                          <ExternalLink /> Demo Link
                        </a>
                        <a
                          href={proj.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-repo"
                        >
                          <GitBranch /> Repository
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="projects-list">
                {filteredProjects.map((proj) => (
                  <div key={proj.id} className="list-row">
                    <div className="row-info">
                      <div className="row-icon">
                        <Folder size={18} color="var(--accent)" />
                      </div>
                      <div>
                        <div className="row-title">{proj.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {proj.tags.join(' • ')}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={proj.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          background: 'var(--accent)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}
                      >
                        Demo
                      </a>
                      <a
                        href={proj.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          background: 'var(--control-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        Code
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default Github;