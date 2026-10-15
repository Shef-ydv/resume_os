import React, { useState, useEffect, useRef } from 'react';
import MacWindow from './MacWindow';
import { Play, Pause, SkipForward, SkipBack, Music as MusicIcon, Radio } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

const TRACKS = [
  {
    title: 'Midnight Coding Session',
    artist: 'Lo-Fi Chill & Synthwave Beats',
    albumArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    duration: '2:45'
  },
  {
    title: 'Sequoia Dreams',
    artist: 'Ambient Deep Focus Mix',
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    duration: '3:12'
  }
];

const Spotify = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(30);
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(false);

  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const track = TRACKS[currentTrackIndex];

  // Ambient gentle synthesizer for focus beats
  useEffect(() => {
    if (isPlaying) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current && AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current?.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        const ctx = audioCtxRef.current;
        if (ctx) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          gain.gain.setValueAtTime(0.015, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          oscRef.current = osc;
          gainRef.current = gain;
        }
      } catch {
        // silent
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // silent
        }
        oscRef.current = null;
      }
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // silent
        }
        oscRef.current = null;
      }
    };
  }, [isPlaying]);

  // Simulated progress timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    sounds.click();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    sounds.click();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    sounds.click();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <MacWindow windowId="music">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--window-bg)' }}>
        {/* Toggle between Native Mini-Player and Spotify Embed */}
        <div
          style={{
            display: 'flex',
            padding: '6px 12px',
            borderBottom: '1px solid var(--glass-border-subtle)',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            background: 'rgba(0,0,0,0.08)'
          }}
        >
          <span>Music Mode</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setShowSpotifyEmbed(false)}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                background: !showSpotifyEmbed ? 'var(--accent)' : 'var(--control-bg)',
                color: !showSpotifyEmbed ? '#fff' : 'inherit',
                fontWeight: 600
              }}
            >
              Lo-Fi Mini
            </button>
            <button
              type="button"
              onClick={() => setShowSpotifyEmbed(true)}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                background: showSpotifyEmbed ? 'var(--accent)' : 'var(--control-bg)',
                color: showSpotifyEmbed ? '#fff' : 'inherit',
                fontWeight: 600
              }}
            >
              Spotify Web
            </button>
          </div>
        </div>

        {showSpotifyEmbed ? (
          <div style={{ flex: 1, padding: '12px' }}>
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: '12px', border: 'none' }}
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX14CbVHtvHRB?utm_source=generator&theme=0"
              width="100%"
              height="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Playlist"
            />
          </div>
        ) : (
          <div className="music-window">
            <div className="album-art-wrap">
              <img src={track.albumArt} alt={track.title} />
              {isPlaying && (
                <div className="playing-wave">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            <div className="track-meta">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">{track.artist}</div>
            </div>

            <div className="progress-bar-wrap">
              <div
                className="progress-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = ((e.clientX - rect.left) / rect.width) * 100;
                  setProgress(pct);
                }}
              >
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-time">
                <span>0:45</span>
                <span>{track.duration}</span>
              </div>
            </div>

            <div className="player-controls">
              <button type="button" onClick={prevTrack} title="Previous">
                <SkipBack size={18} />
              </button>
              <button
                type="button"
                className="btn-play-main"
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button type="button" onClick={nextTrack} title="Next">
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MacWindow>
  );
};

export default Spotify;