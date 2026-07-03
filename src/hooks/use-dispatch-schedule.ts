"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { addMinutes } from "date-fns";
import { DispatchJob, DispatchStatus } from "@/types/job";
import {
  assignJob,
  rescheduleJob,
  scheduledJobs,
  unassignedJobs,
} from "@/data/dispatch-data";
import { updateJobSchedule } from "@/app/admin/dispatch/actions";

export interface DispatchSchedule {
  scheduled: DispatchJob[];
  unassigned: DispatchJob[];
}

export const DISPATCH_SCHEDULE_KEY = ["dispatch-schedule"] as const;

/** Simulated fetch — in production this would hit the API/database. */
async function fetchDispatchSchedule(): Promise<DispatchSchedule> {
  await new Promise((r) => setTimeout(r, 150));
  return {
    scheduled: [...scheduledJobs],
    unassigned: [...unassignedJobs],
  };
}

export function useDispatchSchedule() {
  return useQuery({
    queryKey: DISPATCH_SCHEDULE_KEY,
    queryFn: fetchDispatchSchedule,
  });
}

export interface ScheduleMove {
  job: DispatchJob;
  technicianId: string;
  startTime: Date;
  source: "sidebar" | "grid";
}

/** Apply a move to a schedule snapshot (pure — used for optimistic updates). */
function applyMove(prev: DispatchSchedule, move: ScheduleMove): DispatchSchedule {
  const { job, technicianId, startTime, source } = move;
  const updated: DispatchJob = {
    ...job,
    technicianId,
    status: job.status === "draft" ? "scheduled" : job.status,
    scheduledStart: startTime,
    scheduledEnd: addMinutes(startTime, job.durationMinutes),
  };

  if (source === "sidebar") {
    return {
      unassigned: prev.unassigned.filter((j) => j.id !== job.id),
      scheduled: [...prev.scheduled, updated],
    };
  }
  return {
    unassigned: prev.unassigned,
    scheduled: prev.scheduled.map((j) => (j.id === job.id ? updated : j)),
  };
}

export function useScheduleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (move: ScheduleMove) => {
      const result = await updateJobSchedule({
        jobId: move.job.id,
        technicianId: move.technicianId,
        startTime: move.startTime.toISOString(),
      });
      if (!result.success) {
        throw new Error(result.error ?? "Schedule update failed");
      }
      return result;
    },

    // Optimistic update: apply the move to the cache immediately
    onMutate: async (move) => {
      await queryClient.cancelQueries({ queryKey: DISPATCH_SCHEDULE_KEY });
      const previous =
        queryClient.getQueryData<DispatchSchedule>(DISPATCH_SCHEDULE_KEY);

      if (previous) {
        queryClient.setQueryData<DispatchSchedule>(
          DISPATCH_SCHEDULE_KEY,
          applyMove(previous, move),
        );
      }
      return { previous };
    },

    // Roll the cache back if the server rejects the move
    onError: (_err, _move, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DISPATCH_SCHEDULE_KEY, context.previous);
      }
    },

    // Keep the client-side mock store consistent so a later refetch
    // (queryFn reads these arrays) doesn't undo the move.
    onSuccess: (_result, move) => {
      const applied = assignJob(move.job.id, move.technicianId, move.startTime);
      if (!applied) {
        rescheduleJob(move.job.id, move.technicianId, move.startTime);
      }
    },
  });
}

/** Cache-only status update for the preview popover's quick dropdown. */
export function useStatusUpdate() {
  const queryClient = useQueryClient();

  return (jobId: string, status: DispatchStatus) => {
    queryClient.setQueryData<DispatchSchedule>(
      DISPATCH_SCHEDULE_KEY,
      (prev) =>
        prev && {
          ...prev,
          scheduled: prev.scheduled.map((j) =>
            j.id === jobId ? { ...j, status } : j,
          ),
        },
    );
    // Mirror into the mock store so refetches keep the change
    const job = scheduledJobs.find((j) => j.id === jobId);
    if (job) job.status = status;
  };
}

/**
 * Returns the conflicting job if placing `job` at `startTime` on
 * `technicianId`'s column would overlap an existing block.
 */
export function findScheduleConflict(
  schedule: DispatchSchedule,
  job: DispatchJob,
  technicianId: string,
  startTime: Date,
): DispatchJob | undefined {
  const newStart = startTime.getTime();
  const newEnd = addMinutes(startTime, job.durationMinutes).getTime();

  return schedule.scheduled.find(
    (other) =>
      other.id !== job.id &&
      other.technicianId === technicianId &&
      other.scheduledStart.getTime() < newEnd &&
      other.scheduledEnd.getTime() > newStart,
  );
}
