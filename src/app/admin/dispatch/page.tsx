"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { DispatchJob, DispatchStatus } from "@/types/job";
import {
  dispatchTechnicians,
  scheduledJobs as initialScheduled,
  unassignedJobs as initialUnassigned,
} from "@/data/dispatch-data";
import { updateJobSchedule } from "./actions";
import { slotIndexToTime } from "@/components/dispatch/grid-constants";
import { TimeGrid } from "@/components/dispatch/time-grid";
import { UnassignedQueue } from "@/components/dispatch/unassigned-queue";
import { DragOverlayCard } from "@/components/dispatch/drag-overlay-card";
import { JobPreviewPopover } from "@/components/dispatch/job-preview-popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  LayoutGrid,
} from "lucide-react";
import { format } from "date-fns";
import { addMinutes } from "date-fns";

// ─── Component ──────────────────────────────

export default function DispatchPage() {
  // ── State ──
  const [scheduled, setScheduled] = React.useState<DispatchJob[]>(() => [...initialScheduled]);
  const [unassigned, setUnassigned] = React.useState<DispatchJob[]>(() => [...initialUnassigned]);
  const [activeJob, setActiveJob] = React.useState<DispatchJob | null>(null);
  const [previewJob, setPreviewJob] = React.useState<DispatchJob | null>(null);
  const [previewPos, setPreviewPos] = React.useState({ x: 0, y: 0 });
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // ── dnd-kit sensors ──
  // PointerSensor with 8px activation distance so clicks don't trigger drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  // ── Drag handlers ──

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as { job: DispatchJob; source: string } | undefined;
    if (data?.job) {
      setActiveJob(data.job);
      // Close any open popover
      setPreviewJob(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeData = active.data.current as { job: DispatchJob; source: string } | undefined;
    const overData = over.data.current as { technicianId: string; slotIndex: number } | undefined;

    if (!activeData?.job || !overData) return;

    const { job } = activeData;
    const { technicianId, slotIndex } = overData;
    const startTime = slotIndexToTime(slotIndex);

    // Optimistic update
    const updatedJob: DispatchJob = {
      ...job,
      technicianId,
      status: job.status === "draft" ? "scheduled" : job.status,
      scheduledStart: startTime,
      scheduledEnd: addMinutes(startTime, job.durationMinutes),
    };

    if (activeData.source === "sidebar") {
      // Scenario A: Assigning from sidebar
      setUnassigned((prev) => prev.filter((j) => j.id !== job.id));
      setScheduled((prev) => [...prev, updatedJob]);
    } else {
      // Scenario B: Rescheduling within the grid
      setScheduled((prev) =>
        prev.map((j) => (j.id === job.id ? updatedJob : j)),
      );
    }

    // Fire server action (non-blocking)
    try {
      const result = await updateJobSchedule({
        jobId: job.id,
        technicianId,
        startTime: startTime.toISOString(),
      });

      if (!result.success) {
        console.error("Schedule update failed:", result.error);
        // Revert on failure
        if (activeData.source === "sidebar") {
          setUnassigned((prev) => [...prev, job]);
          setScheduled((prev) => prev.filter((j) => j.id !== job.id));
        } else {
          setScheduled((prev) =>
            prev.map((j) => (j.id === updatedJob.id ? job : j)),
          );
        }
      }
    } catch (err) {
      console.error("Schedule update error:", err);
    }
  };

  // ── Popover handlers ──

  const handleJobClick = (job: DispatchJob, position: { x: number; y: number }) => {
    // Clamp position to prevent popover from going off-screen
    const x = Math.min(position.x, window.innerWidth - 340);
    const y = Math.min(position.y, window.innerHeight - 400);
    setPreviewPos({ x: Math.max(0, x), y: Math.max(0, y) });
    setPreviewJob(job);
  };

  const handleStatusChange = (jobId: string, newStatus: DispatchStatus) => {
    setScheduled((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: newStatus } : j,
      ),
    );
    // Update popover's reference to the job
    setPreviewJob((prev) =>
      prev && prev.id === jobId ? { ...prev, status: newStatus } : prev,
    );
  };

  // ── Refresh (simulated) ──

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
  };

  const today = new Date();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ── Top Bar ── */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <LayoutGrid className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <h1 className="text-lg font-bold">Dispatch Command Center</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Date nav (visual only for now) */}
          <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg px-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            <div className="flex items-center gap-1.5 px-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
              <span className="text-sm font-medium">
                {format(today, "EEEE, MMM d")}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              strokeWidth={2}
            />
          </Button>
        </div>
      </header>

      {/* ── Main Content: Sidebar + Grid ── */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-[280px] shrink-0">
            <UnassignedQueue jobs={unassigned} />
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-hidden">
            <TimeGrid
              technicians={dispatchTechnicians}
              scheduledJobs={scheduled}
              onJobClick={handleJobClick}
            />
          </div>
        </div>

        {/* Drag overlay — renders the floating card while dragging */}
        <DragOverlay dropAnimation={null}>
          {activeJob ? <DragOverlayCard job={activeJob} /> : null}
        </DragOverlay>
      </DndContext>

      {/* ── Job Preview Popover ── */}
      {previewJob && (
        <JobPreviewPopover
          job={previewJob}
          position={previewPos}
          onClose={() => setPreviewJob(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
