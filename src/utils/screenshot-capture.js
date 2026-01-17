/**
 * Screenshot Capture Utility
 * Captures full-page screenshots of results for Rettungsdienst documentation
 *
 * @author iGFAP Project Team
 */

import html2canvas from "html2canvas";

/**
 * Expand all collapsible sections on the page
 */
function expandAllSections() {
  const collapsibleContents = document.querySelectorAll(".collapsible-content");
  const toggleArrows = document.querySelectorAll(".toggle-arrow");
  const infoToggles = document.querySelectorAll(".info-toggle");

  collapsibleContents.forEach(content => {
    content.style.display = "block";
    content.classList.add("show");
    content.classList.remove("hidden");
  });

  toggleArrows.forEach(arrow => {
    arrow.style.transform = "rotate(180deg)";
  });

  infoToggles.forEach(toggle => {
    toggle.classList.add("active");
  });
}

/**
 * Restore collapsible sections to their original state
 */
function collapseAllSections() {
  const collapsibleContents = document.querySelectorAll(".collapsible-content");
  const toggleArrows = document.querySelectorAll(".toggle-arrow");
  const infoToggles = document.querySelectorAll(".info-toggle");

  collapsibleContents.forEach(content => {
    content.style.display = "none";
    content.classList.remove("show");
    content.classList.add("hidden");
  });

  toggleArrows.forEach(arrow => {
    arrow.style.transform = "rotate(0deg)";
  });

  infoToggles.forEach(toggle => {
    toggle.classList.remove("active");
  });
}

/**
 * Generate timestamp string for filename
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

/**
 * Add comprehensive temporary CSS for screenshot capture
 * These styles replace Tailwind when stylesheets are disabled
 */
function addOklchFallbackStyles() {
  const style = document.createElement("style");
  style.id = "screenshot-oklch-fallback";
  style.textContent = `
    /* Comprehensive fallback styles for screenshot (replaces Tailwind) */
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body, html {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f3f4f6;
      color: #111827;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    /* Flexbox utilities */
    .flex { display: flex !important; }
    .flex-col { flex-direction: column !important; }
    .flex-row { flex-direction: row !important; }
    .items-center { align-items: center !important; }
    .items-start { align-items: flex-start !important; }
    .justify-center { justify-content: center !important; }
    .justify-between { justify-content: space-between !important; }
    .justify-start { justify-content: flex-start !important; }
    .gap-2 { gap: 0.5rem !important; }
    .gap-3 { gap: 0.75rem !important; }
    .gap-4 { gap: 1rem !important; }
    /* Spacing */
    .p-2 { padding: 0.5rem !important; }
    .p-3 { padding: 0.75rem !important; }
    .p-4 { padding: 1rem !important; }
    .p-6 { padding: 1.5rem !important; }
    .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
    .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
    .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
    .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
    .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
    .m-0 { margin: 0 !important; }
    .mb-2 { margin-bottom: 0.5rem !important; }
    .mb-4 { margin-bottom: 1rem !important; }
    .mt-2 { margin-top: 0.5rem !important; }
    .mt-4 { margin-top: 1rem !important; }
    .mx-auto { margin-left: auto !important; margin-right: auto !important; }
    /* Width/Height */
    .w-full { width: 100% !important; }
    .max-w-4xl { max-width: 56rem !important; }
    .min-h-screen { min-height: 100vh !important; }
    /* Text */
    .text-xs { font-size: 0.75rem !important; }
    .text-sm { font-size: 0.875rem !important; }
    .text-base { font-size: 1rem !important; }
    .text-lg { font-size: 1.125rem !important; }
    .text-xl { font-size: 1.25rem !important; }
    .text-2xl { font-size: 1.5rem !important; }
    .text-3xl { font-size: 1.875rem !important; }
    .font-medium { font-weight: 500 !important; }
    .font-semibold { font-weight: 600 !important; }
    .font-bold { font-weight: 700 !important; }
    .text-center { text-align: center !important; }
    /* Colors */
    .bg-white { background-color: #ffffff !important; }
    .bg-gray-50 { background-color: #f9fafb !important; }
    .bg-gray-100 { background-color: #f3f4f6 !important; }
    .bg-gray-200 { background-color: #e5e7eb !important; }
    .bg-gray-800 { background-color: #1f2937 !important; }
    .bg-red-50 { background-color: #fef2f2 !important; }
    .bg-red-100 { background-color: #fee2e2 !important; }
    .bg-red-500 { background-color: #ef4444 !important; }
    .bg-red-600 { background-color: #dc2626 !important; }
    .bg-orange-50 { background-color: #fff7ed !important; }
    .bg-orange-100 { background-color: #ffedd5 !important; }
    .bg-orange-500 { background-color: #f97316 !important; }
    .bg-green-50 { background-color: #f0fdf4 !important; }
    .bg-green-100 { background-color: #dcfce7 !important; }
    .bg-green-500 { background-color: #22c55e !important; }
    .bg-blue-50 { background-color: #eff6ff !important; }
    .bg-blue-100 { background-color: #dbeafe !important; }
    .bg-blue-500 { background-color: #3b82f6 !important; }
    .bg-blue-600 { background-color: #2563eb !important; }
    .text-white { color: #ffffff !important; }
    .text-gray-400 { color: #9ca3af !important; }
    .text-gray-500 { color: #6b7280 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-gray-700 { color: #374151 !important; }
    .text-gray-800 { color: #1f2937 !important; }
    .text-gray-900 { color: #111827 !important; }
    .text-red-500 { color: #ef4444 !important; }
    .text-red-600 { color: #dc2626 !important; }
    .text-red-700 { color: #b91c1c !important; }
    .text-orange-500 { color: #f97316 !important; }
    .text-orange-600 { color: #ea580c !important; }
    .text-green-500 { color: #22c55e !important; }
    .text-green-600 { color: #16a34a !important; }
    .text-blue-500 { color: #3b82f6 !important; }
    .text-blue-600 { color: #2563eb !important; }
    /* Borders */
    .border { border-width: 1px !important; border-style: solid !important; }
    .border-gray-200 { border-color: #e5e7eb !important; }
    .border-gray-300 { border-color: #d1d5db !important; }
    .border-red-500 { border-color: #ef4444 !important; }
    .rounded { border-radius: 0.25rem !important; }
    .rounded-md { border-radius: 0.375rem !important; }
    .rounded-lg { border-radius: 0.5rem !important; }
    .rounded-xl { border-radius: 0.75rem !important; }
    .rounded-full { border-radius: 9999px !important; }
    /* Shadows */
    .shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important; }
    .shadow-md { box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important; }
    .shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.1) !important; }
    /* Display */
    .hidden { display: none !important; }
    .block { display: block !important; }
    .inline { display: inline !important; }
    .inline-block { display: inline-block !important; }
    /* Overflow */
    .overflow-hidden { overflow: hidden !important; }
    /* Position */
    .relative { position: relative !important; }
    .absolute { position: absolute !important; }
    /* App-specific styles */
    .container { max-width: 56rem; margin: 0 auto; padding: 1rem; }
    header { background-color: #0059b0; color: white; padding: 0.75rem 1rem; }
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
    }
    /* Risk indicators */
    [class*="risk-high"], [class*="HIGH RISK"] {
      background-color: #ef4444 !important;
      color: white !important;
    }
    [class*="risk-medium"], [class*="MEDIUM RISK"] {
      background-color: #f97316 !important;
      color: white !important;
    }
    [class*="risk-low"], [class*="LOW RISK"] {
      background-color: #22c55e !important;
      color: white !important;
    }
    /* Ring charts - ensure they're visible */
    svg { display: block; }
    circle { stroke-linecap: round; }
  `;
  document.head.appendChild(style);
  return style;
}

