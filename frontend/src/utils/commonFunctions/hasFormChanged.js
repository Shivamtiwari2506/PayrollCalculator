/**
 * Checks if any field in the form has changed compared to the original data
 * @param {Object} originalData - The original data object
 * @param {Object} currentData - The current form data object
 * @param {Array} excludeFields - Optional array of field names to exclude from comparison
 * @returns {boolean} - Returns true if any field has changed, false otherwise
 */
export const hasFormChanged = (originalData, currentData, excludeFields = []) => {
  // If either object is null or undefined, return false
  if (!originalData || !currentData) {
    return false;
  }

  // Get all keys from both objects
  const allKeys = new Set([
    ...Object.keys(originalData),
    ...Object.keys(currentData),
  ]);

  // Check each key
  for (const key of allKeys) {
    // Skip excluded fields
    if (excludeFields.includes(key)) {
      continue;
    }

    const originalValue = originalData[key];
    const currentValue = currentData[key];

    // Handle null/undefined comparison
    if (originalValue === null || originalValue === undefined) {
      if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
        return true;
      }
      continue;
    }

    if (currentValue === null || currentValue === undefined) {
      if (originalValue !== null && originalValue !== undefined && originalValue !== '') {
        return true;
      }
      continue;
    }

    // Convert both values to strings for comparison (handles numbers, booleans, etc.)
    const originalStr = String(originalValue).trim();
    const currentStr = String(currentValue).trim();

    if (originalStr !== currentStr) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the list of changed fields between original and current data
 * @param {Object} originalData - The original data object
 * @param {Object} currentData - The current form data object
 * @param {Array} excludeFields - Optional array of field names to exclude
 * @returns {Array} - Array of changed field names
 */
export const getChangedFields = (originalData, currentData, excludeFields = []) => {
  const changedFields = [];

  if (!originalData || !currentData) {
    return changedFields;
  }

  const allKeys = new Set([
    ...Object.keys(originalData),
    ...Object.keys(currentData),
  ]);

  for (const key of allKeys) {
    if (excludeFields.includes(key)) {
      continue;
    }

    const originalValue = originalData[key];
    const currentValue = currentData[key];

    // Handle null/undefined comparison
    const originalStr = originalValue === null || originalValue === undefined 
      ? '' 
      : String(originalValue).trim();
    const currentStr = currentValue === null || currentValue === undefined 
      ? '' 
      : String(currentValue).trim();

    if (originalStr !== currentStr) {
      changedFields.push(key);
    }
  }

  return changedFields;
};

/**
 * Gets only the changed data from the form
 * @param {Object} originalData - The original data object
 * @param {Object} currentData - The current form data object
 * @param {Array} excludeFields - Optional array of field names to exclude
 * @returns {Object} - Object containing only the changed fields
 */
export const getChangedData = (originalData, currentData, excludeFields = []) => {
  const changedData = {};

  if (!originalData || !currentData) {
    return changedData;
  }

  const changedFields = getChangedFields(originalData, currentData, excludeFields);

  changedFields.forEach(field => {
    changedData[field] = currentData[field];
  });

  return changedData;
};
