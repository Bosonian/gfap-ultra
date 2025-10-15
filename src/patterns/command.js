/**
 * Command Pattern for Medical Actions and Audit Trail
 * iGFAP Stroke Triage Assistant - Enterprise Architecture
 *
 * Provides reversible medical actions with comprehensive audit logging
 */

import { medicalEventObserver, MEDICAL_EVENTS } from "./observer.js";

/**
 * Abstract base command for medical actions
 */
class MedicalCommand {
  constructor(name, description, metadata = {}) {
    this.name = name;
    this.description = description;
    this.metadata = {
      ...metadata,
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    this.executed = false;
    this.undone = false;
  }

  /**
   * Execute the medical command
   * @returns {Promise<any>} Command execution result
   */
  async execute() {
    if (this.executed && !this.undone) {
      throw new Error(`Command ${this.name} has already been executed`);
    }

    try {
      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "command_execute_start",
        command: this.name,
        commandId: this.metadata.id,
      });

      const result = await this.doExecute();

      this.executed = true;
      this.undone = false;

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "command_execute_success",
        command: this.name,
        commandId: this.metadata.id,
      });

      return result;
    } catch (error) {
      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "command_execute_error",
        command: this.name,
        commandId: this.metadata.id,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Undo the medical command
   * @returns {Promise<any>} Command undo result
   */
  async undo() {
    if (!this.executed || this.undone) {
      throw new Error(`Command ${this.name} cannot be undone`);
    }

    try {
      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "command_undo_start",
        command: this.name,
        commandId: this.metadata.id,
      });

      const result = await this.doUndo();

      this.undone = true;

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "command_undo_success",
        command: this.name,
        commandId: this.metadata.id,
      });

      return result;
    } catch (error) {
      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "command_undo_error",
        command: this.name,
        commandId: this.metadata.id,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Implement the actual command execution
   * Must be overridden by concrete commands
   */
  async doExecute() {
    throw new Error("doExecute() must be implemented by concrete command");
  }

  /**
   * Implement the actual command undo
   * Must be overridden by concrete commands
   */
  async doUndo() {
    throw new Error("doUndo() must be implemented by concrete command");
  }

  /**
   * Check if command can be undone
   */
  canUndo() {
    return this.executed && !this.undone;
  }

  /**
   * Get command summary for audit
   */
  getSummary() {
    return {
      name: this.name,
      description: this.description,
      id: this.metadata.id,
      timestamp: this.metadata.timestamp,
      executed: this.executed,
      undone: this.undone,
    };
  }
}

/**
 * Command for updating patient data
 */
class UpdatePatientDataCommand extends MedicalCommand {
  constructor(fieldName, newValue, previousValue, store) {
    super(
      "UPDATE_PATIENT_DATA",
      `Update ${fieldName} from ${previousValue} to ${newValue}`,
      { fieldName, newValue, previousValue },
    );
    this.fieldName = fieldName;
    this.newValue = newValue;
    this.previousValue = previousValue;
    this.store = store;
  }

  async doExecute() {
    // Update the patient data in store
    const currentData = this.store.getFormData("current") || {};
    currentData[this.fieldName] = this.newValue;
    this.store.setFormData("current", currentData);

    medicalEventObserver.publish(MEDICAL_EVENTS.PATIENT_DATA_UPDATED, {
      field: this.fieldName,
      newValue: this.newValue,
      previousValue: this.previousValue,
    });

    return { field: this.fieldName, value: this.newValue };
  }

  async doUndo() {
    // Restore the previous value
    const currentData = this.store.getFormData("current") || {};
    if (this.previousValue === null || this.previousValue === undefined) {
      delete currentData[this.fieldName];
    } else {
      currentData[this.fieldName] = this.previousValue;
    }
    this.store.setFormData("current", currentData);

    medicalEventObserver.publish(MEDICAL_EVENTS.PATIENT_DATA_UPDATED, {
      field: this.fieldName,
      newValue: this.previousValue,
      previousValue: this.newValue,
      action: "undo",
    });

    return { field: this.fieldName, value: this.previousValue };
  }
}

/**
 * Command for navigating between screens
 */
class NavigationCommand extends MedicalCommand {
  constructor(targetScreen, sourceScreen, store) {
    super(
      "NAVIGATE",
      `Navigate from ${sourceScreen} to ${targetScreen}`,
      { targetScreen, sourceScreen },
    );
    this.targetScreen = targetScreen;
    this.sourceScreen = sourceScreen;
    this.store = store;
  }

  async doExecute() {
    this.store.navigate(this.targetScreen);

    medicalEventObserver.publish(MEDICAL_EVENTS.NAVIGATION_CHANGED, {
      from: this.sourceScreen,
      to: this.targetScreen,
    });

    return { from: this.sourceScreen, to: this.targetScreen };
  }

  async doUndo() {
    this.store.navigate(this.sourceScreen);

    medicalEventObserver.publish(MEDICAL_EVENTS.NAVIGATION_CHANGED, {
      from: this.targetScreen,
      to: this.sourceScreen,
      action: "undo",
    });

    return { from: this.targetScreen, to: this.sourceScreen };
  }
}

/**
 * Command for form submission
 */