/**
 * Remove temporary oklch fallback styles
 */
function removeOklchFallbackStyles() {
  const style = document.getElementById("screenshot-oklch-fallback");
  if (style) {
    style.remove();
  }
}

/**
 * Replace oklch/oklab colors with RGB fallbacks in CSS text
 * Handles nested parentheses and color-mix() functions
 * @param {string} cssText - CSS text to process
 * @returns {string} Processed CSS with oklch/oklab replaced
 */
function replaceOklchInCSS(cssText) {
  let result = cssText;

  // First, replace color-mix() functions that use oklab/oklch color spaces
  // Pattern: color-mix(in oklab, ...) or color-mix(in oklch, ...)
  // These have nested parentheses so we need to handle them specially
  result = result.replace(/color-mix\s*\(\s*in\s+okl(?:ab|ch)[^;{}]*(?:;|(?=\}))/gi, (match) => {
    // Replace with a simple gray fallback
    return match.replace(/color-mix\s*\([^)]*\)/gi, "#6b7280");
  });

  // Replace any remaining color-mix with oklab/oklch by finding balanced parentheses
  result = replaceNestedFunction(result, "color-mix", "#6b7280");

  // Replace oklch() function - handle nested parentheses for var() etc.
  result = replaceNestedFunction(result, "oklch", "#6b7280");

  // Replace oklab() function - handle nested parentheses
  result = replaceNestedFunction(result, "oklab", "#6b7280");

  // Final safety: replace any remaining literal "oklab" or "oklch" strings
  // that might be in color space declarations
  result = result.replace(/\bin\s+oklab\b/gi, "in srgb");
  result = result.replace(/\bin\s+oklch\b/gi, "in srgb");

  return result;
}

/**
 * Replace a CSS function with nested parentheses
 * @param {string} css - CSS text
 * @param {string} funcName - Function name to replace (e.g., "oklch", "oklab", "color-mix")
 * @param {string} replacement - Replacement value
 * @returns {string} Processed CSS
 */
function replaceNestedFunction(css, funcName, replacement) {
  const regex = new RegExp(funcName + "\\s*\\(", "gi");
  let result = "";
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(css)) !== null) {
    // Add text before this match
    result += css.slice(lastIndex, match.index);

    // Find the matching closing parenthesis
    let depth = 1;
    let i = match.index + match[0].length;

    while (i < css.length && depth > 0) {
      if (css[i] === "(") depth++;
      else if (css[i] === ")") depth--;
      i++;
    }

    // Replace the entire function call with the replacement
    result += replacement;
    lastIndex = i;
    regex.lastIndex = i;
  }

  // Add remaining text
  result += css.slice(lastIndex);
  return result;
}

/**
 * Replace oklch colors with RGB fallbacks in an element's inline styles
 * @param {HTMLElement} element - Element to process
 */
function replaceOklchInElement(element) {
  const style = element.getAttribute("style");
  if (style && style.includes("oklch")) {
    const newStyle = replaceOklchInCSS(style);
    element.setAttribute("style", newStyle);
  }
}

/**
 * Process cloned document to replace oklch/oklab colors for html2canvas
 * Replaces colors in stylesheets instead of removing them to preserve all styling
 * @param {Document} clonedDoc - Cloned document from html2canvas
 */
