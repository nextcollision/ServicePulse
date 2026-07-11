/**
 * Shared constants for the dispatch time grid.
 *
 * The grid uses CSS Grid where:
 *   - Row 1 = header (technician names)
 *   - Rows 2..N = 30-minute time slots from GRID_START_HOUR to GRID_END_HOUR
 *   - Column 1 = time axis labels
 *   - Columns 2..M = one per technician
 */

/** First visible hour on the grid (inclusive) */
export const GRID_START_HOUR = 7;

/** Last visible hour on the grid (exclusive — 19 means last slot starts at 18:30) */
export const GRID_END_HOUR = 19;

/** Slot duration in minutes */
export const SLOT_MINUTES = 30;

/** Height of each 30-min row in pixels */
export const ROW_HEIGHT_PX = 60;

/** Number of 30-min slots */
export const TOTAL_SLOTS = ((GRID_END_HOUR - GRID_START_HOUR) * 60) / SLOT_MINUTES;

/** Width of the time-axis label column */
export const TIME_COL_WIDTH = "72px";

/**
 * Given a Date, return the 0-based slot index within the grid,
 * or -1 if the time falls outside the visible range.
 */
export function timeToSlotIndex(date: Date): number {
  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  const gridStartMinutes = GRID_START_HOUR * 60;
  const gridEndMinutes = GRID_END_HOUR * 60;

  if (totalMinutes < gridStartMinutes || totalMinutes >= gridEndMinutes) {
    return -1;
  }

  return Math.floor((totalMinutes - gridStartMinutes) / SLOT_MINUTES);
}

/**
 * Convert a slot index back to a Date (today at that slot's time).
 */
export function slotIndexToTime(slotIndex: number): Date {
  const totalMinutes = GRID_START_HOUR * 60 + slotIndex * SLOT_MINUTES;
  const d = new Date();
  d.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);
  return d;
}

/**
 * How many slots does a given duration (in minutes) span?
 */
export function durationToSlotSpan(durationMinutes: number): number {
  return Math.max(1, Math.ceil(durationMinutes / SLOT_MINUTES));
}

/**
 * Format a slot index into a human-readable label like "8:00 AM".
 */
export function slotLabel(slotIndex: number): string {
  const totalMinutes = GRID_START_HOUR * 60 + slotIndex * SLOT_MINUTES;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h12}:${minute.toString().padStart(2, "0")} ${period}`;
}
