"use client";

import { DispatchJob, DispatchStatus } from "@/types/job";
import { cn } from "@/lib/utils";
import { User, Wrench, Clock } from "lucide-react";

const statusColorMap: Record<DispatchStatus, string> = {
  draft: "bg-gray-100 border-gray-400 text-gray-800",
  scheduled: "bg-blue-100 border-blue-400 text-blue-900",
  "en-route": "bg-sky-100 border-sky-400 text-sky-900",
  "in-progress": "bg-green-100 border-green-400 text-green-900",
  complete: "bg-purple-100 border-purple-400 text-purple-900",
  cancelled: "bg-red-100 border-red-300 text-red-800",
};

interface DragOverlayCardProps {
  job: DispatchJob;
}

export function DragOverlayCard({ job }: DragOverlayCardProps) {
  const colors = statusColorMap[job.status] || statusColorMap.draft;
  const hours = Math.floor(job.durationMinutes / 60);
  const mins = job.durationMinutes % 60;
  const durationLabel =
    hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;

  return (
    <div
      className={cn(
        "w-[200px] rounded-lg border-l-[3px] p-3 shadow-2xl text-xs select-none rotate-2",
        colors,
      )}
    >
      <div className="flex items-center gap-1.5">
        <User className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        <span className="font-semibold truncate">{job.client.name}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <Wrench className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={2} />
        <span className="truncate opacity-80">{job.jobType}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-1 opacity-70">
        <Clock className="h-3 w-3 shrink-0" strokeWidth={2} />
        <span className="text-[10px]">{durationLabel}</span>
      </div>
    </div>
  );
}