function processClonedDocument(clonedDoc) {
  console.log("[Screenshot] Processing cloned document for html2canvas...");

  // Process inline style elements - replace oklch/oklab with RGB
  const styleElements = clonedDoc.querySelectorAll("style");
  let processedStyleCount = 0;
  styleElements.forEach((style) => {
    if (style.textContent && (style.textContent.includes("oklch") || style.textContent.includes("oklab"))) {
      style.textContent = replaceOklchInCSS(style.textContent);
      processedStyleCount++;
    }
  });
  console.log(`[Screenshot] Processed ${processedStyleCount} style elements with oklch/oklab`);

  // For linked stylesheets, we need to disable and recreate with processed CSS
  const linkElements = clonedDoc.querySelectorAll("link[rel=\"stylesheet\"]");
  linkElements.forEach((link) => {
    try {
      const sheet = link.sheet;
      if (sheet && sheet.cssRules) {
        let cssText = "";
        for (let i = 0; i < sheet.cssRules.length; i++) {
          cssText += sheet.cssRules[i].cssText + "\n";
        }

        if (cssText.includes("oklch") || cssText.includes("oklab")) {
          // Create a new style element with processed CSS
          const processedStyle = clonedDoc.createElement("style");
          processedStyle.id = "screenshot-processed-" + Math.random().toString(36).substring(2, 11);
          processedStyle.textContent = replaceOklchInCSS(cssText);
          clonedDoc.head.appendChild(processedStyle);

          // Remove the original link
          link.remove();
          console.log("[Screenshot] Replaced linked stylesheet with processed version");
        }
      }
    } catch (e) {
      // CORS might prevent accessing external stylesheets
      console.log("[Screenshot] Could not process linked stylesheet (CORS):", e.message);
    }
  });

  // Add comprehensive Tailwind fallback styles to the cloned document
  // This ensures all utility classes work even if stylesheets couldn't be processed
  const fallbackStyle = clonedDoc.createElement("style");
  fallbackStyle.id = "screenshot-tailwind-fallback";
  fallbackStyle.textContent = `
    /* Comprehensive Tailwind fallback styles for screenshot */
    *, *::before, *::after { box-sizing: border-box; }
    body, html {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f3f4f6;
      color: #111827;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    /* Flexbox utilities */
    .flex { display: flex !important; }
    .inline-flex { display: inline-flex !important; }
    .flex-col { flex-direction: column !important; }
    .flex-row { flex-direction: row !important; }
    .flex-wrap { flex-wrap: wrap !important; }
    .items-center { align-items: center !important; }
    .items-start { align-items: flex-start !important; }
    .items-stretch { align-items: stretch !important; }
    .justify-center { justify-content: center !important; }
    .justify-between { justify-content: space-between !important; }
    .justify-start { justify-content: flex-start !important; }
    .gap-1 { gap: 0.25rem !important; }
    .gap-2 { gap: 0.5rem !important; }
    .gap-3 { gap: 0.75rem !important; }
    .gap-4 { gap: 1rem !important; }
    .gap-5 { gap: 1.25rem !important; }
    .gap-6 { gap: 1.5rem !important; }
    /* Grid */
    .grid { display: grid !important; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
    /* Spacing */
    .p-2 { padding: 0.5rem !important; }
    .p-3 { padding: 0.75rem !important; }
    .p-4 { padding: 1rem !important; }
    .p-5 { padding: 1.25rem !important; }
    .p-6 { padding: 1.5rem !important; }
    .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
    .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
    .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
    .px-5 { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
    .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
    .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
    .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
    .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
    .py-8 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
    .m-0 { margin: 0 !important; }
    .mb-2 { margin-bottom: 0.5rem !important; }
    .mb-3 { margin-bottom: 0.75rem !important; }
    .mb-4 { margin-bottom: 1rem !important; }
    .mb-6 { margin-bottom: 1.5rem !important; }
    .mb-8 { margin-bottom: 2rem !important; }
    .mt-2 { margin-top: 0.5rem !important; }
    .mt-3 { margin-top: 0.75rem !important; }
    .mt-4 { margin-top: 1rem !important; }
    .mt-6 { margin-top: 1.5rem !important; }
    .my-2 { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
    .my-3 { margin-top: 0.75rem !important; margin-bottom: 0.75rem !important; }
    .my-5 { margin-top: 1.25rem !important; margin-bottom: 1.25rem !important; }
    .my-6 { margin-top: 1.5rem !important; margin-bottom: 1.5rem !important; }
    .mx-auto { margin-left: auto !important; margin-right: auto !important; }
    .mx-2 { margin-left: 0.5rem !important; margin-right: 0.5rem !important; }
    .ml-2 { margin-left: 0.5rem !important; }
    .space-y-2 > * + * { margin-top: 0.5rem !important; }
    .space-y-3 > * + * { margin-top: 0.75rem !important; }
    .space-y-4 > * + * { margin-top: 1rem !important; }
    /* Width/Height */
    .w-full { width: 100% !important; }
    .w-28 { width: 7rem !important; }
    .h-28 { height: 7rem !important; }
    .max-w-4xl { max-width: 56rem !important; }
    .max-w-5xl { max-width: 64rem !important; }
    .min-h-screen { min-height: 100vh !important; }
    /* Text */
    .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
    .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
    .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
    .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
    .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
    .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
    .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
    .font-medium { font-weight: 500 !important; }
    .font-semibold { font-weight: 600 !important; }
    .font-bold { font-weight: 700 !important; }
    .font-extrabold { font-weight: 800 !important; }
    .text-center { text-align: center !important; }
    .uppercase { text-transform: uppercase !important; }
    .tracking-wide { letter-spacing: 0.025em !important; }
    .leading-snug { line-height: 1.375 !important; }
    .leading-relaxed { line-height: 1.625 !important; }
    /* Colors - Background */
    .bg-white { background-color: #ffffff !important; }
    .bg-gray-50 { background-color: #f9fafb !important; }
    .bg-gray-100 { background-color: #f3f4f6 !important; }
    .bg-gray-200 { background-color: #e5e7eb !important; }
    .bg-gray-700 { background-color: #374151 !important; }
    .bg-gray-800 { background-color: #1f2937 !important; }
    .bg-gray-900 { background-color: #111827 !important; }
    .bg-red-50 { background-color: #fef2f2 !important; }
    .bg-red-100 { background-color: #fee2e2 !important; }
    .bg-red-500 { background-color: #ef4444 !important; }
    .bg-red-600 { background-color: #dc2626 !important; }
    .bg-orange-50 { background-color: #fff7ed !important; }
    .bg-orange-100 { background-color: #ffedd5 !important; }
    .bg-orange-500 { background-color: #f97316 !important; }
    .bg-green-50 { background-color: #f0fdf4 !important; }
    .bg-green-100 { background-color: #dcfce7 !important; }
    .bg-green-500 { background-color: #22c55e !important; }
    .bg-green-600 { background-color: #16a34a !important; }
    .bg-blue-50 { background-color: #eff6ff !important; }
    .bg-blue-100 { background-color: #dbeafe !important; }
    .bg-blue-500 { background-color: #3b82f6 !important; }
    .bg-blue-600 { background-color: #2563eb !important; }
    .bg-yellow-50 { background-color: #fefce8 !important; }
    .bg-yellow-100 { background-color: #fef9c3 !important; }
    /* Gradient backgrounds */
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)) !important; }
    .from-gray-50 { --tw-gradient-from: #f9fafb !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
    .from-gray-100 { --tw-gradient-from: #f3f4f6 !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
    .from-green-50 { --tw-gradient-from: #f0fdf4 !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
    .from-blue-50 { --tw-gradient-from: #eff6ff !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
    .from-red-50 { --tw-gradient-from: #fef2f2 !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
    .to-white { --tw-gradient-to: #ffffff !important; }
    .to-gray-100 { --tw-gradient-to: #f3f4f6 !important; }
    /* Colors - Text */
    .text-white { color: #ffffff !important; }
    .text-gray-400 { color: #9ca3af !important; }
    .text-gray-500 { color: #6b7280 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-gray-700 { color: #374151 !important; }
    .text-gray-800 { color: #1f2937 !important; }
    .text-gray-900 { color: #111827 !important; }
    .text-red-400 { color: #f87171 !important; }
    .text-red-500 { color: #ef4444 !important; }
    .text-red-600 { color: #dc2626 !important; }
    .text-red-700 { color: #b91c1c !important; }
    .text-orange-500 { color: #f97316 !important; }
    .text-orange-600 { color: #ea580c !important; }
    .text-orange-700 { color: #c2410c !important; }
    .text-yellow-500 { color: #eab308 !important; }
    .text-yellow-700 { color: #a16207 !important; }
    .text-yellow-800 { color: #854d0e !important; }
    .text-green-400 { color: #4ade80 !important; }
    .text-green-500 { color: #22c55e !important; }
    .text-green-600 { color: #16a34a !important; }
    .text-green-700 { color: #15803d !important; }
    .text-green-800 { color: #166534 !important; }
    .text-blue-400 { color: #60a5fa !important; }
    .text-blue-500 { color: #3b82f6 !important; }
    .text-blue-600 { color: #2563eb !important; }
    .text-blue-700 { color: #1d4ed8 !important; }
    /* Borders */
    .border { border-width: 1px !important; border-style: solid !important; }
    .border-b { border-bottom-width: 1px !important; border-bottom-style: solid !important; }
    .border-l-4 { border-left-width: 4px !important; border-left-style: solid !important; }
    .border-gray-100 { border-color: #f3f4f6 !important; }
    .border-gray-200 { border-color: #e5e7eb !important; }
    .border-gray-300 { border-color: #d1d5db !important; }
    .border-gray-700 { border-color: #374151 !important; }
    .border-green-100 { border-color: #dcfce7 !important; }
    .border-green-200 { border-color: #bbf7d0 !important; }
    .border-green-300 { border-color: #86efac !important; }
    .border-green-600 { border-color: #16a34a !important; }
    .border-green-800 { border-color: #166534 !important; }
    .border-blue-100 { border-color: #dbeafe !important; }
    .border-blue-200 { border-color: #bfdbfe !important; }
    .border-blue-300 { border-color: #93c5fd !important; }
    .border-blue-600 { border-color: #2563eb !important; }
    .border-blue-800 { border-color: #1e40af !important; }
    .border-red-200 { border-color: #fecaca !important; }
    .border-red-500 { border-color: #ef4444 !important; }
    .border-red-800 { border-color: #991b1b !important; }
    .border-yellow-300 { border-color: #fde047 !important; }
    .border-yellow-400 { border-color: #facc15 !important; }
    .border-yellow-700 { border-color: #a16207 !important; }
    .rounded { border-radius: 0.25rem !important; }
    .rounded-md { border-radius: 0.375rem !important; }
    .rounded-lg { border-radius: 0.5rem !important; }
    .rounded-xl { border-radius: 0.75rem !important; }
    .rounded-2xl { border-radius: 1rem !important; }
    .rounded-full { border-radius: 9999px !important; }
    /* Shadows */
    .shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important; }
    .shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important; }
    .shadow-md { box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important; }
    .shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.1) !important; }
    .shadow-xl { box-shadow: 0 20px 25px rgba(0,0,0,0.1) !important; }
    /* Display */
    .hidden { display: none !important; }
    .block { display: block !important; }
    .inline { display: inline !important; }
    .inline-block { display: inline-block !important; }
    /* Overflow */
    .overflow-hidden { overflow: hidden !important; }
    /* Position */
    .relative { position: relative !important; }
    .absolute { position: absolute !important; }
    .top-0 { top: 0 !important; }
    .left-0 { left: 0 !important; }
    /* List styles */
    .list-disc { list-style-type: disc !important; }
    .list-inside { list-style-position: inside !important; }
    /* Divide */
    .divide-y > * + * { border-top-width: 1px !important; border-top-style: solid !important; }
    .divide-gray-200 > * + * { border-color: #e5e7eb !important; }
    .divide-gray-700 > * + * { border-color: #374151 !important; }
    /* Opacity */
    .opacity-80 { opacity: 0.8 !important; }
    /* Transitions */
    .transition { transition-property: all !important; transition-duration: 150ms !important; }
    .transition-all { transition-property: all !important; transition-duration: 300ms !important; }
    .duration-200 { transition-duration: 200ms !important; }
    .duration-300 { transition-duration: 300ms !important; }
    /* Container */
    .container { width: 100%; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
    /* SVG */
    svg { display: block; }
    circle { stroke-linecap: round; }
    .fill-white { fill: #ffffff !important; }
    /* Specific component styles for the app */
    .enhanced-risk-card { background: #ffffff; border-radius: 1rem; padding: 1.25rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .probability-circle { width: 7rem; height: 7rem; }
    .probability-svg { width: 100%; height: 100%; }
    .tachometer-section { display: flex; margin-top: 1.5rem; width: 100%; }
    .tachometer-card { width: 100%; padding: 1.5rem; border-radius: 1rem; border: 1px solid #e5e7eb; background: rgba(255,255,255,0.8); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .metric-card { padding: 1rem; border-radius: 0.75rem; border: 1px solid #e5e7eb; text-align: center; }
    .drivers-column { border-radius: 1rem; border: 1px solid; padding: 0; }
    .positive-column { background: linear-gradient(to bottom right, #f0fdf4, #ffffff); border-color: #bbf7d0; }
    .negative-column { background: linear-gradient(to bottom right, #eff6ff, #ffffff); border-color: #bfdbfe; }
    .compact-driver-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid; }
    .alternative-diagnosis-card { background: #ffffff; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 1.5rem; }
    /* Collapsible sections */
    .collapsible-content { display: block !important; }
    .collapsible-content.hidden { display: block !important; }
  `;
  clonedDoc.head.appendChild(fallbackStyle);
  console.log("[Screenshot] Added comprehensive Tailwind fallback styles to cloned document");

  // Add CSS custom property overrides for any remaining oklch references
  const overrideStyle = clonedDoc.createElement("style");
  overrideStyle.id = "screenshot-color-override";
  overrideStyle.textContent = `
    :root, *, *::before, *::after {
      /* Tailwind v4 color overrides - RGB instead of oklch */
      --color-red-50: #fef2f2 !important;
      --color-red-100: #fee2e2 !important;
      --color-red-200: #fecaca !important;
      --color-red-300: #fca5a5 !important;
      --color-red-400: #f87171 !important;
      --color-red-500: #ef4444 !important;
      --color-red-600: #dc2626 !important;
      --color-red-700: #b91c1c !important;
      --color-red-800: #991b1b !important;
      --color-red-900: #7f1d1d !important;
      --color-orange-50: #fff7ed !important;
      --color-orange-100: #ffedd5 !important;
      --color-orange-500: #f97316 !important;
      --color-orange-600: #ea580c !important;
      --color-yellow-50: #fefce8 !important;
      --color-yellow-100: #fef9c3 !important;
      --color-yellow-400: #facc15 !important;
      --color-yellow-500: #eab308 !important;
      --color-green-50: #f0fdf4 !important;
      --color-green-100: #dcfce7 !important;
      --color-green-500: #22c55e !important;
      --color-green-600: #16a34a !important;
      --color-blue-50: #eff6ff !important;
      --color-blue-100: #dbeafe !important;
      --color-blue-500: #3b82f6 !important;
      --color-blue-600: #2563eb !important;
      --color-gray-50: #f9fafb !important;
      --color-gray-100: #f3f4f6 !important;
      --color-gray-200: #e5e7eb !important;
      --color-gray-300: #d1d5db !important;
      --color-gray-400: #9ca3af !important;
      --color-gray-500: #6b7280 !important;
      --color-gray-600: #4b5563 !important;
      --color-gray-700: #374151 !important;
      --color-gray-800: #1f2937 !important;
      --color-gray-900: #111827 !important;
      --color-white: #ffffff !important;
      --color-black: #000000 !important;
    }
  `;
  clonedDoc.head.insertBefore(overrideStyle, clonedDoc.head.firstChild);

  // Process all elements to replace any remaining oklch in inline styles
  const allElements = clonedDoc.querySelectorAll("*");
  allElements.forEach(replaceOklchInElement);

  console.log("[Screenshot] Cloned document processing complete");
}

