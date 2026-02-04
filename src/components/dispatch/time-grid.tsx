"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DispatchJob, DispatchTechnician } from "@/types/job";
import { DraggableJobBlock } from "./draggable-job-block";
import { DroppableTimeSlot } from "./droppable-time-slot";
import {
  TOTAL_SLOTS,
  ROW_HEIGHT_PX,
  TIME_COL_WIDTH,
  slotLabel,
} from "./grid-constants";

// ─── Props ──────────────────────────────────

interface TimeGridProps {
  technicians: DispatchTechnician[];
  scheduledJobs: DispatchJob[];
  onJobClick: (job: DispatchJob, clickPosition: { x: number; y: number }) => void;
}

// ─── Component ──────────────────────────────

export function TimeGrid({
  technicians,
  scheduledJobs,
  onJobClick,
}: TimeGridProps) {
  // Bucket jobs by technician
  const jobsByTech = React.useMemo(() => {
    const map = new Map<string, DispatchJob[]>();
    for (const tech of technicians) {
      map.set(tech.id, []);
    }
    for (const job of scheduledJobs) {
      if (job.technicianId && map.has(job.technicianId)) {
        map.get(job.technicianId)!.push(job);
      }
    }
    return map;
  }, [technicians, scheduledJobs]);

  const slots = React.useMemo(
    () => Array.from({ length: TOTAL_SLOTS }, (_, i) => i),
    [],
  );

  const techCount = technicians.length;

  // The shared column template:  [time-axis] [tech-1] ... [tech-n]
  const gridTemplateColumns = `${TIME_COL_WIDTH} repeat(${techCount}, minmax(160px, 1fr))`;
  const bodyHeight = TOTAL_SLOTS * ROW_HEIGHT_PX;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ────────────────── Sticky Header Row ────────────────── */}
      <div
        className="shrink-0 grid sticky top-0 z-20 border-b-2 border-border bg-background"
        style={{ gridTemplateColumns }}
      >
        {/* Corner cell */}
        <div className="border-r border-border" />

        {/* Technician column headers */}
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="flex items-center gap-2 px-3 py-3 border-r border-border last:border-r-0"
          >
            <div
              className="flex items-center justify-center h-8 w-8 rounded-full text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: tech.color }}
            >
              {tech.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{tech.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {jobsByTech.get(tech.id)?.length ?? 0} jobs today
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ────────────────── Scrollable Body ────────────────── */}
      <div className="flex-1 overflow-auto">
        {/*
          Two-layer stack:
            Layer 1 (back):  CSS Grid of droppable time-slot cells
            Layer 2 (front): Per-column overlays holding draggable job blocks

          Both layers share the identical column template so they align
          pixel-perfectly.
        */}
        <div className="relative" style={{ height: bodyHeight }}>
          {/* ── Layer 1: Droppable Grid Cells ── */}
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns,
              gridTemplateRows: `repeat(${TOTAL_SLOTS}, ${ROW_HEIGHT_PX}px)`,
            }}
          >
            {slots.map((slotIdx) => {
              const isEvenHour = slotIdx % 2 === 0;
              const label = slotLabel(slotIdx);

              return (
                <React.Fragment key={`row-${slotIdx}`}>
                  {/* Time label */}
                  <div
                    className={cn(
                      "border-r border-b border-border/60 flex items-start justify-end pr-2 pt-1 select-none",
                      isEvenHour ? "bg-background" : "bg-muted/30",
                    )}
                  >
                    {isEvenHour && (
                      <span className="text-[11px] font-medium text-muted-foreground -mt-0.5">
                        {label}
                      </span>
                    )}
                  </div>

                  {/* One droppable cell per technician */}
                  {technicians.map((tech) => (
                    <DroppableTimeSlot
                      key={`slot-${tech.id}-${slotIdx}`}
                      id={`slot-${tech.id}-${slotIdx}`}
                      technicianId={tech.id}
                      slotIndex={slotIdx}
                      isEvenHour={isEvenHour}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── Layer 2: Job Block Overlays ── */}
          <div
            className="absolute inset-0 grid pointer-events-none"
            style={{
              gridTemplateColumns,
              height: bodyHeight,
            }}
          >
            {/* Empty cell matching the time-axis column */}
            <div />

            {/* One overlay column per technician */}
            {technicians.map((tech) => (
              <div key={`overlay-${tech.id}`} className="relative">
                {jobsByTech.get(tech.id)?.map((job) => (
                  <div key={job.id} className="pointer-events-auto">
                    <DraggableJobBlock
                      job={job}
                      onClick={(j, e) => {
                        onJobClick(j, { x: e.clientX, y: e.clientY });
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
