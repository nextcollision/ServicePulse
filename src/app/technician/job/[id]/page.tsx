"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { MobileLayout } from "@/components/technician/mobile-layout";
import { JobWorkflow } from "@/components/technician/job-workflow";
import { getUnifiedJobById } from "@/data/job-lookup";
import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const statusLabels: Record<Job["status"], string> = {
  dispatch: "Scheduled",
  "en-route": "En Route",
  "in-progress": "In Progress",
  complete: "Completed",
  cancelled: "Cancelled",
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = React.useState<Job | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const jobId = params.id as string;
    const foundJob = getUnifiedJobById(jobId);

    if (foundJob) {
      setJob(foundJob);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <MobileLayout showBackButton showBottomNav={false}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" strokeWidth={2} />
        </div>
      </MobileLayout>
    );
  }

  if (!job) {
    return (
      <MobileLayout title="Job Not Found" showBackButton showBottomNav={false}>
        <div className="flex flex-col items-center justify-center h-[60vh] p-4 text-center">
          <p className="text-lg font-semibold mb-2">Job not found</p>
          <p className="text-muted-foreground mb-4">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/technician/dashboard")}
            className="text-primary underline"
          >
            Return to dashboard
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      title={job.jobType}
      showBackButton
      showBottomNav={false}
      headerRight={<Badge variant={job.status}>{statusLabels[job.status]}</Badge>}
      contentClassName="p-0"
    >
      <JobWorkflow job={job} />
    </MobileLayout>
  );
}
