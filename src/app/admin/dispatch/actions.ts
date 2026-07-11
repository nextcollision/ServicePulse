"use server";

import { assignJob, rescheduleJob } from "@/data/dispatch-data";

export interface ScheduleUpdatePayload {
  jobId: string;
  technicianId: string;
  /** ISO-8601 string – we serialise Dates across the server boundary */
  startTime: string;
}

export interface ScheduleUpdateResult {
  success: boolean;
  error?: string;
  job?: {
    id: string;
    technicianId: string | null;
    scheduledStart: string;
    scheduledEnd: string;
    status: string;
  };
}

/**
 * Server Action: assign an unassigned job to a technician at a given time,
 * or reschedule an already-scheduled job.
 *
 * In production this would hit a real database.  For now it mutates the
 * in-memory mock data arrays so the UI refreshes correctly.
 */
export async function updateJobSchedule(
  payload: ScheduleUpdatePayload,
): Promise<ScheduleUpdateResult> {
  const { jobId, technicianId, startTime } = payload;

  if (!jobId || !technicianId || !startTime) {
    return { success: false, error: "Missing required fields." };
  }

  const start = new Date(startTime);
  if (isNaN(start.getTime())) {
    return { success: false, error: "Invalid start time." };
  }

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 200));

  // Try assign (unassigned → scheduled) first, then reschedule
  let result = assignJob(jobId, technicianId, start);
  if (!result) {
    result = rescheduleJob(jobId, technicianId, start);
  }

  if (!result) {
    return { success: false, error: `Job ${jobId} not found.` };
  }

  return {
    success: true,
    job: {
      id: result.id,
      technicianId: result.technicianId,
      scheduledStart: result.scheduledStart.toISOString(),
      scheduledEnd: result.scheduledEnd.toISOString(),
      status: result.status,
    },
  };
}
