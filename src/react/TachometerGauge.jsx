import React, { useEffect, useRef } from 'react';

export default function TachometerGauge({ lvoProb = 0, ichProb = 0, title = 'Decision Support – LVO/ICH' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let raf = null;
    let currentPos = 0.5;
    let settle = 0;
    // Robust ratio with epsilon to avoid division spikes
    const eps = 0.5; // percent points
    const safeIch = Math.max(ichProb, eps);
    const rawRatio = lvoProb / safeIch;
    // Clamp to display bounds
    const rmin = 0.5, rmax = 2.0;
    const clampedRatio = Math.max(rmin, Math.min(rmax, rawRatio));
    // Log-centered mapping around 1.0 so equal risks map to center
    const targetPos = (Math.log2(clampedRatio) + 1) / 2; // 0 at 0.5, 0.5 at 1.0, 1 at 2.0
    const absDiff = Math.abs(lvoProb - ichProb);
    const maxProb = Math.max(lvoProb, ichProb);
    let confidence = absDiff < 10 ? Math.round(30 + maxProb * 0.3) : absDiff < 20 ? Math.round(50 + maxProb * 0.4) : Math.round(70 + maxProb * 0.3);
    confidence = Math.max(0, Math.min(100, confidence));

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width || 300;
      const cssH = rect.height || 200;
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const width = cssW;
      const height = cssH;
      const isMobile = width < 480;
      const isTablet = width >= 480 && width < 1024;
      // Responsive stroke widths
      const baseWidth = isMobile ? 18 : isTablet ? 20 : 26;
      const zoneWidth = isMobile ? 14 : isTablet ? 16 : 22;
      const padding = 10;
      // Geometry-safe radius and center to avoid clipping or dipping
      const maxRHorizontal = (width / 2) - padding - baseWidth / 2;
      // Tighter vertical radius on tablet to avoid a bloated look
      const maxRVerticalBase = (height / 2) - padding - baseWidth / 2;
      const maxRVertical = isTablet ? Math.min(maxRVerticalBase, height * 0.42) : maxRVerticalBase;
      const radius = Math.max(10, Math.min(maxRHorizontal, maxRVertical));
      const cx = width / 2;
      const cy = height - (padding + baseWidth / 2 + radius);

      ctx.clearRect(0, 0, width, height);

      const isDark = document.body.classList.contains('dark-mode');
      
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = baseWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Bottom semicircle from right (0) -> left (π)
      ctx.arc(cx, cy, radius, 0, Math.PI, false);
      ctx.stroke();

      // Zones on bottom semicircle: blue (LVO) on right, warm middle, red (ICH) on left
      const zones = [
        // Right segment (0 -> π/3): LVO (blue)
        { start: 0, end: Math.PI / 3, c1: '#0099ff', c2: '#00ddff', op: isDark ? 'dd' : 'dd' },
        // Middle segment (π/3 -> 2π/3): warm blend
        { start: Math.PI / 3, end: (2 * Math.PI) / 3, c1: '#ff7a00', c2: '#ffcc00', op: isDark ? 'cc' : 'cc' },
        // Left segment (2π/3 -> π): ICH (red)
        { start: (2 * Math.PI) / 3, end: Math.PI, c1: '#ff0040', c2: '#ff3366', op: isDark ? 'dd' : 'dd' },
      ];
      zones.forEach(z => {
        const grad = ctx.createLinearGradient(
          cx + Math.cos(z.start) * radius,
          cy + Math.sin(z.start) * radius,
          cx + Math.cos(z.end) * radius,
          cy + Math.sin(z.end) * radius
        );
        grad.addColorStop(0, z.c1 + z.op);
        grad.addColorStop(1, z.c2 + z.op);
        ctx.strokeStyle = grad;
        ctx.lineWidth = zoneWidth;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, z.start, z.end, false);
        ctx.stroke();
      });

      // Dynamic sub-band: draw on an inner radius so it stands out
      const bandPos = currentPos; // use current needle pos for visual stability
      const bandAngle = Math.PI - bandPos * Math.PI; // 0..π
      const bandWidth = Math.max(8, zoneWidth - 4);
      const rBand = radius - baseWidth / 2 - 2; // slight inset inside zone
      const bandLabelFont = isMobile ? 11 : 13;
      ctx.lineWidth = bandWidth;
      if (Math.abs(bandPos - 0.5) > 0.005) { // skip only if truly centered
        if (bandPos < 0.5) {
          // ICH side: from left endpoint (π) to needle angle
          const grad = ctx.createLinearGradient(
            cx + Math.cos(Math.PI) * rBand,
            cy + Math.sin(Math.PI) * rBand,
            cx + Math.cos(bandAngle) * rBand,
            cy + Math.sin(bandAngle) * rBand
          );
          grad.addColorStop(0, '#ff0040');
          grad.addColorStop(1, '#ff3366');
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, rBand, bandAngle, Math.PI, false);
          ctx.stroke();
          // Label near mid of band
          const mid = (bandAngle + Math.PI) / 2;
          ctx.fillStyle = '#ff3366';
          ctx.font = `700 ${bandLabelFont}px Inter, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const labelR = radius + (isMobile ? 18 : 24);
          ctx.fillText('ICH', cx + Math.cos(mid) * labelR, cy + Math.sin(mid) * labelR);
        } else {
          // LVO side: from right endpoint (0) to needle angle
          const grad = ctx.createLinearGradient(
            cx + Math.cos(0) * rBand,
            cy + Math.sin(0) * rBand,
            cx + Math.cos(bandAngle) * rBand,
            cy + Math.sin(bandAngle) * rBand
          );
          grad.addColorStop(0, '#0099ff');
          grad.addColorStop(1, '#00ddff');
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, rBand, 0, bandAngle, false);
          ctx.stroke();
          // Label near mid of band
          const mid = bandAngle / 2;
          ctx.fillStyle = '#00bbff';
          ctx.font = `700 ${bandLabelFont}px Inter, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const labelR = radius + (isMobile ? 18 : 24);
          ctx.fillText('LVO', cx + Math.cos(mid) * labelR, cy + Math.sin(mid) * labelR);
        }
      }

      // (Removed duplicate sub-band block)

      // Ticks - fewer on mobile, responsive sizing
      const marks = isMobile ? [0.5, 1.0, 2.0] : [0.5, 0.75, 1.0, 1.5, 2.0];
      const tickFont = isMobile ? 12 : 14;
      marks.forEach(val => {
        // Log-centered tick mapping
        const pos = (Math.log2(val) + 1) / 2;
        const a = Math.PI - pos * Math.PI; // bottom semicircle
        const inner = radius - 15;
        const outer = radius - 28;
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
        ctx.stroke();
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.85)';
        ctx.font = `bold ${tickFont}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toFixed(1), cx + Math.cos(a) * (radius - 40), cy + Math.sin(a) * (radius - 40));
      });

      // Threshold markers - responsive sizing
      const thresholds = [
        { val: 0.77, label: 'ICH dom.' },
        { val: 1.30, label: 'LVO dom.' }
      ];
      const thresholdFont = isMobile ? 11 : 13;
      thresholds.forEach(th => {
        const pos = (Math.log2(th.val) + 1) / 2;
        const a = Math.PI - pos * Math.PI;
        const inner = radius - 6;
        const outer = radius + 8;
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
        ctx.stroke();
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)';
        ctx.font = `600 ${thresholdFont}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelDistance = isMobile ? radius + 20 : radius + 24;
        ctx.fillText(th.label, cx + Math.cos(a) * labelDistance, cy + Math.sin(a) * labelDistance);
      });

      // Labels ICH/LVO - responsive sizing and enhanced contrast
      const labelFont = isMobile ? 14 : 16;
      const labelDistance = isMobile ? radius + 32 : radius + 38;
      ctx.fillStyle = isDark ? '#ff3366' : '#ff0040';
      ctx.font = `700 ${labelFont}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (isDark) {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 2;
      }
      ctx.fillText('ICH', cx + Math.cos(Math.PI) * labelDistance, cy + Math.sin(Math.PI) * labelDistance - 8);
      ctx.fillStyle = isDark ? '#33bbff' : '#00d4ff';
      ctx.fillText('LVO', cx + Math.cos(0) * labelDistance, cy + Math.sin(0) * labelDistance - 8);
      ctx.shadowBlur = 0;

      // Animate needle
      currentPos += (targetPos - currentPos) * 0.08;
      const needleAngle = Math.PI - currentPos * Math.PI; // bottom semicircle mapping
      const tipMargin = 8;
      const needleLen = Math.max(0, radius - baseWidth / 2 - tipMargin);

      // Confidence cone - tighter on mobile to reduce visual noise
      const coneSpan = (1 - confidence / 100) * (Math.PI * (isMobile ? 0.06 : 0.08));
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, needleLen, needleAngle - coneSpan, needleAngle + coneSpan, false);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Needle
      let needleColor = '#ffd700';
      if (currentPos < 0.35) needleColor = '#ff0040';
      else if (currentPos > 0.65) needleColor = '#00d4ff';
      ctx.shadowColor = needleColor;
      ctx.shadowBlur = 16;
      ctx.strokeStyle = needleColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(needleAngle) * needleLen, cy + Math.sin(needleAngle) * needleLen);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = needleColor;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(needleAngle) * needleLen, cy + Math.sin(needleAngle) * needleLen, 5, 0, Math.PI * 2);
      ctx.fill();

      // Center hub
      const hub = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
      hub.addColorStop(0, 'rgba(255,255,255,0.25)');
      hub.addColorStop(1, 'rgba(10,14,39,0.9)');
      ctx.fillStyle = hub;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = needleColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ratio text - responsive sizing
      const ratioFont = isMobile ? 16 : 18;
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)';
      ctx.font = `600 ${ratioFont}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'center';
      if (isDark) {
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 2;
      }
      ctx.fillText(ratio.toFixed(2), cx, cy - radius * 0.72);
      ctx.shadowBlur = 0;

      const delta = Math.abs(currentPos - targetPos);
      if (delta > 0.002) {
        settle = 0;
        raf = requestAnimationFrame(draw);
      } else if (settle < 4) {
        settle += 1;
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    draw();
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [lvoProb, ichProb]);

  return (
    <div className="gauge-wrapper">
      <canvas ref={canvasRef} className="gauge-canvas" />
    </div>
  );
}
