/**
 * Normalize drivers from API responses into a unified format for visualization
 * @param {Object} drivers - Raw drivers data from API
 * @returns {Object} Normalized drivers view model
 */
export function normalizeDrivers(drivers) {
  if (!drivers || typeof drivers !== 'object') {
    return {
      kind: 'unavailable',
      units: null,
      positive: [],
      negative: [],
      meta: {},
    };
  }

  // Check if it's already in the expected format with kind property
  if (drivers.kind) {
    return drivers;
  }

  // Check if it's SHAP values format
  if (drivers.shap_values || (drivers.kind && drivers.kind === 'shap_values')) {
    return normalizeShapValues(drivers);
  }

  // Check if it's logistic contributions format
  if (drivers.logistic_contributions || (drivers.kind && drivers.kind === 'logistic_contributions')) {
    return normalizeLogisticContributions(drivers);
  }

  // Try to infer format from raw object
  if (isRawDriversObject(drivers)) {
    return normalizeRawDrivers(drivers);
  }

  return {
    kind: 'unavailable',
    units: null,
    positive: [],
    negative: [],
    meta: {},
  };
}

function normalizeShapValues(drivers) {
  const shapData = drivers.shap_values || drivers;
  const features = [];

  if (Array.isArray(shapData)) {
    // Handle array format
    shapData.forEach((item, index) => {
      if (typeof item === 'object' && item.feature && item.value !== undefined) {
        features.push({
          label: item.feature,
          weight: item.value,
        });
      } else if (typeof item === 'number') {
        features.push({
          label: `Feature ${index}`,
          weight: item,
        });
      }
    });
  } else if (typeof shapData === 'object') {
    // Handle object format
    Object.entries(shapData).forEach(([feature, value]) => {
      if (typeof value === 'number') {
        features.push({
          label: feature,
          weight: value,
        });
      }
    });
  }

  // Sort by absolute weight value
  features.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  // Specific check for FAST-ED related features
  const fastEdFeatures = features.filter((f) => f.label.toLowerCase().includes('fast')
    || f.label.toLowerCase().includes('ed')
    || f.label.includes('fast_ed'));
  if (fastEdFeatures.length > 0) {

  } else {
    // No FAST-ED features found in drivers
  }

  const positive = features.filter((f) => f.weight > 0);
  const negative = features.filter((f) => f.weight < 0);

  const meta = {};
  if (drivers.base_value !== undefined) {
    meta.base_value = drivers.base_value;
  }
  if (drivers.contrib_sum !== undefined) {
    meta.contrib_sum = drivers.contrib_sum;
  }
  if (drivers.logit_total !== undefined) {
    meta.logit_total = drivers.logit_total;
  }

  return {
    kind: 'shap_values',
    units: 'logit',
    positive,
    negative,
    meta,
  };
}

function normalizeLogisticContributions(drivers) {
  const logitData = drivers.logistic_contributions || drivers;
  const features = [];

  if (typeof logitData === 'object') {
    Object.entries(logitData).forEach(([feature, value]) => {
      if (typeof value === 'number' && !['intercept', 'contrib_sum', 'logit_total'].includes(feature)) {
        features.push({
          label: feature,
          weight: value,
        });
      }
    });
  }

  // Sort by absolute weight value
  features.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  const positive = features.filter((f) => f.weight > 0);
  const negative = features.filter((f) => f.weight < 0);

  const meta = {};
  if (logitData.intercept !== undefined) {
    meta.base_value = logitData.intercept;
  }
  if (logitData.contrib_sum !== undefined) {
    meta.contrib_sum = logitData.contrib_sum;
  }
  if (logitData.logit_total !== undefined) {
    meta.logit_total = logitData.logit_total;
  }
  if (drivers.contrib_sum !== undefined) {
    meta.contrib_sum = drivers.contrib_sum;
  }

  return {
    kind: 'logistic_contributions',
    units: 'logit',
    positive,
    negative,
    meta,
  };
}

function normalizeRawDrivers(drivers) {
  const features = [];

  Object.entries(drivers).forEach(([feature, value]) => {
    if (typeof value === 'number') {
      features.push({
        label: feature,
        weight: value,
      });
    }
  });

  // Sort by absolute weight value
  features.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  const positive = features.filter((f) => f.weight > 0);
  const negative = features.filter((f) => f.weight < 0);

  return {
    kind: 'raw_weights',
    units: null,
    positive,
    negative,
    meta: {},
  };
}

function isRawDriversObject(obj) {
  return Object.values(obj).every((value) => typeof value === 'number');
}