class SubmitFormCommand extends MedicalCommand {
  constructor(formData, moduleType, predictionStrategy) {
    super(
      "SUBMIT_FORM",
      `Submit ${moduleType} form for prediction`,
      { moduleType, formFields: Object.keys(formData) },
    );
    this.formData = { ...formData };
    this.moduleType = moduleType;
    this.predictionStrategy = predictionStrategy;
    this.results = null;
  }

  async doExecute() {
    // Set the prediction strategy
    this.predictionStrategy.setStrategy(this.getStrategyName());

    // Execute prediction
    this.results = await this.predictionStrategy.predict(this.formData);

    medicalEventObserver.publish(MEDICAL_EVENTS.FORM_SUBMITTED, {
      moduleType: this.moduleType,
      fieldsCount: Object.keys(this.formData).length,
      success: true,
    });

    return this.results;
  }

  async doUndo() {
    // Clear the results (cannot truly undo API call, but can clear local state)
    this.results = null;

    medicalEventObserver.publish(MEDICAL_EVENTS.FORM_SUBMITTED, {
      moduleType: this.moduleType,
      action: "undo",
    });

    return null;
  }

  getStrategyName() {
    switch (this.moduleType) {
    case "coma":
      return "COMA_ICH";
    case "limited":
      return "LIMITED_DATA_ICH";
    case "full":
      return "FULL_STROKE";
    default:
      throw new Error(`Unknown module type: ${this.moduleType}`);
    }
  }
}

/**
 * Command for clearing sensitive data
 */
class ClearDataCommand extends MedicalCommand {
  constructor(dataType, store) {
    super(
      "CLEAR_DATA",
      `Clear ${dataType} data for privacy compliance`,
      { dataType },
    );
    this.dataType = dataType;
    this.store = store;
    this.backupData = null;
  }

  async doExecute() {
    // Backup data before clearing
    this.backupData = this.store.getState();

    // Clear the specified data
    switch (this.dataType) {
    case "all":
      this.store.reset();
      break;
    case "forms":
      this.store.clearFormData();
      break;
    case "results":
      this.store.clearResults();
      break;
    default:
      throw new Error(`Unknown data type: ${this.dataType}`);
    }

    medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
      action: "data_cleared",
      dataType: this.dataType,
    });

    return { dataType: this.dataType, cleared: true };
  }

  async doUndo() {
    // Restore from backup (if within reasonable time limit)
    if (this.backupData) {
      this.store.setState(this.backupData);

      medicalEventObserver.publish(MEDICAL_EVENTS.AUDIT_EVENT, {
        action: "data_restored",
        dataType: this.dataType,
      });

      return { dataType: this.dataType, restored: true };
    }

    throw new Error("Cannot undo data clear: backup not available");
  }
}

/**
 * Command invoker for managing medical command execution
 */
export class MedicalCommandInvoker {
  constructor() {
    this.commandHistory = [];
    this.currentIndex = -1;
    this.maxHistorySize = 100;
  }

  /**
   * Execute a medical command
   * @param {MedicalCommand} command - Command to execute
   * @returns {Promise<any>} Command result
   */
  async executeCommand(command) {
    if (!(command instanceof MedicalCommand)) {
      throw new Error("Command must extend MedicalCommand");
    }

    const result = await command.execute();

    // Add to history (remove any commands after current index)
    this.commandHistory = this.commandHistory.slice(0, this.currentIndex + 1);
    this.commandHistory.push(command);
    this.currentIndex = this.commandHistory.length - 1;

    // Limit history size
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
      this.currentIndex -= 1;
    }

    return result;
  }

  /**
   * Undo the last command
   * @returns {Promise<any>} Undo result
   */
  async undo() {
    if (this.currentIndex < 0) {
      throw new Error("No commands to undo");
    }

    const command = this.commandHistory[this.currentIndex];
    if (!command.canUndo()) {
      throw new Error(`Command ${command.name} cannot be undone`);
    }

    const result = await command.undo();
    this.currentIndex -= 1;

    return result;
  }

  /**
   * Redo the next command
   * @returns {Promise<any>} Redo result
   */
  async redo() {
    if (this.currentIndex >= this.commandHistory.length - 1) {
      throw new Error("No commands to redo");
    }

    this.currentIndex += 1;
    const command = this.commandHistory[this.currentIndex];

    return await command.execute();
  }

  /**
   * Check if undo is possible
   */
  canUndo() {
    return this.currentIndex >= 0
           && this.commandHistory[this.currentIndex]
           && this.commandHistory[this.currentIndex].canUndo();
  }

  /**
   * Check if redo is possible
   */
  canRedo() {
    return this.currentIndex < this.commandHistory.length - 1;
  }

  /**
   * Get command history for audit
   */
  getCommandHistory() {
    return this.commandHistory.map((cmd) => cmd.getSummary());
  }

  /**
   * Clear command history (privacy compliance)
   */
  clearHistory() {
    this.commandHistory = [];
    this.currentIndex = -1;
  }

  /**
   * Get current command statistics
   */
  getStats() {
    return {
      totalCommands: this.commandHistory.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      executedCommands: this.currentIndex + 1,
    };
  }
}

// Export command classes and singleton invoker
export {
  MedicalCommand,
  UpdatePatientDataCommand,
  NavigationCommand,
  SubmitFormCommand,
  ClearDataCommand,
};

export const medicalCommandInvoker = new MedicalCommandInvoker();
