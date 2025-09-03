/**
 * Tachometer gauge for LVO/ICH ratio visualization
 */

let tachometerAnimation = null;
let lastRAFCanvasId = null;

export function initializeTachometer(ichPercent, lvoPercent) {
  const canvas = document.getElementById('tachometerCanvas');
  if (!canvas) return;

  // Cancel previous RAF tied to a different canvas to avoid double animation
  if (lastRAFCanvasId && lastRAFCanvasId !== canvas) {
    cleanupTachometer();
  }
  lastRAFCanvasId = canvas;

  const ctx = canvas.getContext('2d');

  // HiDPI rendering setup based on CSS size
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssWidth = rect.width || canvas.width;
  const cssHeight = rect.height || canvas.height;
  canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
  canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  // Derived values
  const ratio = lvoPercent / Math.max(ichPercent, 1);
  const absDiff = Math.abs(lvoPercent - ichPercent);
  // Heuristic confidence based on absolute difference and max risk
  const maxProb = Math.max(lvoPercent, ichPercent);
  let confidence = 0;
  if (absDiff < 10) confidence = Math.round(30 + maxProb * 0.3);
  else if (absDiff < 20) confidence = Math.round(50 + maxProb * 0.4);
  else confidence = Math.round(70 + maxProb * 0.3);
  confidence = Math.max(0, Math.min(100, confidence));

  // Map ratio 0.5–2.0 to needle position 0–1, clamp extremes
  const targetPosition = (() => {
    if (ratio < 0.5) return 0;
    if (ratio > 2.0) return 1;
    return (ratio - 0.5) / 1.5;
  })();

  let currentPosition = 0.5; // start centered
  let settleFrames = 0;

  const drawTachometer = () => {
    const width = cssWidth;
    const height = cssHeight;
    const centerX = width / 2;
    const centerY = height * 0.72;
    const radius = Math.min(width, height) * 0.38;

    // Transparent background: clear only
    ctx.clearRect(0, 0, width, height);

    // Base arc track
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 28;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25, false);
    ctx.stroke();

    // Colored gradient zones (approximate from design spec)
    const zones = [
      { start: 0.75, end: 1.0, c1: '#ff0040', c2: '#ff3366', op: '99' }, // ICH red
      { start: 1.0, end: 1.25, c1: '#ff3366', c2: '#ff9900', op: '88' },
      { start: 1.25, end: 1.75, c1: '#ff9900', c2: '#ffcc00', op: '88' },
      { start: 1.75, end: 2.0, c1: '#00aaff', c2: '#0099ff', op: '88' },
      { start: 2.0, end: 2.25, c1: '#0099ff', c2: '#00ddff', op: '99' }, // LVO cyan
    ];

    zones.forEach(z => {
      const startA = Math.PI * z.start;
      const endA = Math.PI * z.end;
      const grad = ctx.createLinearGradient(
        centerX + Math.cos(startA) * radius,
        centerY + Math.sin(startA) * radius,
        centerX + Math.cos(endA) * radius,
        centerY + Math.sin(endA) * radius
      );
      grad.addColorStop(0, z.c1 + z.op);
      grad.addColorStop(1, z.c2 + z.op);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 24;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startA, endA, false);
      ctx.stroke();
    });

    // Scale marks and labels
    const marks = [0.5, 0.75, 1.0, 1.5, 2.0];
    marks.forEach(val => {
      const pos = Math.min(1, Math.max(0, (val - 0.5) / 1.5));
      const angle = Math.PI * (0.75 + pos * 1.5);
      const inner = radius - 18;
      const outer = radius - 30;

      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
      ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = 'bold 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(val.toFixed(1), centerX + Math.cos(angle) * (radius - 48), centerY + Math.sin(angle) * (radius - 48));
    });

    // Decision threshold markers at ~0.77 and ~1.3
    const thresholds = [
      { val: 0.77, label: 'ICH dom.' },
      { val: 1.30, label: 'LVO dom.' }
    ];
    thresholds.forEach(th => {
      const pos = Math.min(1, Math.max(0, (th.val - 0.5) / 1.5));
      const a = Math.PI * (0.75 + pos * 1.5);
      const inner = radius - 8;
      const outer = radius + 4;
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(a) * inner, centerY + Math.sin(a) * inner);
      ctx.lineTo(centerX + Math.cos(a) * outer, centerY + Math.sin(a) * outer);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.font = '600 10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(th.label, centerX + Math.cos(a) * (radius + 18), centerY + Math.sin(a) * (radius + 18));
    });

    // Zone edge labels: ICH (left), LVO (right)
    ctx.font = '700 13px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff0040';
    const ichA = Math.PI * 0.75;
    ctx.fillText('ICH', centerX + Math.cos(ichA) * (radius + 36), centerY + Math.sin(ichA) * (radius + 36) - 8);
    ctx.fillStyle = '#00d4ff';
    const lvoA = Math.PI * 2.25;
    ctx.fillText('LVO', centerX + Math.cos(lvoA) * (radius + 36), centerY + Math.sin(lvoA) * (radius + 36) - 8);

    // Smoothly move needle toward target
    currentPosition += (targetPosition - currentPosition) * 0.08;

    // Needle color by dominance
    let needleColor = '#ffd700';
    if (currentPosition < 0.35) needleColor = '#ff0040';
    else if (currentPosition > 0.65) needleColor = '#00d4ff';

    // Draw needle shadow/glow
    const needleAngle = Math.PI * (0.75 + currentPosition * 1.5);
    const needleLen = radius - 32;

    // Confidence cone (semi-transparent wedge around needle)
    const coneSpan = (1 - confidence / 100) * (Math.PI * 0.12); // max ±~21.6° at 0% conf
    const coneInner = 10;
    ctx.save();
    ctx.fillStyle = needleColor + '33'; // add alpha
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, needleLen, needleAngle - coneSpan, needleAngle + coneSpan, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.shadowColor = needleColor;
    ctx.shadowBlur = 16;
    ctx.strokeStyle = needleColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(needleAngle) * needleLen, centerY + Math.sin(needleAngle) * needleLen);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Needle tip
    ctx.fillStyle = needleColor;
    ctx.beginPath();
    ctx.arc(centerX + Math.cos(needleAngle) * needleLen, centerY + Math.sin(needleAngle) * needleLen, 5, 0, Math.PI * 2);
    ctx.fill();

    // Center hub with subtle gradient
    const hub = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 16);
    hub.addColorStop(0, 'rgba(255,255,255,0.25)');
    hub.addColorStop(1, 'rgba(10,14,39,0.9)');
    ctx.fillStyle = hub;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = needleColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.fillStyle = needleColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Ratio text
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '600 16px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ratio.toFixed(2), centerX, centerY - radius * 0.65);

    // Continue animating until near target; then stop to save CPU
    const delta = Math.abs(currentPosition - targetPosition);
    if (delta > 0.002) {
      settleFrames = 0;
      tachometerAnimation = requestAnimationFrame(drawTachometer);
    } else {
      currentPosition = targetPosition;
      settleFrames += 1;
      if (settleFrames < 4) {
        tachometerAnimation = requestAnimationFrame(drawTachometer);
      } else {
        cancelAnimationFrame(tachometerAnimation);
        tachometerAnimation = null;
      }
    }
  };

  // Start animation
  drawTachometer();
}

export function cleanupTachometer() {
  if (tachometerAnimation) {
    cancelAnimationFrame(tachometerAnimation);
    tachometerAnimation = null;
  }
  lastRAFCanvasId = null;
}
