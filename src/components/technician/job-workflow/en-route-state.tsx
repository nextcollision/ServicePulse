"use client";

import * as React from "react";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { openMapsApp, formatPhoneNumber } from "@/lib/utils";
import {
  Phone,
  Navigation,
  KeyRound,
  AlertCircle,
  MapPin,
  Car,
} from "lucide-react";

interface EnRouteStateProps {
  job: Job;
  onArrived: () => void;
}

export function EnRouteState({ job, onArrived }: EnRouteStateProps) {
  const handleCallClient = () => {
    window.location.href = `tel:${job.client.phone}`;
  };

  const handleNavigate = () => {
    openMapsApp(job.serviceAddress.fullAddress);
  };

  return (
    <div className="flex flex-col h-full">
      {/* En Route Banner */}
      <div className="bg-blue-500 text-white py-4 px-4">
        <div className="flex items-center justify-center gap-2">
          <Car className="h-6 w-6 animate-pulse" strokeWidth={2.5} />
          <span className="font-semibold text-lg">En Route to Job</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Destination Card */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" strokeWidth={2.5} />
              <div>
                <p className="font-semibold">{job.serviceAddress.street}</p>
                <p className="text-sm text-muted-foreground">
                  {job.serviceAddress.city}, {job.serviceAddress.state}{" "}
                  {job.serviceAddress.zip}
                </p>
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleNavigate}
            >
              <Navigation className="h-5 w-5" strokeWidth={2.5} />
              Open Navigation
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="pt-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2"
              onClick={handleCallClient}
            >
              <Phone className="h-5 w-5" strokeWidth={2.5} />
              Call {job.client.name}
            </Button>
          </CardContent>
        </Card>

        {/* Need to Know - Reminder */}
        {(job.gateCode || job.accessNotes) && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" strokeWidth={2.5} />
                <h3 className="font-semibold">Arrival Reminder</h3>
              </div>

              {job.gateCode && (
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded-lg">
                  <KeyRound className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={2} />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Gate Code
                    </p>
                    <p className="font-mono font-bold text-lg">{job.gateCode}</p>
                  </div>
                </div>
              )}

              {job.accessNotes && (
                <div className="p-3 bg-white dark:bg-background rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Access Notes
                  </p>
                  <p className="text-sm">{job.accessNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sticky Footer with Slide to Confirm */}
      <div className="sticky bottom-0 p-4 bg-background border-t border-border safe-area-bottom">
        <SlideToConfirm
          label="Slide when you arrive"
          confirmLabel="Starting job..."
          onConfirm={onArrived}
          variant="success"
        />
      </div>
    </div>
  );
}
