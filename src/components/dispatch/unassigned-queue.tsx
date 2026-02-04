"use client";

import * as React from "react";
import { DispatchJob } from "@/types/job";
import { UnassignedCard } from "./unassigned-card";
import { Search, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnassignedQueueProps {
  jobs: DispatchJob[];
}

export function UnassignedQueue({ jobs }: UnassignedQueueProps) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.client.name.toLowerCase().includes(q) ||
        j.jobType.toLowerCase().includes(q) ||
        j.jobNumber.toLowerCase().includes(q),
    );
  }, [jobs, search]);

  return (
    <aside className="flex flex-col h-full border-r border-border bg-muted/30">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Unassigned Jobs
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} awaiting dispatch
        </p>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={2} />
          <input
            type="text"
            placeholder="Filter by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full rounded-lg border border-input bg-background pl-8 pr-3 py-2 text-sm",
              "placeholder:text-muted-foreground/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          />
        </div>
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Inbox className="h-10 w-10 mb-2 opacity-40" strokeWidth={1.5} />
            <p className="text-sm font-medium">
              {search ? "No matching jobs" : "All jobs assigned"}
            </p>
          </div>
        ) : (
          filtered.map((job) => <UnassignedCard key={job.id} job={job} />)
        )}
      </div>
    </aside>
  );
}
