import React, { useState } from 'react';
import MacWindow from './MacWindow';
import { ZoomIn, ZoomOut, RotateCcw, Download, ExternalLink } from 'lucide-react';

const Resume = () => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoomLevel(100);

  const customToolbar = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginLeft: '12px',
        padding: '2px 8px',
        borderRadius: '6px',
        background: 'var(--control-bg)'
      }}
    >
      <button
        type="button"
        onClick={handleZoomOut}
        title="Zoom Out"
        style={{ padding: '2px', display: 'flex' }}
      >
        <ZoomOut size={13} />
      </button>
      <span style={{ fontSize: '0.8125rem', minWidth: '36px', textAlign: 'center', fontWeight: 500 }}>
        {zoomLevel}%
      </span>
      <button
        type="button"
        onClick={handleZoomIn}
        title="Zoom In"
        style={{ padding: '2px', display: 'flex' }}
      >
        <ZoomIn size={13} />
      </button>
      <button
        type="button"
        onClick={handleResetZoom}
        title="Reset Zoom"
        style={{ padding: '2px', display: 'flex' }}
      >
        <RotateCcw size={13} />
      </button>
    </div>
  );

  return (
    <MacWindow windowId="resume" customToolbar={customToolbar}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--window-bg)'
        }}
      >
        {/* PDF Action Bar */}
        <div
          style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid var(--glass-border-subtle)',
            background: 'rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Shefali_Yadav_Resume.pdf (Official Document)
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'var(--control-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: '500'
              }}
            >
              <ExternalLink size={14} /> Open Full
            </a>
            <a
              href="/resume.pdf"
              download="Shefali_Yadav_Resume.pdf"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '0.8125rem',
                fontWeight: '600'
              }}
            >
              <Download size={14} /> Download PDF
            </a>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.25)'
          }}
        >
          <div
            style={{
              width: `${zoomLevel}%`,
              height: '100%',
              minHeight: '520px',
              transition: 'width 0.2s ease',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.4)'
            }}
          >
            <iframe
              src="/resume.pdf#toolbar=0&navpanes=0"
              title="Resume PDF"
              width="100%"
              height="100%"
              style={{ border: 'none', background: '#fff' }}
            />
          </div>
        </div>
      </div>
    </MacWindow>
  );
};

export default Resume;