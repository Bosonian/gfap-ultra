/**
 * HTML Sanitization Utilities for XSS Prevention
 * iGFAP Stroke Triage Assistant - Enterprise Security
 *
 * Provides secure HTML sanitization to prevent XSS attacks
 *
 * @author iGFAP Project Team
 * @contact Deepak Bos <bosdeepak@gmail.com>
 */

/**
 * Allowed HTML tags for medical content
 */
const ALLOWED_TAGS = [
  "p",
  "div",
  "span",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "table",
  "tr",
  "td",
  "th",
  "thead",
  "tbody",
  "small",
  "sub",
  "sup",
  "button",
  "input",
  "form",
  "label",
  "select",
  "option",
  "textarea",
  "a",
  "img",
  "canvas",
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "g",
];

/**
 * Allowed attributes for HTML tags
 */
const ALLOWED_ATTRIBUTES = {
  div: [
    "class",
    "id",
    "style",
    "data-id",
    "data-action",
    "data-value",
    "data-module",
    "data-target",
  ],
  span: ["class", "id", "style", "data-id"],
  p: ["class", "style"],
  strong: ["class"],
  b: ["class"],
  em: ["class"],
  i: ["class"],
  table: ["class"],
  tr: ["class"],
  td: ["class", "colspan", "rowspan"],
  th: ["class", "colspan", "rowspan"],
  ul: ["class"],
  ol: ["class"],
  li: ["class"],
  h1: ["class"],
  h2: ["class"],
  h3: ["class"],
  h4: ["class"],
  h5: ["class"],
  h6: ["class"],
  small: ["class"],
  button: ["class", "id", "type", "data-action", "data-value", "data-target", "disabled"],
  input: [
    "class",
    "id",
    "type",
    "name",
    "value",
    "placeholder",
    "required",
    "data-module",
    "autocomplete",
    "readonly",
    "checked",
    "min",
    "max",
    "step",
    "aria-describedby",
  ],
  form: ["class", "id", "data-module", "action", "method"],
  label: ["class", "for"],
  select: ["class", "id", "name", "required"],
  option: ["value", "selected"],
  textarea: ["class", "id", "name", "placeholder", "required", "rows", "cols"],
  a: ["href", "target", "class", "id"],
  img: ["src", "alt", "class", "id", "width", "height"],
  canvas: ["class", "id", "width", "height"],
  svg: ["class", "id", "width", "height", "viewBox", "xmlns"],
  path: ["d", "fill", "stroke", "stroke-width", "class"],
  circle: ["cx", "cy", "r", "fill", "stroke", "stroke-width", "class"],
  rect: ["x", "y", "width", "height", "fill", "stroke", "stroke-width", "class"],
  line: ["x1", "y1", "x2", "y2", "stroke", "stroke-width", "class"],
  g: ["class", "transform"],
};

/**
 * Allowed CSS properties for style attributes
 */
const ALLOWED_STYLES = [
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "text-align",
  "margin",
  "padding",
  "border",
  "display",
  "visibility",
  "opacity",
];

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - Raw HTML content
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html, options = {}) {
  if (typeof html !== "string") {
    return "";
  }

  // Basic XSS pattern detection
  if (containsXSSPatterns(html)) {
    throw new Error("Potentially malicious content detected");
  }

  // Use browser's DOMParser for parsing
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Check for parsing errors
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Invalid HTML content");
  }

  // Sanitize the document
  sanitizeNode(doc.body, options);

  return doc.body.innerHTML;
}

/**
 * Check for common XSS patterns
 * @param {string} html - HTML content to check
 * @returns {boolean} - True if XSS patterns detected
 */
