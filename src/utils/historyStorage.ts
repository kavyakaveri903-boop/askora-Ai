/**
 * Storage utility for saving and loading FAQ conversation history in localStorage.
 */

import { HistoryRecord } from '../types/faq';

const HISTORY_STORAGE_KEY = 'askora_ai_faq_history_v1';

/**
 * Loads all history records from localStorage.
 */
export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to load history from localStorage:', error);
    return [];
  }
}

/**
 * Saves a new history record to localStorage. Prepend newest to top.
 */
export function saveHistory(record: HistoryRecord): HistoryRecord[] {
  try {
    const existing = loadHistory();
    // Avoid duplicate immediately identical queries if submitted within 2 seconds
    const filtered = existing.filter(
      item => !(item.userQuestion === record.userQuestion && Math.abs(item.timestamp - record.timestamp) < 2000)
    );
    const updated = [record, ...filtered];
    // Keep max 100 recent items
    const trimmed = updated.slice(0, 100);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch (error) {
    console.error('Failed to save record to localStorage:', error);
    return loadHistory();
  }
}

/**
 * Deletes a specific history record by ID.
 */
export function deleteHistoryItem(id: string): HistoryRecord[] {
  try {
    const existing = loadHistory();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to delete history item:', error);
    return loadHistory();
  }
}

/**
 * Clears all history records from localStorage.
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history from localStorage:', error);
  }
}
