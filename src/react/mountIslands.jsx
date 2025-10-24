import { createRoot } from "react-dom/client";

export function mountIslands() {
  // Probability rings
  document.querySelectorAll("[data-react-ring]").forEach(node => {
    if (node.__mounted) return;
    const percent = parseFloat(node.getAttribute("data-percent")) || 0;
    const level = node.getAttribute("data-level") || "normal";
    const root = createRoot(node);
    root.render(<ProbabilityRing percent={percent} level={level} />);
    node.__mounted = true;
    node.__root = root;
  });

  // Tachometer
  document.querySelectorAll("[data-react-tachometer]").forEach(node => {
    if (node.__mounted) return;
    const ich = parseFloat(node.getAttribute("data-ich")) || 0;
    const lvo = parseFloat(node.getAttribute("data-lvo")) || 0;
    const title = node.getAttribute("data-title") || "Decision Support – LVO/ICH";
    const root = createRoot(node);
    root.render(<TachometerGauge ichProb={ich} lvoProb={lvo} title={title} />);
    node.__mounted = true;
    node.__root = root;
  });
}

export function unmountIslands() {
  document.querySelectorAll("[data-react-ring],[data-react-tachometer]").forEach(node => {
    if (node.__mounted && node.__root) {
      node.__root.unmount();
      node.__mounted = false;
      node.__root = null;
    }
  });
}
