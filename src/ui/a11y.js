/**
 * Accessibility utilities for the Stroke Triage Assistant
 */

export function announceScreenChange(screen) {
  const announcement = document.createElement("div");
  announcement.className = "sr-only";
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");

  const screenNames = {
    triage1: "Coma assessment",
    triage2: "Examination capability assessment",
    coma: "Coma module",
    limited: "Limited data module",
    full: "Full stroke assessment",
    results: "Assessment results",
  };

  announcement.textContent = `Navigated to ${screenNames[screen] || screen}`;
  document.body.appendChild(announcement);

  setTimeout(() => announcement.remove(), 1000);
}

export function setPageTitle(screen) {
  const appName = "iGFAP";
  const titles = {
    triage1: "Initial Assessment",
    triage2: "Examination Capability",
    coma: "Coma Module",
    limited: "Limited Data Module",
    full: "Full Stroke Module",
    results: "Assessment Results",
  };

  const section = titles[screen];
  // Brand-first to ensure the tab shows iGFAP even when truncated
  document.title = section ? `${appName} — ${section}` : appName;
}

export function focusMainHeading() {
  // Focus on the main heading for screen readers
  setTimeout(() => {
    const heading = document.querySelector("h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
      // Remove tabindex after focus for proper tab order
      setTimeout(() => heading.removeAttribute("tabindex"), 100);
    }
  }, 100);
}
