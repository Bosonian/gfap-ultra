import React, { useEffect, useRef } from 'react';

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function ProbabilityRing({ percent = 0, level = 'normal' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement; // parent is .probability-circle
    if (!container || !canvas) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const size = container.offsetWidth || 120;
      canvas.width = Math.max(1, Math.floor(size * dpr));
      canvas.height = Math.max(1, Math.floor(size * dpr));
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const width = size;
      const height = size;
      const cx = width / 2;
      const cy = height / 2;
      const radius = (size / 2) - 8;
      const progressWidth = Math.min(Math.max(radius * 0.12, 6), 14);
      const trackWidth = Math.max(progressWidth - 2, 4);

      ctx.clearRect(0, 0, width, height);

      // Track
      ctx.strokeStyle = 'rgba(128,128,128,0.25)';
      ctx.lineWidth = trackWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Progress color
      let stroke = getCSSVar('--primary-color');
      if (level === 'high') stroke = getCSSVar('--warning-color') || '#ff9800';
      if (level === 'critical') stroke = getCSSVar('--danger-color') || '#DC143C';

      // Progress arc
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI * 2) * (Math.max(0, Math.min(100, percent)) / 100);

      // Soft shadow behind progress for depth
      ctx.save();
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = progressWidth + 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle, false);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = stroke;
      ctx.lineWidth = progressWidth;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle, false);
      ctx.stroke();
    };

    draw();

    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, [percent, level]);

  return (
    <>
      <div className="probability-number" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {Math.round(percent)}<span>%</span>
      </div>
      <canvas ref={canvasRef} className="probability-canvas" />
    </>
  );
}
