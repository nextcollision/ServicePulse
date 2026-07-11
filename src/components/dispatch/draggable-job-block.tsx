"use client";

import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { DispatchJob, DispatchStatus } from "@/types/job";
import {
  ROW_HEIGHT_PX,
  durationToSlotSpan,
  timeToSlotIndex,
} from "./grid-constants";
import { Clock, GripVertical } from "lucide-react";

// ─── Status → colour mapping ────────────────

const statusColorMap: Record<DispatchStatus, string> = {
  draft: "bg-gray-200 border-gray-400 text-gray-800",
  scheduled: "bg-blue-100 border-blue-400 text-blue-900",
  "en-route": "bg-sky-100 border-sky-400 text-sky-900",
  "in-progress": "bg-green-100 border-green-400 text-green-900",
  complete: "bg-purple-100 border-purple-400 text-purple-900",
  cancelled: "bg-red-100 border-red-300 text-red-800",
};

// ─── Component ──────────────────────────────

interface DraggableJobBlockProps {
  job: DispatchJob;
  onClick?: (job: DispatchJob, event: React.MouseEvent) => void;
}

export function DraggableJobBlock({ job, onClick }: DraggableJobBlockProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: job.id,
    data: { job, source: "grid" },
  });

  const slotStart = timeToSlotIndex(job.scheduledStart);
  const slotSpan = durationToSlotSpan(job.durationMinutes);
  const blockHeight = slotSpan * ROW_HEIGHT_PX;

  // If the job starts before the visible grid, clamp to 0
  const topOffset = Math.max(0, slotStart) * ROW_HEIGHT_PX;

  // While dragging, DragOverlay renders the moving visual — the source block
  // stays in place and dims so the user sees where the job came from.
  const style: React.CSSProperties = {
    position: "absolute",
    top: topOffset,
    left: 4,
    right: 4,
    height: blockHeight - 4, // 4px gap
    zIndex: 10,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const colors = statusColorMap[job.status] || statusColorMap.draft;
  const hours = Math.floor(job.durationMinutes / 60);
  const mins = job.durationMinutes % 60;
  const durationLabel =
    hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border-l-[3px] px-2 py-1.5 text-xs shadow-sm select-none",
        "overflow-hidden transition-shadow hover:shadow-md",
        colors,
      )}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation();
          onClick?.(job, e);
        }
      }}
      {...attributes}
      {...listeners}
    >
      {/* Drag handle + client name */}
      <div className="flex items-start gap-1">
        <GripVertical className="h-3.5 w-3.5 shrink-0 opacity-40 mt-0.5" strokeWidth={2.5} />
        <span className="font-semibold truncate leading-tight">{job.client.name}</span>
      </div>

      {/* Job type */}
      <p className="truncate text-[11px] opacity-80 mt-0.5 pl-[18px]">{job.jobType}</p>

      {/* Duration chip – only show if there's enough vertical room */}
      {slotSpan >= 2 && (
        <div className="flex items-center gap-1 mt-1 pl-[18px] opacity-70">
          <Clock className="h-3 w-3" strokeWidth={2} />
          <span className="text-[10px]">{durationLabel}</span>
        </div>
      )}
    </div>
  );
}
