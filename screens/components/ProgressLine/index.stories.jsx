import React, { useState } from 'react';
import ProgressLine from './index';

export default {
  title: 'Components/ProgressLine',
  component: ProgressLine,
};

const Controlled = ({ children }) => {
  const [progress, setProgress] = useState(40);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
      {children(progress)}
      <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} aria-label="Progreso" />
    </div>
  );
};

export const Solid = {
  render: () => <Controlled>{(progress) => <ProgressLine progress={progress} />}</Controlled>,
};

export const Dashed = {
  render: () => <Controlled>{(progress) => <ProgressLine lineStyle="dashed" progress={progress} />}</Controlled>,
};

export const Vertical = {
  render: () => (
    <Controlled>
      {(progress) => (
        <div style={{ display: 'flex', gap: 32, height: 160 }}>
          <ProgressLine orientation="vertical" progress={progress} />
          <ProgressLine orientation="vertical" lineStyle="dashed" progress={progress} />
        </div>
      )}
    </Controlled>
  ),
};

export const CustomColorsAndThickness = {
  render: () => (
    <Controlled>
      {(progress) => (
        <ProgressLine thickness={8} trackColor="#d1fae5" fillColor="#059669" progress={progress} />
      )}
    </Controlled>
  ),
};

export const AsProgressBar = {
  name: 'Como progressbar accesible',
  render: () => <ProgressLine thickness={6} progress={65} aria-label="Carga completada" />,
};
