import React, { useRef, useEffect } from 'react';
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
    updateSize
  } = useWindowManager();

  const win = windows[windowId];
  const config = WINDOW_CONFIGS[windowId] || {};
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  if (!win || !win.isOpen) return null;

  const isFocused = activeWindowId === windowId;
  const isMaximized = win.isMaximized || isMobile;

  const rndProps = isMaximized
    ? {
        position: { x: 0, y: isMobile ? 30 : 30 },
        size: {
          width: '100vw',
          height: isMobile ? 'calc(100vh - 30px)' : 'calc(100vh - 30px - 70px)'
        },
        disableDragging: true,
        enableResizing: false
      }
    : {
        position: { x: win.x ?? config.defaultPos?.x ?? 150, y: win.y ?? config.defaultPos?.y ?? 80 },
        size: {
          width: win.width ?? config.defaultSize?.width ?? 680,
          height: win.height ?? config.defaultSize?.height ?? 460
        },
        minWidth: config.minWidth || 380,
        minHeight: config.minHeight || 280,
        bounds: '.os-workspace',
        dragHandleClassName: '.window-header'
      };

  return (
    <Rnd
      {...rndProps}
      style={{ zIndex: win.zIndex }}
      className={`os-window-wrapper ${isFocused ? 'is-focused' : ''} ${
        win.isMinimized ? 'is-minimized' : ''
      }`}
      onDragStart={() => bringToFront(windowId)}
      onDragStop={(e, d) => {
        if (!isMaximized) {
          updatePosition(windowId, { x: d.x, y: d.y });
        }
      }}
      onResizeStart={() => bringToFront(windowId)}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          updateSize(windowId, {
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10)
          });
          updatePosition(windowId, position);
        }
      }}
      onMouseDown={() => bringToFront(windowId)}
    >
      <div className="os-window">
        <div
          className="window-header"
          onDoubleClick={() => toggleMaximize(windowId)}
        >
          <div className="window-header-left">
            <div className="traffic-lights">
              <button
                type="button"
                className="traffic-dot close"
                title="Close"
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