/**
 * Replace oklch/oklab colors in stylesheets with RGB equivalents
 * Returns a function to restore original stylesheets
 *
 * CRITICAL: html2canvas parses CSS BEFORE the onclone callback runs,
 * so we MUST disable/replace all stylesheets in the main document first.
 */
function replaceProblematicColors() {
  const modifiedSheets = [];
  const disabledLinks = [];

  console.log("[Screenshot] Replacing problematic colors in main document...");

  // Process style elements - replace oklch/oklab with RGB
  const styleElements = document.querySelectorAll("style");
  let processedCount = 0;
  styleElements.forEach((style) => {
    if (
      style.textContent &&
      (style.textContent.includes("oklch") || style.textContent.includes("oklab"))
    ) {
      const original = style.textContent;
      const processed = replaceOklchInCSS(original);
      style.textContent = processed;
      modifiedSheets.push({ element: style, original });
      processedCount++;
    }
  });
  console.log(`[Screenshot] Processed ${processedCount} style elements`);

  // CRITICAL: Disable ALL linked stylesheets unconditionally
  // html2canvas will fail if it encounters oklab/oklch color functions
  // Tailwind v4 uses these extensively, so we must disable all stylesheets
  // and rely on our comprehensive fallback styles
  const linkElements = document.querySelectorAll("link[rel=\"stylesheet\"]");
  const processedLinks = [];

  linkElements.forEach((link) => {
    let cssText = "";
    let canAccessRules = false;

    // Try to access the stylesheet rules BEFORE disabling
    try {
      const sheet = link.sheet;
      if (sheet && sheet.cssRules) {
        for (let i = 0; i < sheet.cssRules.length; i++) {
          cssText += sheet.cssRules[i].cssText + "\n";
        }
        canAccessRules = true;
      }
    } catch (e) {
      // CORS prevents accessing cssRules
      console.log("[Screenshot] CORS blocked stylesheet access:", e.message);
    }

    // Now disable the stylesheet
    link.disabled = true;
    console.log("[Screenshot] Disabled stylesheet:", link.href || "inline");

    if (canAccessRules && cssText) {
      // Create a new style element with processed CSS (oklab/oklch replaced)
      const processedStyle = document.createElement("style");
      processedStyle.id = "screenshot-processed-" + Math.random().toString(36).substring(2, 11);
      processedStyle.textContent = replaceOklchInCSS(cssText);
      document.head.appendChild(processedStyle);

      processedLinks.push({
        originalLink: link,
        processedStyle: processedStyle,
      });
      console.log("[Screenshot] Created processed replacement stylesheet");
    } else {
      // Couldn't access rules, just keep it disabled and rely on fallback styles
      disabledLinks.push(link);
    }
  });

  console.log(`[Screenshot] Disabled ${disabledLinks.length} stylesheets, processed ${processedLinks.length}`);

  // Return restore function
  return () => {
    // Restore original style elements
    modifiedSheets.forEach(({ element, original }) => {
      element.textContent = original;
    });

    // Remove processed styles and re-enable original links
    processedLinks.forEach(({ originalLink, processedStyle }) => {
      originalLink.disabled = false;
      processedStyle.remove();
    });

    // Re-enable any stylesheets we disabled due to CORS
    disabledLinks.forEach((link) => {
      link.disabled = false;
    });

    console.log("[Screenshot] Restored all stylesheets");
  };
}

