"use client";

import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { DispatchJob } from "@/types/job";
import { Clock, User, Wrench, GripVertical } from "lucide-react";

interface UnassignedCardProps {
  job: DispatchJob;
}

export function UnassignedCard({ job }: UnassignedCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: job.id,
    data: { job, source: "sidebar" },
  });

  // DragOverlay renders the moving visual; the source card stays and dims.
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.4 : 1,
  };

  const hours = Math.floor(job.durationMinutes / 60);
  const mins = job.durationMinutes % 60;
  const durationLabel =
    hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border bg-card p-3 shadow-sm select-none",
        "cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:border-primary/40 transition-all",
        isDragging && "ring-2 ring-primary shadow-lg",
      )}
      {...attributes}
      {...listeners}
    >
      {/* Drag handle + Client */}
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground" strokeWidth={2.5} />
        <div className="flex items-center gap-1.5 min-w-0">
          <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
          <span className="font-semibold text-sm truncate">{job.client.name}</span>
        </div>
      </div>

      {/* Job type */}
      <div className="flex items-center gap-1.5 mt-1.5 pl-6">
        <Wrench className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
        <span className="text-xs text-muted-foreground truncate">{job.jobType}</span>
      </div>

      {/* Duration badge */}
      <div className="flex items-center gap-1.5 mt-1.5 pl-6">
        <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
        <span className="text-xs text-muted-foreground">{durationLabel}</span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">{job.jobNumber}</span>
      </div>
    </div>
  );
}