function containsXSSPatterns(html) {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b(?![^>]*src=["'][^"']*\/0925\/)/gi, // Allow our own iframes
    /<object\b/gi,
    /<embed\b/gi,
    /<meta\b/gi,
    /<link\b(?![^>]*rel=["']manifest)/gi, // Allow manifest links
  ];

  return xssPatterns.some(pattern => pattern.test(html));
}

/**
 * Recursively sanitize DOM nodes
 * @param {Node} node - DOM node to sanitize
 * @param {Object} options - Sanitization options
 */
function sanitizeNode(node, options) {
  const nodesToRemove = [];

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];

    if (child.nodeType === Node.ELEMENT_NODE) {
      const tagName = child.tagName.toLowerCase();

      // Remove disallowed tags
      if (!ALLOWED_TAGS.includes(tagName)) {
        nodesToRemove.push(child);
        continue;
      }

      // Sanitize attributes
      sanitizeAttributes(child);

      // Recursively sanitize children
      sanitizeNode(child, options);
    } else if (child.nodeType === Node.TEXT_NODE) {
      // Escape text content
      child.textContent = escapeTextContent(child.textContent);
    } else {
      // Remove other node types (comments, etc.)
      nodesToRemove.push(child);
    }
  }

  // Remove flagged nodes
  nodesToRemove.forEach(nodeToRemove => {
    node.removeChild(nodeToRemove);
  });
}

/**
 * Sanitize element attributes
 * @param {Element} element - Element to sanitize
 */
function sanitizeAttributes(element) {
  const tagName = element.tagName.toLowerCase();
  const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || [];
  const attrsToRemove = [];

  // Check all attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    const attrName = attr.name.toLowerCase();

    // Allow any data-* attribute for component islands and UI hooks
    const isDataAttr = attrName.startsWith("data-");

    if (!allowedAttrs.includes(attrName) && !isDataAttr) {
      attrsToRemove.push(attrName);
    } else if (attrName === "style") {
      // Sanitize style attribute
      element.setAttribute("style", sanitizeStyleAttribute(attr.value));
    } else {
      // Escape attribute value
      element.setAttribute(attrName, escapeAttributeValue(attr.value));
    }
  }

  // Remove disallowed attributes
  attrsToRemove.forEach(attrName => {
    element.removeAttribute(attrName);
  });
}

/**
 * Sanitize CSS in style attributes
 * @param {string} styleValue - CSS style value
 * @returns {string} - Sanitized style value
 */
function sanitizeStyleAttribute(styleValue) {
  if (!styleValue) {
    return "";
  }

  const styles = styleValue.split(";");
  const sanitizedStyles = [];

  styles.forEach(style => {
    const [property, value] = style.split(":").map(s => s.trim());

    if (property && value && ALLOWED_STYLES.includes(property.toLowerCase())) {
      // Basic CSS injection prevention
      if (!value.includes("javascript:") && !value.includes("expression(")) {
        sanitizedStyles.push(`${property}: ${value}`);
      }
    }
  });

  return sanitizedStyles.join("; ");
}

/**
 * Escape text content to prevent XSS
 * @param {string} text - Text content
 * @returns {string} - Escaped text
 */
function escapeTextContent(text) {
  if (!text) {
    return "";
  }

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Escape attribute values
 * @param {string} value - Attribute value
 * @returns {string} - Escaped value
 */
function escapeAttributeValue(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Safe innerHTML replacement
 * @param {Element} element - Target element
 * @param {string} html - HTML content to set
 * @param {Object} options - Sanitization options
 */
export function safeSetInnerHTML(element, html, options = {}) {
  if (!element || typeof html !== "string") {
    return;
  }

  try {
    const sanitizedHTML = sanitizeHTML(html, options);
    element.innerHTML = sanitizedHTML;
  } catch (error) {
    console.log("errro while setting html");
    // Fallback to text content on sanitization error
    element.textContent = html.replace(/<[^>]*>/g, "");
    throw new Error(`HTML sanitization failed: ${error.message}`);
  }
}

/**
 * Create safe HTML string for medical content
 * @param {string} template - HTML template
 * @param {Object} data - Data to interpolate
 * @returns {string} - Safe HTML string
 */
export function createSafeHTML(template, data = {}) {
  if (typeof template !== "string") {
    return "";
  }

  // Basic template interpolation with escaping
  let html = template;

  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
    const value = data[key];

    if (typeof value === "string") {
      html = html.replace(placeholder, escapeTextContent(value));
    } else if (typeof value === "number") {
      html = html.replace(placeholder, value.toString());
    } else {
      html = html.replace(placeholder, "");
    }
  });

  return sanitizeHTML(html);
}

/**
 * Validate and sanitize medical report content
 * @param {string} content - Medical report content
 * @returns {string} - Sanitized content
 */
export function sanitizeMedicalContent(content) {
  const options = {
    allowMedicalTags: true,
    preserveFormatting: true,
  };

  return sanitizeHTML(content, options);
}
