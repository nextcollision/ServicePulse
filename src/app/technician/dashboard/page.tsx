"use client";

import * as React from "react";
import { MobileLayout } from "@/components/technician/mobile-layout";
import { JobCard } from "@/components/technician/job-card";
import { getTodaysJobs, currentTechnician } from "@/data/mock-jobs";
import { Job } from "@/types/job";
import { Calendar, RefreshCw, Sun, Sunset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getGreeting(): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { text: "Good morning", icon: <Sun className="h-5 w-5" strokeWidth={2} /> };
  } else if (hour < 17) {
    return { text: "Good afternoon", icon: <Sun className="h-5 w-5" strokeWidth={2} /> };
  } else {
    return { text: "Good evening", icon: <Sunset className="h-5 w-5" strokeWidth={2} /> };
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function TechnicianDashboard() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const greeting = getGreeting();
  const today = new Date();

  const loadJobs = React.useCallback(() => {
    const todaysJobs = getTodaysJobs(currentTechnician.id);
    setJobs(todaysJobs);
  }, []);

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    loadJobs();
    setIsRefreshing(false);
  };

  const pendingJobs = jobs.filter(
    (job) => job.status !== "complete" && job.status !== "cancelled"
  );
  const completedJobs = jobs.filter((job) => job.status === "complete");

  return (
    <MobileLayout
      headerRight={
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh jobs"
        >
          <RefreshCw
            className={cn("h-5 w-5", isRefreshing && "animate-spin")}
            strokeWidth={2}
          />
        </Button>
      }
    >
      <div className="p-4 space-y-6">
        {/* Welcome Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            {greeting.icon}
            <span className="text-sm font-medium">{greeting.text}</span>
          </div>
          <h1 className="text-2xl font-bold">{currentTechnician.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" strokeWidth={2} />
            <span className="text-sm">{formatDate(today)}</span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-xl p-4">
            <p className="text-3xl font-bold text-primary">{pendingJobs.length}</p>
            <p className="text-sm text-muted-foreground">Jobs Remaining</p>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4">
            <p className="text-3xl font-bold text-green-600">{completedJobs.length}</p>
            <p className="text-sm text-muted-foreground">Completed Today</p>
          </div>
        </div>

        {/* Today's Route Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today&apos;s Route</h2>
            <span className="text-sm text-muted-foreground">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
            </span>
          </div>

          {/* Job Cards Feed */}
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold mb-1">No jobs scheduled</h3>
              <p className="text-sm text-muted-foreground">
                You don&apos;t have any jobs scheduled for today.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pending Jobs */}
              {pendingJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {/* Completed Jobs Section */}
              {completedJobs.length > 0 && (
                <>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Completed
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  {completedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