/**
 * Capture the results screen as a full-page screenshot
 * @returns {Promise<{blob: Blob, dataUrl: string}>} Screenshot data
 */
export async function captureResultsScreenshot() {
  // Try multiple selectors to find the results container
  const resultsContainer =
    document.getElementById("appContainer") ||
    document.querySelector(".container") ||
    document.querySelector("main");

  if (!resultsContainer) {
    throw new Error("Results container not found");
  }

  console.log("[Screenshot] Found container:", resultsContainer.className || resultsContainer.id);

  // Store original scroll position
  const originalScrollTop = window.scrollY;

  // Add fallback styles for oklch colors (html2canvas doesn't support oklch)
  // eslint-disable-next-line no-unused-vars
  const fallbackStyle = addOklchFallbackStyles();

  // CRITICAL: Replace oklch/oklab colors with RGB BEFORE html2canvas parses them
  // This preserves all styling while making colors compatible
  const restoreStylesheets = replaceProblematicColors();

  // Expand all sections for full capture
  expandAllSections();

  // Wait for DOM updates and any animations
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // Capture the full results container
    const canvas = await html2canvas(resultsContainer, {
      scale: 6, // Very high resolution for crisp screenshots on all devices
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: resultsContainer.scrollWidth,
      windowHeight: resultsContainer.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      // Capture full height
      height: resultsContainer.scrollHeight,
      width: resultsContainer.scrollWidth,
      // Process cloned document to add fallback styles
      onclone: (clonedDoc) => {
        processClonedDocument(clonedDoc);
      },
      // Ignore elements that might cause issues
      ignoreElements: (element) => {
        return element.tagName === "IFRAME" || element.classList?.contains("mapboxgl-map");
      },
    });

    // Convert to blob and data URL
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, "image/jpeg", 0.95);
    });

    return { blob, dataUrl, canvas };
  } finally {
    // Restore original state
    restoreStylesheets(); // Re-enable the disabled stylesheets
    removeOklchFallbackStyles();
    collapseAllSections();
    window.scrollTo(0, originalScrollTop);
  }
}

