// Canvas-based probability ring for ICH/LVO to match volume ring elegance

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function renderProbabilityRing(percent, level = 'normal') {
  const clamped = Math.max(0, Math.min(100, percent || 0));
  return `
    <div class="probability-circle" data-prob="${clamped}" data-level="${level}">
      <div class="probability-number">${Math.round(clamped)}<span>%</span></div>
      <canvas class="probability-canvas"></canvas>
    </div>
  `;
}

export function initializeProbabilityRings(root = document) {
  const canvases = root.querySelectorAll('.probability-canvas');
  canvases.forEach((canvas) => {
    const container = canvas.closest('.probability-circle');
    if (!container) {
      return;
    }
    const percent = parseFloat(container.dataset.prob) || 0;
    const level = container.dataset.level || 'normal';

    const dpr = window.devicePixelRatio || 1;
    const size = parseFloat(getComputedStyle(container).width) || 120;
    canvas.width = Math.max(1, Math.floor(size * dpr));
    canvas.height = Math.max(1, Math.floor(size * dpr));

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const width = size;
    const height = size;
    const cx = width / 2;
    const cy = height / 2;
    const radius = (size / 2) - 6; // padding for stroke

    // Track style
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.25)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Progress color by level
    let stroke = getCSSVar('--primary-color');
    if (level === 'high') {
      stroke = getCSSVar('--warning-color') || '#ff9800';
    }
    if (level === 'critical') {
      stroke = getCSSVar('--danger-color') || '#DC143C';
    }

    // Progress arc (start at -90deg)
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2) * (percent / 100);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = level === 'normal' ? 10 : 12;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle, false);
    ctx.stroke();
  });
}

// Optional: re-render on resize for crispness
let resizeObserver;
export function observeProbabilityRings(root = document) {
  if (typeof ResizeObserver === 'undefined') {
    return;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  resizeObserver = new ResizeObserver(() => initializeProbabilityRings(root));
  root.querySelectorAll('.probability-circle').forEach((el) => resizeObserver.observe(el));
}
