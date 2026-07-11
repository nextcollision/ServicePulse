"use client";

import { MobileLayout } from "@/components/technician/mobile-layout";
import { Map } from "lucide-react";

export default function MapViewPage() {
  return (
    <MobileLayout title="Map View">
      <div className="flex flex-col items-center justify-center h-[60vh] p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Map className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h2 className="font-semibold mb-1">Map View</h2>
        <p className="text-sm text-muted-foreground">
          Interactive map with today&apos;s route coming soon.
        </p>
      </div>
    </MobileLayout>
  );
}
