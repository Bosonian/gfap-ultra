import React, { useEffect, useRef } from 'react';

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function ProbabilityRing({ percent = 0, level = 'normal' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement; // parent is .probability-circle
    if (!container || !canvas) return;
    
    containerRef.current = container;

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
      // Proportional stroke with better minimum readability
      const progressWidth = Math.min(Math.max(radius * 0.12, 6), 12);
      const trackWidth = Math.max(progressWidth - 2, 6);
      // Pixel snapping for crisp lines
      const adjustedRadius = progressWidth % 2 === 1 ? radius - 0.5 : radius;

      ctx.clearRect(0, 0, width, height);

      // Track - better contrast in both themes
      const isDark = document.body.classList.contains('dark-mode');
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
      ctx.lineWidth = trackWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, adjustedRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Progress color - enhanced saturation in dark mode
      let stroke = getCSSVar('--primary-color');
      if (level === 'high') stroke = getCSSVar('--warning-color') || '#ff9800';
      if (level === 'critical') stroke = getCSSVar('--danger-color') || '#DC143C';
      
      // Boost saturation slightly in dark mode
      if (isDark) {
        if (stroke.includes('#')) {
          // Simple saturation boost for hex colors
          if (level === 'high') stroke = '#ffaa00';
          if (level === 'critical') stroke = '#ff1744';
        }
      }

      // Progress arc
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI * 2) * (Math.max(0, Math.min(100, percent)) / 100);

      // Subtle depth shadow - more prominent on larger rings
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.15)';
      ctx.lineWidth = progressWidth + 1;
      ctx.beginPath();
      ctx.arc(cx, cy, adjustedRadius, startAngle, endAngle, false);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = stroke;
      ctx.lineWidth = progressWidth;
      ctx.beginPath();
      ctx.arc(cx, cy, adjustedRadius, startAngle, endAngle, false);
      ctx.stroke();
    };

    draw();

    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, [percent, level]);

  return (
    <>
      <div 
        className="probability-number" 
        style={{ 
          fontVariantNumeric: 'tabular-nums',
          fontSize: `${Math.max(16, (containerRef.current?.offsetWidth || 120) * 0.28)}px`,
        }}
      >
        {Math.round(percent)}
        <span 
          style={{
            fontSize: `${Math.max(10, (containerRef.current?.offsetWidth || 120) * 0.16)}px`,
            transform: 'translateY(-2px)', // Better baseline alignment
            display: 'inline-block'
          }}
        >
          %
        </span>
      </div>
      <canvas ref={canvasRef} className="probability-canvas" />
    </>
  );
}
