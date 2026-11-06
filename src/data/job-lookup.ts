import { DispatchJob, DispatchStatus, Job, JobStatus } from "@/types/job";
import { getJobById } from "@/data/mock-jobs";
import { getDispatchJobById } from "@/data/dispatch-data";

/** Map dispatch-board statuses onto the technician workflow vocabulary. */
const dispatchToJobStatus: Record<DispatchStatus, JobStatus> = {
  draft: "dispatch",
  scheduled: "dispatch",
  "en-route": "en-route",
  "in-progress": "in-progress",
  complete: "complete",
  cancelled: "cancelled",
};

function formatClockTime(date: Date): string {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h12}:${minute.toString().padStart(2, "0")} ${period}`;
}

/** Flesh a grid-oriented DispatchJob out into a full Job record. */
export function dispatchJobToJob(dj: DispatchJob): Job {
  // Dispatch records carry no actual start/finish times, so for jobs the
  // board says are underway or done, use the scheduled window. Without
  // this the technician view showed in-progress jobs with a frozen 0:00
  // timer.
  const started = dj.status === "in-progress" || dj.status === "complete";
  return {
    startedAt: started ? dj.scheduledStart : undefined,
    completedAt: dj.status === "complete" ? dj.scheduledEnd : undefined,
    id: dj.id,
    jobNumber: dj.jobNumber,
    status: dispatchToJobStatus[dj.status],
    scheduledDate: dj.scheduledStart,
    scheduledStartTime: formatClockTime(dj.scheduledStart),
    scheduledEndTime: formatClockTime(dj.scheduledEnd),
    jobType: dj.jobType,
    description: dj.description,
    client: dj.client,
    serviceAddress: dj.serviceAddress,
    accessNotes: dj.accessNotes,
    gateCode: dj.gateCode,
    tasks: [],
    photos: [],
    materials: [],
    notes: [],
    technicianId: dj.technicianId ?? "",
  };
}

/**
 * Resolve a job id from either data store: technician mock jobs first,
 * then dispatch-board jobs (converted to the full Job shape).
 */
export function getUnifiedJobById(id: string): Job | undefined {
  const job = getJobById(id);
  if (job) return job;

  const dispatchJob = getDispatchJobById(id);
  return dispatchJob ? dispatchJobToJob(dispatchJob) : undefined;
}
