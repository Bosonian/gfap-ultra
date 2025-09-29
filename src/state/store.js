// State management for the Stroke Triage Assistant

class Store {
  constructor() {
    this.state = {
      currentScreen: 'login',
      results: null,
      sessionId: null,
      startTime: null,
      formData: {},
      validationErrors: {},
      screenHistory: [],
    };

    this.listeners = new Set();
    this.initialize();
  }

  initialize() {
    this.state.sessionId = this.generateSessionId();
    this.state.startTime = Date.now();
  }

  generateSessionId() {
    const timestamp = Date.now();
    try {
      // Use cryptographically secure random values when available
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const randomBytes = new Uint8Array(8);
        crypto.getRandomValues(randomBytes);
        const randomHex = Array.from(randomBytes)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        return `session_${timestamp}_${randomHex}`;
      }
    } catch {}
    // Fallback to Math.random when Web Crypto is unavailable
    const fallback = Math.random().toString(36).slice(2, 10);
    return `session_${timestamp}_${fallback}`;
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners of state changes
  notify() {
    console.log(`[Store] Notifying ${this.listeners.size} listeners of state change`);
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Get current state (read-only)
  getState() {
    return { ...this.state };
  }

  // Update state and notify listeners
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  // Navigate to a new screen
  navigate(screen) {
    console.log(`[Store] navigate called: ${this.state.currentScreen} -> ${screen}`);
    const history = [...this.state.screenHistory];

    // Add current screen to history if not already there
    if (this.state.currentScreen !== screen && !history.includes(this.state.currentScreen)) {
      history.push(this.state.currentScreen);
    }

    const newState = {
      currentScreen: screen,
      screenHistory: history,
    };

    console.log('[Store] Setting new navigation state:', newState);
    this.setState(newState);
    console.log('[Store] State after navigation:', this.state.currentScreen);
  }

  // Navigate back to previous screen
  goBack() {
    const history = [...this.state.screenHistory];

    if (history.length > 0) {
      const previousScreen = history.pop();

      this.setState({
        currentScreen: previousScreen,
        screenHistory: history,
      });
      return true;
    }

    return false;
  }

  // Navigate to home screen
  goHome() {
    this.setState({
      currentScreen: 'triage1',
      screenHistory: [],
    });
  }

  // Store form data for a specific module
  setFormData(module, data) {
    const formData = { ...this.state.formData };
    formData[module] = { ...data };
    this.setState({ formData });
  }

  // Get form data for a specific module
  getFormData(module) {
    return this.state.formData[module] || {};
  }

  // Store validation errors
  setValidationErrors(errors) {
    this.setState({ validationErrors: errors });
  }

  // Clear validation errors
  clearValidationErrors() {
    this.setState({ validationErrors: {} });
  }

  // Store prediction results
  setResults(results) {
    this.setState({ results });
  }

  // Check if there's unsaved data
  hasUnsavedData() {
    return Object.keys(this.state.formData).length > 0 && !this.state.results;
  }

  // Reset to initial state
  reset() {
    const newState = {
      currentScreen: 'triage1',
      results: null,
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      formData: {},
      validationErrors: {},
      screenHistory: [],
    };
    this.setState(newState);
  }

  // Log events for audit trail
  logEvent(eventName, data = {}) {
    const event = {
      timestamp: Date.now(),
      session: this.state.sessionId,
      event: eventName,
      data,
    };

    // In production, send to analytics service
    // this.sendToAnalytics(event);
  }

  // Calculate session duration
  getSessionDuration() {
    return Date.now() - this.state.startTime;
  }
}

// Create and export a singleton instance
export const store = new Store();

// Export the Store class for testing purposes
export { Store };
