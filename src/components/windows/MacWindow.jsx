import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useWindowManager, WINDOW_CONFIGS } from '../../context/WindowManagerContext';

const MacWindow = ({ windowId, children, customToolbar }) => {
  const {
    windows,
    activeWindowId,
    bringToFront,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    updatePosition,
    updateSize,
    setSnapPreview,
    applySnap,
    snapPreview
  } = useWindowManager();

  const [isDragging, setIsDragging] = useState(false);

  const win = windows[windowId];
  const config = WINDOW_CONFIGS[windowId] || {};
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  if (!win || !win.isOpen) return null;

  const isFocused = activeWindowId === windowId;
  const isMaximized = win.isMaximized || isMobile;

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const rndProps = isMaximized
    ? {
        position: { x: 0, y: isMobile ? 32 : 32 },
        size: {
          width: '100vw',
          height: isMobile ? 'calc(100vh - 32px)' : 'calc(100vh - 32px - 74px)'
        },
        disableDragging: true,
        enableResizing: false
      }
    : {
        position: {
          x: win.x ?? config.defaultPos?.x ?? 120,
          y: Math.max(32, win.y ?? config.defaultPos?.y ?? 60)
        },
        size: {
          width: win.width ?? config.defaultSize?.width ?? 720,
          height: win.height ?? config.defaultSize?.height ?? 480
        },
        minWidth: config.minWidth || 380,
        minHeight: config.minHeight || 280,
        bounds: {
          top: 32, // Menubar constraint: titlebar NEVER goes under 32px!
          left: -((win.width || 720) - 100),
          right: screenWidth - 80,
          bottom: screenHeight - 60
        },
        dragHandleClassName: '.window-header'
      };

  const handleDrag = (e, d) => {
    // Edge Snap Detection during drag
    const clientX = e.clientX ?? d.x;
    const clientY = e.clientY ?? d.y;

    if (clientY <= 45) {
      setSnapPreview('top');
    } else if (clientX <= 25) {
      setSnapPreview('left');
    } else if (clientX >= screenWidth - 25) {
      setSnapPreview('right');
    } else {
      setSnapPreview(null);
    }
  };

  const handleDragStop = (e, d) => {
    setIsDragging(false);

    if (snapPreview) {
      applySnap(windowId, snapPreview);
    } else {
      // Clamp bounds: titlebar strictly at y >= 32
      const clampedX = Math.max(-((win.width || 720) - 100), Math.min(d.x, screenWidth - 100));
      const clampedY = Math.max(32, Math.min(d.y, screenHeight - 60));
      updatePosition(windowId, { x: clampedX, y: clampedY });
    }
  };

  return (
    <Rnd
      {...rndProps}
      style={{
        zIndex: win.zIndex,
        userSelect: isDragging ? 'none' : 'auto'
      }}
      className={`os-window-wrapper ${isFocused ? 'is-focused' : ''} ${
        win.isMinimized ? 'is-minimized' : ''
      }`}
      onDragStart={() => {
        setIsDragging(true);
        bringToFront(windowId);
      }}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStart={() => bringToFront(windowId)}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          updateSize(windowId, {
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10)
          });
          updatePosition(windowId, {
            x: position.x,
            y: Math.max(32, position.y)
          });
        }
      }}
      onMouseDown={() => bringToFront(windowId)}
    >
      <div className="os-window">
        <div
          className="window-header"
          data-cursor={isDragging ? 'grabbing' : 'grab'}
          onDoubleClick={() => toggleMaximize(windowId)}
        >
          <div className="window-header-left">
            <div className="traffic-lights">
              <button
                type="button"
                className="traffic-dot close"
                title="Close"
                data-cursor="pointer"
                data-cursor-text="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(windowId);
                }}
              >
                <X />
              </button>
              <button
                type="button"
                className="traffic-dot minimize"
                title="Minimize"
                data-cursor="pointer"
                data-cursor-text="Min"
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(windowId);
                }}
              >
                <Minus />
              </button>
              <button
                type="button"
                className="traffic-dot maximize"
                title={isMaximized ? 'Restore' : 'Maximize'}
                data-cursor="pointer"
                data-cursor-text="Zoom"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize(windowId);
                }}
              >
                <Maximize2 />
              </button>
            </div>
            {customToolbar}
          </div>

          <div className="window-header-center">
            <span className="window-title">{config.title}</span>
          </div>

          <div className="window-header-right" />
        </div>

        <div className="window-content">{children}</div>
      </div>
    </Rnd>
  );
};

export default MacWindow;