/**
 * Save screenshot to device (triggers download)
 * @param {Blob} blob - Screenshot blob
 * @param {string} filename - Optional filename
 */
export function downloadScreenshot(blob, filename) {
  const defaultFilename = `iGFAP-Results-${getTimestamp()}.jpg`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Share screenshot using Web Share API (native mobile sharing)
 * Falls back to download if Web Share API is not available
 * @param {Blob} blob - Screenshot blob
 * @returns {Promise<boolean>} True if shared successfully
 */
export async function shareScreenshot(blob) {
  // iOS/Safari has limits on Web Share API:
  // 1. Images > ~2048px get auto-compressed
  // 2. Total share size has limits (~10MB)
  //
  // Solution: Scale down to reasonable size, split into max 3-4 parts
  const timestamp = getTimestamp();
  const MAX_PART_HEIGHT = 1800;
  const MAX_PARTS = 4;
  const TARGET_WIDTH = 1200; // Good quality for mobile viewing/sharing

  const files = [];
  try {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    const origWidth = img.naturalWidth;
    const origHeight = img.naturalHeight;
    console.log("[Screenshot] Original dimensions:", origWidth, "x", origHeight);

    // Scale down width to TARGET_WIDTH, maintain aspect ratio
    const scale = Math.min(1, TARGET_WIDTH / origWidth);
    const scaledWidth = Math.round(origWidth * scale);
    const scaledHeight = Math.round(origHeight * scale);
    console.log("[Screenshot] Scaled for sharing:", scaledWidth, "x", scaledHeight, `(${Math.round(scale * 100)}%)`);

    // Calculate parts needed (limit to MAX_PARTS)
    let numParts = Math.ceil(scaledHeight / MAX_PART_HEIGHT);
    if (numParts > MAX_PARTS) {
      numParts = MAX_PARTS;
    }
    const partHeight = Math.ceil(scaledHeight / numParts);
    console.log("[Screenshot] Splitting into", numParts, "parts, ~" + partHeight + "px each");

    for (let i = 0; i < numParts; i++) {
      const srcStartY = Math.round((i * partHeight) / scale);
      const srcPartHeight = Math.round(partHeight / scale);
      const destPartHeight = (i === numParts - 1)
        ? scaledHeight - (i * partHeight)  // Last part gets remainder
        : partHeight;

      const canvas = document.createElement("canvas");
      canvas.width = scaledWidth;
      canvas.height = destPartHeight;
      const ctx = canvas.getContext("2d");

      // High quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw scaled portion
      ctx.drawImage(
        img,
        0, srcStartY, origWidth, srcPartHeight,  // Source rectangle
        0, 0, scaledWidth, destPartHeight         // Destination rectangle
      );

      // Use JPEG for smaller file size (good quality)
      const partBlob = await new Promise(resolve => {
        canvas.toBlob(resolve, "image/jpeg", 0.92);
      });

      const partNum = numParts > 1 ? `_Teil${i + 1}von${numParts}` : "";
      const filename = `iGFAP-Results-${timestamp}${partNum}.jpg`;
      const file = new File([partBlob], filename, { type: "image/jpeg" });
      files.push(file);

      console.log(`[Screenshot] Part ${i + 1}/${numParts}: ${scaledWidth}x${destPartHeight}, ${Math.round(file.size/1024)}KB`);
    }

    URL.revokeObjectURL(url);

    // Log total size
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    console.log("[Screenshot] Total share size:", Math.round(totalSize/1024), "KB");

  } catch (e) {
    console.warn("[Screenshot] Processing failed, using original:", e);
    const file = new File([blob], `iGFAP-Results-${timestamp}.jpg`, { type: "image/jpeg" });
    files.push(file);
  }

  console.log("[Screenshot] Sharing", files.length, "file(s)");

  // Check if Web Share API is available and supports files
  if (navigator.canShare && navigator.canShare({ files })) {
    try {
      await navigator.share({
        files,
        title: "iGFAP Ergebnisse",
        text: files.length > 1
          ? `Stroke Triage Analyse (${files.length} Bilder)`
          : "Stroke Triage Analyse",
      });
      return true;
    } catch (error) {
      if (error.name === "AbortError") {
        // User cancelled - not an error
        return false;
      }
      console.warn("Web Share failed, falling back to download:", error);
    }
  }

  // Fallback to download
  downloadScreenshot(blob);
  return true;
}

/**
 * Show toast notification with share option
 * Designed to be conspicuous for Rettungssanitäter
 * @param {Blob} blob - Screenshot blob for sharing
 */
export function showScreenshotToast(blob) {
  console.log("[Screenshot] showScreenshotToast called, blob size:", blob?.size);

  // Remove any existing toast
  const existingToast = document.getElementById("screenshot-toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Remove any existing screenshot toast styles
  const existingStyle = document.getElementById("screenshot-toast-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Add styles first - large, conspicuous design for emergency use
  const style = document.createElement("style");
  style.id = "screenshot-toast-styles";
  style.textContent = `
    #screenshot-toast {
      position: fixed !important;
      bottom: 100px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 999999 !important;
      animation: screenshotSlideUp 0.4s ease-out, screenshotPulse 2s ease-in-out 0.5s infinite !important;
    }

    @keyframes screenshotSlideUp {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(40px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
      }
    }

    @keyframes screenshotPulse {
      0%, 100% {
        box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4), 0 0 0 0 rgba(34, 197, 94, 0.4);
      }
      50% {
        box-shadow: 0 8px 32px rgba(34, 197, 94, 0.6), 0 0 0 8px rgba(34, 197, 94, 0);
      }
    }

    #screenshot-toast .toast-content {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 12px !important;
      background: linear-gradient(135deg, #166534 0%, #15803d 50%, #22c55e 100%) !important;
      color: white !important;
      padding: 20px 28px !important;
      border-radius: 16px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.2) !important;
      font-family: system-ui, -apple-system, sans-serif !important;
      border: 3px solid rgba(255, 255, 255, 0.3) !important;
      min-width: 280px !important;
    }

    #screenshot-toast .toast-header {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      width: 100% !important;
      justify-content: center !important;
    }

    #screenshot-toast .toast-icon {
      font-size: 32px !important;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)) !important;
    }

    #screenshot-toast .toast-message {
      font-weight: 700 !important;
      font-size: 18px !important;
      color: white !important;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
    }

    #screenshot-toast .toast-submessage {
      font-weight: 400 !important;
      font-size: 13px !important;
      color: rgba(255,255,255,0.9) !important;
      text-align: center !important;
    }

    #screenshot-toast .toast-buttons {
      display: flex !important;
      gap: 10px !important;
      width: 100% !important;
      justify-content: center !important;
    }

    #screenshot-toast .toast-share-btn {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      background: white !important;
      border: none !important;
      color: #166534 !important;
      padding: 12px 24px !important;
      border-radius: 10px !important;
      cursor: pointer !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      transition: all 0.2s !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
      min-width: 140px !important;
    }

    #screenshot-toast .toast-share-btn:hover {
      background: #f0fdf4 !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 16px rgba(0,0,0,0.25) !important;
    }

    #screenshot-toast .toast-share-btn:active {
      transform: translateY(0) !important;
    }

    #screenshot-toast .toast-download-btn {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      background: rgba(255,255,255,0.2) !important;
      border: 2px solid rgba(255,255,255,0.4) !important;
      color: white !important;
      padding: 10px 16px !important;
      border-radius: 10px !important;
      cursor: pointer !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      transition: all 0.2s !important;
    }

    #screenshot-toast .toast-download-btn:hover {
      background: rgba(255,255,255,0.3) !important;
      border-color: rgba(255,255,255,0.6) !important;
    }

    #screenshot-toast .toast-close-btn {
      position: absolute !important;
      top: 8px !important;
      right: 8px !important;
      background: rgba(0,0,0,0.2) !important;
      border: none !important;
      color: white !important;
      font-size: 18px !important;
      cursor: pointer !important;
      padding: 4px 8px !important;
      border-radius: 6px !important;
      line-height: 1 !important;
      transition: background 0.2s !important;
    }

    #screenshot-toast .toast-close-btn:hover {
      background: rgba(0,0,0,0.3) !important;
    }

    @media (max-width: 480px) {
      #screenshot-toast {
        left: 16px !important;
        right: 16px !important;
        transform: none !important;
        bottom: 80px !important;
      }

      #screenshot-toast .toast-content {
        width: 100% !important;
        padding: 16px 20px !important;
      }

      #screenshot-toast .toast-buttons {
        flex-direction: column !important;
      }

      #screenshot-toast .toast-share-btn,
      #screenshot-toast .toast-download-btn {
        width: 100% !important;
      }
    }
  `;

  document.head.appendChild(style);

  // Create toast element with bilingual text
  // Note: Download button removed since we auto-download
  const toast = document.createElement("div");
  toast.id = "screenshot-toast";
  toast.innerHTML = `
    <div class="toast-content" style="position: relative;">
      <button class="toast-close-btn" id="toast-close-btn">×</button>
      <div class="toast-header">
        <span class="toast-icon">📸</span>
        <div>
          <div class="toast-message">Screenshot gespeichert!</div>
        </div>
      </div>
      <div class="toast-submessage">
        ✓ Automatisch gespeichert · Tap to share
      </div>
      <div class="toast-buttons">
        <button class="toast-share-btn" id="toast-share-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span>Teilen / Share</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(toast);
  console.log("[Screenshot] Toast added to DOM");

  // Event handlers
  const shareBtn = document.getElementById("toast-share-btn");
  const closeBtn = document.getElementById("toast-close-btn");

  shareBtn.addEventListener("click", async () => {
    shareBtn.disabled = true;
    shareBtn.innerHTML = "<span>Wird geteilt...</span>";
    await shareScreenshot(blob);
    shareBtn.innerHTML = "<span>✓ Geteilt!</span>";
    setTimeout(() => toast.remove(), 2000);
  });

  closeBtn.addEventListener("click", () => {
    toast.remove();
  });

  // Auto-hide after 5 minutes (300000ms) - long duration for emergency use
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.animation = "screenshotSlideUp 0.3s ease-out reverse";
      setTimeout(() => toast.remove(), 300);
    }
  }, 300000);
}

/**
 * Show loading overlay while screenshot is being captured
 * @returns {HTMLElement} The overlay element for later removal
 */
function showScreenshotLoading() {
  // Remove any existing loading overlay
  const existing = document.getElementById("screenshot-loading-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "screenshot-loading-overlay";
  overlay.innerHTML = `
    <style>
      #screenshot-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 999998;
        animation: screenshotLoadingFadeIn 0.3s ease-out;
      }

      @keyframes screenshotLoadingFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .screenshot-loading-content {
        background: white;
        border-radius: 16px;
        padding: 28px 36px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        text-align: center;
        max-width: 320px;
      }

      .screenshot-loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e5e7eb;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: screenshotSpin 1s linear infinite;
        margin: 0 auto 16px;
      }

      @keyframes screenshotSpin {
        to { transform: rotate(360deg); }
      }

      .screenshot-loading-icon {
        font-size: 32px;
        margin-bottom: 12px;
        animation: screenshotPulse 1.5s ease-in-out infinite;
      }

      @keyframes screenshotPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }

      .screenshot-loading-title {
        font-size: 18px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .screenshot-loading-subtitle {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.4;
      }

      .screenshot-loading-dots {
        display: inline-block;
      }

      .screenshot-loading-dots::after {
        content: '';
        animation: screenshotDots 1.5s steps(4, end) infinite;
      }

      @keyframes screenshotDots {
        0% { content: ''; }
        25% { content: '.'; }
        50% { content: '..'; }
        75% { content: '...'; }
        100% { content: ''; }
      }
    </style>
    <div class="screenshot-loading-content">
      <div class="screenshot-loading-icon">📸</div>
      <div class="screenshot-loading-spinner"></div>
      <div class="screenshot-loading-title">
        Screenshot wird erstellt<span class="screenshot-loading-dots"></span>
      </div>
      <div class="screenshot-loading-subtitle">
        Bitte warten Sie einen Moment<br/>
        <span style="font-size: 12px; color: #9ca3af;">Creating long screenshot...</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Hide loading overlay with fade out animation
 * @param {HTMLElement} overlay - The overlay element to remove
 */
function hideScreenshotLoading(overlay) {
  if (!overlay) return;

  overlay.style.animation = "screenshotLoadingFadeIn 0.2s ease-out reverse";
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.remove();
    }
  }, 200);
}

/**
 * Main function: Capture screenshot, auto-download, and show toast
 * Called automatically when results page loads
 * Auto-downloads to ensure Rettungsdienst always has a copy saved
 * @returns {Promise<void>}
 */
export async function captureAndShowToast() {
  // Show loading overlay while capturing
  const loadingOverlay = showScreenshotLoading();

  try {
    console.log("[Screenshot] Capturing results page...");
    const { blob } = await captureResultsScreenshot();

    // Hide loading overlay
    hideScreenshotLoading(loadingOverlay);

    // Auto-download immediately to ensure screenshot is saved
    console.log("[Screenshot] Auto-downloading screenshot...");
    downloadScreenshot(blob);

    // Show toast with Share option for quick sharing via WhatsApp/AirDrop
    console.log("[Screenshot] Showing toast with share option");
    showScreenshotToast(blob);
  } catch (error) {
    console.error("[Screenshot] Failed to capture:", error);
    // Hide loading overlay on error too
    hideScreenshotLoading(loadingOverlay);
    // Don't show error to user - screenshot is a convenience feature
  }
}

export default {
  captureResultsScreenshot,
  downloadScreenshot,
  shareScreenshot,
  showScreenshotToast,
  captureAndShowToast,
};
