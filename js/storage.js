/**
 * Storage Management Module for StudyVerse
 * Handles localStorage operations for progress tracking
 */

/**
 * Get completed topics from storage
 */
function getDone() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DONE)) || {};
  } catch (err) {
    console.error('Storage read error:', err);
    return {};
  }
}

/**
 * Save completed topic to storage
 */
function setDone(key, val) {
  try {
    const d = getDone();
    if (val) {
      d[key] = 1;
    } else {
      delete d[key];
    }
    localStorage.setItem(STORAGE_KEYS.DONE, JSON.stringify(d));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

/**
 * Check if topic is completed
 */
function isDone(key) {
  return !!getDone()[key];
}

/**
 * Generate storage key for topic
 */
function doneKey(cat, sub, topic) {
  return `${cat}::${sub}::${topic}`;
}

/**
 * Count completed topics in a subject
 */
function countDone(cat, sub) {
  try {
    const d = getDone();
    const prefix = `${cat}::${sub}::`;
    return Object.keys(d).filter(k => k.startsWith(prefix)).length;
  } catch (err) {
    console.error('Count done error:', err);
    return 0;
  }
}

/**
 * Get progress percentage for a subject
 */
function getProgressPercentage(cat, sub) {
  try {
    const data = getCategoryContent(cat);
    const subject = data[sub];
    if (!subject) return 0;

    const topics = Object.keys(subject.topics || {});
    if (topics.length === 0) return 0;

    const done = countDone(cat, sub);
    return Math.round((done / topics.length) * 100);
  } catch (err) {
    console.error('Progress error:', err);
    return 0;
  }
}

/**
 * Clear all progress (for testing/reset)
 */
function clearAllProgress() {
  if (confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
    try {
      localStorage.removeItem(STORAGE_KEYS.DONE);
      showToast('All progress cleared', 'success');
      buildAll();
    } catch (err) {
      console.error('Clear progress error:', err);
      showToast(ERROR_MESSAGES.STORAGE_ERROR, 'error');
    }
  }
}

/**
 * Export progress as JSON
 */
function exportProgress() {
  try {
    const progress = getDone();
    const dataStr = JSON.stringify(progress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studyverse-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Progress exported successfully', 'success');
  } catch (err) {
    console.error('Export error:', err);
    showToast(ERROR_MESSAGES.API_ERROR, 'error');
  }
}

/**
 * Import progress from JSON
 */
function importProgress(file) {
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      localStorage.setItem(STORAGE_KEYS.DONE, JSON.stringify(data));
      showToast('Progress imported successfully', 'success');
      buildAll();
    };
    reader.readAsText(file);
  } catch (err) {
    console.error('Import error:', err);
    showToast('Invalid progress file', 'error');
  }
}

/**
 * Get storage usage statistics
 */
function getStorageStats() {
  try {
    const done = JSON.stringify(getDone()).length;
    const user = localStorage.getItem(STORAGE_KEYS.USER) ? localStorage.getItem(STORAGE_KEYS.USER).length : 0;
    const total = done + user;
    
    return {
      done: done,
      user: user,
      total: total,
      formatted: formatBytes(total)
    };
  } catch (err) {
    console.error('Storage stats error:', err);
    return { done: 0, user: 0, total: 0, formatted: '0 B' };
  }
}

/**
 * Save user preferences
 */
function savePreferences(prefs) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES)) || {};
    const updated = { ...existing, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (err) {
    console.error('Preference save error:', err);
  }
}

/**
 * Get user preferences
 */
function getPreferences() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES)) || {};
  } catch (err) {
    console.error('Preference get error:', err);
    return {};
  }
}
