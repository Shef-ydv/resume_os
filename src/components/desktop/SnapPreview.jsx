import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';

const SnapPreview = () => {
  const { snapPreview } = useWindowManager();

  if (!snapPreview) return null;

  return (
    <div
      className={`snap-preview-overlay snap-${snapPreview}`}
      aria-hidden="true"
    />
  );
};

export default SnapPreview;
