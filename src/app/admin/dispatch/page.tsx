"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { DispatchJob, DispatchStatus } from "@/types/job";
import { dispatchTechnicians } from "@/data/dispatch-data";
import {
  useDispatchSchedule,
  useScheduleMutation,
  useStatusUpdate,
  findScheduleConflict,
  type ScheduleMove,
} from "@/hooks/use-dispatch-schedule";
import { slotIndexToTime } from "@/components/dispatch/grid-constants";
import { TimeGrid } from "@/components/dispatch/time-grid";
import { UnassignedQueue } from "@/components/dispatch/unassigned-queue";
import { DragOverlayCard } from "@/components/dispatch/drag-overlay-card";
import { JobPreviewPopover } from "@/components/dispatch/job-preview-popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  LayoutGrid,
} from "lucide-react";
import { format } from "date-fns";

// ─── Component ──────────────────────────────

export default function DispatchPage() {
  // ── Server state (React Query) ──
  const { data: schedule, isLoading, refetch, isRefetching } = useDispatchSchedule();
  const scheduleMutation = useScheduleMutation();
  const updateStatus = useStatusUpdate();

  // ── Local UI state ──
  const [activeJob, setActiveJob] = React.useState<DispatchJob | null>(null);
  const [previewJob, setPreviewJob] = React.useState<DispatchJob | null>(null);
  const [previewPos, setPreviewPos] = React.useState({ x: 0, y: 0 });
  const [conflictWarning, setConflictWarning] = React.useState<string | null>(null);

  // Auto-dismiss the conflict banner
  React.useEffect(() => {
    if (!conflictWarning) return;
    const id = setTimeout(() => setConflictWarning(null), 3500);
    return () => clearTimeout(id);
  }, [conflictWarning]);

  // ── dnd-kit sensors ──
  // PointerSensor with 8px activation distance so clicks don't trigger drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  // ── Drag handlers ──

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as
      | { job: DispatchJob; source: string }
      | undefined;
    if (data?.job) {
      setActiveJob(data.job);
      setPreviewJob(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over || !schedule) return;

    const activeData = active.data.current as
      | { job: DispatchJob; source: "sidebar" | "grid" }
      | undefined;
    const overData = over.data.current as
      | { technicianId: string; slotIndex: number }
      | undefined;

    if (!activeData?.job || !overData) return;

    const { job, source } = activeData;
    const { technicianId, slotIndex } = overData;
    const startTime = slotIndexToTime(slotIndex);

    // Overlap guard: reject drops that collide with an existing block
    const conflict = findScheduleConflict(schedule, job, technicianId, startTime);
    if (conflict) {
      const tech = dispatchTechnicians.find((t) => t.id === technicianId);
      setConflictWarning(
        `Can't schedule here — overlaps "${conflict.jobType}" for ${conflict.client.name} on ${tech?.name ?? "this technician"}'s route.`,
      );
      return;
    }

    const move: ScheduleMove = { job, technicianId, startTime, source };
    scheduleMutation.mutate(move, {
      onError: (err) => setConflictWarning(err.message),
    });
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
    updateStatus(jobId, newStatus);
    setPreviewJob((prev) =>
      prev && prev.id === jobId ? { ...prev, status: newStatus } : prev,
    );
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
            onClick={() => refetch()}
            disabled={isRefetching}
            className="h-8 w-8"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefetching && "animate-spin")}
              strokeWidth={2}
            />
          </Button>
        </div>
      </header>

      {/* ── Conflict warning banner ── */}
      {conflictWarning && (
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 border-b border-amber-300 text-sm dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          <span>{conflictWarning}</span>
        </div>
      )}

      {/* ── Main Content: Sidebar + Grid ── */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          {isLoading || !schedule ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={2} />
            </div>
          ) : (
            <>
              {/* Sidebar */}
              <div className="w-[280px] shrink-0">
                <UnassignedQueue jobs={schedule.unassigned} />
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-hidden">
                <TimeGrid
                  technicians={dispatchTechnicians}
                  scheduledJobs={schedule.scheduled}
                  onJobClick={handleJobClick}
                />
              </div>
            </>
          )}
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
