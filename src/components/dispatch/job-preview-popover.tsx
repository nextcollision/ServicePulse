"use client";

import * as React from "react";
import Link from "next/link";
import { formatPhoneNumber } from "@/lib/utils";
import { DispatchJob, DispatchStatus } from "@/types/job";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  KeyRound,
  X,
} from "lucide-react";

interface JobPreviewPopoverProps {
  job: DispatchJob;
  onClose: () => void;
  onStatusChange?: (jobId: string, status: DispatchStatus) => void;
  /** Anchor position (top-left corner of popover) */
  position: { x: number; y: number };
}

const statusOptions: { value: DispatchStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "en-route", label: "En Route" },
  { value: "in-progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
  { value: "cancelled", label: "Cancelled" },
];

export function JobPreviewPopover({
  job,
  onClose,
  onStatusChange,
  position,
}: JobPreviewPopoverProps) {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const hours = Math.floor(job.durationMinutes / 60);
  const mins = job.durationMinutes % 60;
  const durationLabel =
    hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="fixed z-[60] w-[320px] rounded-xl border bg-card text-card-foreground shadow-2xl"
      style={{ top: position.y, left: position.x }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4 pb-2">
        <div className="min-w-0">
          <p className="font-semibold truncate">{job.client.name}</p>
          <p className="text-xs text-muted-foreground">{job.jobNumber}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded-full p-1 hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 pb-3 space-y-3">
        {/* Job type + duration */}
        <div>
          <p className="text-sm font-medium">{job.jobType}</p>
          {job.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{job.description}</p>
          )}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{durationLabel}</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" strokeWidth={2} />
          <span>{job.serviceAddress.fullAddress}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-1.5 text-xs">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
          <a
            href={`tel:${job.client.phone}`}
            className="text-primary hover:underline"
          >
            {formatPhoneNumber(job.client.phone)}
          </a>
        </div>

        {/* Gate code */}
        {job.gateCode && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <KeyRound className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="font-mono font-semibold">{job.gateCode}</span>
          </div>
        )}

        {/* Status change */}
        <div className="pt-1">
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Status
          </label>
          <select
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={job.status}
            onChange={(e) =>
              onStatusChange?.(job.id, e.target.value as DispatchStatus)
            }
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-3">
        <Link href={`/technician/job/${job.id}`}>
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            View Full Record
          </Button>
        </Link>
      </div>
    </div>
  );
}
