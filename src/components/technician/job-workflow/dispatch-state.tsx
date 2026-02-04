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
  User,
} from "lucide-react";

interface DispatchStateProps {
  job: Job;
  onEnRoute: () => void;
}

export function DispatchState({ job, onEnRoute }: DispatchStateProps) {
  const handleCallClient = () => {
    window.location.href = `tel:${job.client.phone}`;
  };

  const handleNavigate = () => {
    openMapsApp(job.serviceAddress.fullAddress);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Client Info Card */}
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-primary" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{job.client.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatPhoneNumber(job.client.phone)}
                </p>
              </div>
            </div>

            {/* Call Client Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2"
              onClick={handleCallClient}
            >
              <Phone className="h-5 w-5" strokeWidth={2.5} />
              Call Client
            </Button>
          </CardContent>
        </Card>

        {/* Address Card with Navigate */}
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
              <div>
                <p className="font-medium">{job.serviceAddress.street}</p>
                <p className="text-sm text-muted-foreground">
                  {job.serviceAddress.city}, {job.serviceAddress.state}{" "}
                  {job.serviceAddress.zip}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full gap-2"
              onClick={handleNavigate}
            >
              <Navigation className="h-5 w-5" strokeWidth={2.5} />
              Navigate
            </Button>
          </CardContent>
        </Card>

        {/* Need to Know Section */}
        {(job.gateCode || job.accessNotes) && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" strokeWidth={2.5} />
                <h3 className="font-semibold">Need to Know</h3>
              </div>

              {/* Gate Code */}
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

              {/* Access Notes */}
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
          label="Slide to start route"
          confirmLabel="Starting route..."
          onConfirm={onEnRoute}
          variant="default"
        />
      </div>
    </div>
  );
}
