"use client";

import * as React from "react";
import Link from "next/link";
import { cn, openMapsApp } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job, JobStatus } from "@/types/job";
import {
  Clock,
  MapPin,
  User,
  Wrench,
  Navigation,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  className?: string;
}

const statusLabels: Record<JobStatus, string> = {
  dispatch: "Scheduled",
  "en-route": "En Route",
  "in-progress": "In Progress",
  complete: "Completed",
  cancelled: "Cancelled",
};

export function JobCard({ job, className }: JobCardProps) {
  const handleOpenMaps = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openMapsApp(job.serviceAddress.fullAddress);
  };

  const isCompleted = job.status === "complete";
  const isCancelled = job.status === "cancelled";

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.99]",
        isCompleted && "opacity-75",
        isCancelled && "opacity-50",
        className
      )}
    >
      {/* Header with time slot and status */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-sm font-medium">
              {job.scheduledStartTime} - {job.scheduledEndTime}
            </span>
          </div>
          <Badge variant={job.status}>
            {isCompleted && (
              <CheckCircle2 className="h-3 w-3 mr-1" strokeWidth={2.5} />
            )}
            {statusLabels[job.status]}
          </Badge>
        </div>
      </CardHeader>

      {/* Body with job details */}
      <CardContent className="space-y-3">
        {/* Client Name */}
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
          <div>
            <p className="font-semibold text-foreground">{job.client.name}</p>
            <p className="text-xs text-muted-foreground">{job.jobNumber}</p>
          </div>
        </div>

        {/* Job Type */}
        <div className="flex items-start gap-3">
          <Wrench className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
          <div>
            <p className="font-medium text-foreground">{job.jobType}</p>
            {job.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
            )}
          </div>
        </div>

        {/* Service Address */}
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-sm text-muted-foreground">
            {job.serviceAddress.street}
            <br />
            {job.serviceAddress.city}, {job.serviceAddress.state}{" "}
            {job.serviceAddress.zip}
          </p>
        </div>
      </CardContent>

      {/* Footer with actions */}
      <CardFooter className="gap-3 pt-2">
        {/* Navigate Button */}
        <Button
          variant="outline"
          size="icon-lg"
          onClick={handleOpenMaps}
          className="shrink-0"
          aria-label="Open in Maps"
        >
          <Navigation className="h-6 w-6" strokeWidth={2} />
        </Button>

        {/* View Job Button */}
        <Link href={`/technician/job/${job.id}`} className="flex-1">
          <Button
            className="w-full gap-2"
            variant={isCompleted ? "secondary" : "default"}
            size="lg"
          >
            {isCompleted ? "View Details" : "View Job"}
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
