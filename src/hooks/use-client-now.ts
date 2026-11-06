"use client";

import { useSyncExternalStore } from "react";

const MINUTE_MS = 60_000;

function subscribe(onTick: () => void) {
  // Re-check twice a minute so greetings/dates roll over without a reload.
  const id = setInterval(onTick, MINUTE_MS / 2);
  return () => clearInterval(id);
}

// Minute resolution keeps the snapshot stable between ticks, as
// useSyncExternalStore requires.
const getSnapshot = () => Math.floor(Date.now() / MINUTE_MS) * MINUTE_MS;
const getServerSnapshot = () => null;

/**
 * The current time in the viewer's own timezone, or `null` during server
 * rendering and hydration.
 *
 * Use it for anything time-of-day or calendar-date dependent that gets
 * rendered. Pages like the technician dashboard are statically prerendered,
 * so calling `new Date()` during render would freeze the build machine's
 * date/time (and timezone) into the HTML and then mismatch on hydration.
 */
export function useClientNow(): Date | null {
  const ms = useSyncExternalStore<number | null>(subscribe, getSnapshot, getServerSnapshot);
  return ms === null ? null : new Date(ms);
}
