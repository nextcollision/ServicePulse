"use client";

import * as React from "react";
import { Job, JobMaterial } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignaturePad } from "@/components/technician/signature-pad";
import { formatTime } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  Package,
  DollarSign,
  RotateCcw,
  Send,
  Loader2,
} from "lucide-react";

interface CompletionStateProps {
  job: Job;
  elapsedSeconds: number;
  materialsUsed: JobMaterial[];
  signature: string | null;
  onSignatureChange: (signature: string | null) => void;
  onFinishAndSync: () => void;
  isSubmitting?: boolean;
}

export function CompletionState({
  job,
  elapsedSeconds,
  materialsUsed,
  signature,
  onSignatureChange,
  onFinishAndSync,
  isSubmitting = false,
}: CompletionStateProps) {
  const [signatureKey, setSignatureKey] = React.useState(0);

  const handleClearSignature = () => {
    onSignatureChange(null);
    setSignatureKey((prev) => prev + 1);
  };

  const totalMaterialsCost = materialsUsed.reduce(
    (sum, material) => sum + material.quantity * material.unitCost,
    0
  );

  const canSubmit = signature !== null;

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Success Header */}
        <div className="text-center py-4">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold">Job Complete!</h2>
          <p className="text-muted-foreground">Please review and collect signature</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Time Worked */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" strokeWidth={2.5} />
                <span className="text-xs uppercase tracking-wider">Time Worked</span>
              </div>
              <p className="text-2xl font-bold font-mono">
                {formatTime(elapsedSeconds)}
              </p>
            </CardContent>
          </Card>

          {/* Tasks Completed */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                <span className="text-xs uppercase tracking-wider">Tasks</span>
              </div>
              <p className="text-2xl font-bold">
                {job.tasks.filter((t) => t.completed).length}/{job.tasks.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Materials Used */}
        {materialsUsed.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-5 w-5" strokeWidth={2} />
                Materials Used
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {materialsUsed.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {material.name} x{material.quantity}
                  </span>
                  <span className="font-medium">
                    ${(material.quantity * material.unitCost).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-4 w-4" strokeWidth={2.5} />
                  <span className="text-sm">Total Materials</span>
                </div>
                <span className="font-bold">
                  ${totalMaterialsCost.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signature Pad */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Customer Signature</CardTitle>
              {signature && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSignature}
                  className="gap-1 text-muted-foreground"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <SignaturePad
              key={signatureKey}
              onSignatureChange={onSignatureChange}
              className="border-2 border-dashed border-muted-foreground/30 rounded-xl"
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Sign above to confirm job completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 p-4 bg-background border-t border-border safe-area-bottom">
        <Button
          size="xl"
          variant="success"
          className="w-full gap-2"
          onClick={onFinishAndSync}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.5} />
              Syncing...
            </>
          ) : (
            <>
              <Send className="h-6 w-6" strokeWidth={2.5} />
              Finish & Sync
            </>
          )}
        </Button>
        {!canSubmit && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Customer signature required to complete
          </p>
        )}
      </div>
    </div>
  );
}
