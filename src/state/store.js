// State management for the Stroke Triage Assistant

class Store {
  constructor() {
    this.state = {
      currentScreen: 'triage1',
      results: null,
      sessionId: null,
      startTime: null,
      formData: {},
      validationErrors: {}
    };
    
    this.listeners = new Set();
    this.initialize();
  }
  
  initialize() {
    this.state.sessionId = this.generateSessionId();
    this.state.startTime = Date.now();
    console.log('Store initialized with session:', this.state.sessionId);
  }
  
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  // Notify all listeners of state changes
  notify() {
    this.listeners.forEach(listener => listener(this.state));
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
    console.log(`Navigating from ${this.state.currentScreen} to ${screen}`);
    this.setState({ currentScreen: screen });
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
      validationErrors: {}
    };
    this.setState(newState);
    console.log('Store reset with new session:', newState.sessionId);
  }
  
  // Log events for audit trail
  logEvent(eventName, data = {}) {
    const event = {
      timestamp: Date.now(),
      session: this.state.sessionId,
      event: eventName,
      data: data
    };
    console.log('Event:', event);
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