"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Job, JobStatus, JobMaterial } from "@/types/job";
import { DispatchState } from "./dispatch-state";
import { InProgressState } from "./in-progress-state";
import { CompletionState } from "./completion-state";
import { EnRouteState } from "./en-route-state";
import { updateJobStatus, toggleTaskCompletion } from "@/data/mock-jobs";

interface JobWorkflowProps {
  job: Job;
}

type WorkflowStatus = JobStatus;

export function JobWorkflow({ job: initialJob }: JobWorkflowProps) {
  const router = useRouter();
  const [job, setJob] = React.useState(initialJob);
  const [workflowStatus, setWorkflowStatus] = React.useState<WorkflowStatus>(
    initialJob.status
  );
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const [completedTaskIds, setCompletedTaskIds] = React.useState<string[]>(
    initialJob.tasks.filter((t) => t.completed).map((t) => t.id)
  );
  const [localPhotos, setLocalPhotos] = React.useState<File[]>([]);
  const [technicianNotes, setTechnicianNotes] = React.useState("");
  const [signature, setSignature] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Calculate elapsed time if job was already started
  React.useEffect(() => {
    if (initialJob.startedAt && !initialJob.completedAt) {
      const startTime = new Date(initialJob.startedAt).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);
      setIsTimerRunning(true);
    }
  }, [initialJob.startedAt, initialJob.completedAt]);

  const handleEnRoute = () => {
    setWorkflowStatus("en-route");
    updateJobStatus(job.id, "en-route");
    setJob((prev) => ({ ...prev, status: "en-route" }));
  };

  const handleArrived = () => {
    setWorkflowStatus("in-progress");
    updateJobStatus(job.id, "in-progress");
    setJob((prev) => ({
      ...prev,
      status: "in-progress",
      startedAt: new Date(),
    }));
    setIsTimerRunning(true);
  };

  const handleTaskToggle = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId);
      }
      return [...prev, taskId];
    });
    toggleTaskCompletion(job.id, taskId);
  };

  const handleAddPhoto = (file: File) => {
    setLocalPhotos((prev) => [...prev, file]);
  };

  const handleRemovePhoto = (index: number) => {
    setLocalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    setIsTimerRunning(false);
    setWorkflowStatus("complete");
  };

  const handleFinishAndSync = async () => {
    setIsSubmitting(true);

    // Simulate sync delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update job status
    updateJobStatus(job.id, "complete");

    // In a real app, we would:
    // 1. Upload photos
    // 2. Save signature
    // 3. Save notes
    // 4. Update job status on server

    setIsSubmitting(false);

    // Navigate back to dashboard
    router.push("/technician/dashboard");
  };

  // Get materials used from job
  const materialsUsed: JobMaterial[] = job.materials;

  // Render appropriate state
  switch (workflowStatus) {
    case "dispatch":
      return <DispatchState job={job} onEnRoute={handleEnRoute} />;

    case "en-route":
      return <EnRouteState job={job} onArrived={handleArrived} />;

    case "in-progress":
      return (
        <InProgressState
          job={job}
          elapsedSeconds={elapsedSeconds}
          completedTaskIds={completedTaskIds}
          localPhotos={localPhotos}
          technicianNotes={technicianNotes}
          onTaskToggle={handleTaskToggle}
          onAddPhoto={handleAddPhoto}
          onRemovePhoto={handleRemovePhoto}
          onNotesChange={setTechnicianNotes}
          onComplete={handleComplete}
        />
      );

    case "complete":
      return (
        <CompletionState
          job={job}
          elapsedSeconds={elapsedSeconds}
          materialsUsed={materialsUsed}
          signature={signature}
          onSignatureChange={setSignature}
          onFinishAndSync={handleFinishAndSync}
          isSubmitting={isSubmitting}
        />
      );

    case "cancelled":
      return (
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-destructive">
              This job has been cancelled
            </p>
            <button
              onClick={() => router.push("/technician/dashboard")}
              className="mt-4 text-primary underline"
            >
              Return to dashboard
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
