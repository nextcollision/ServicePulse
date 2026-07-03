"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { WifiOff, CloudOff } from "lucide-react";

function getInitialOnlineState(): boolean {
  // navigator is unavailable during SSR/static generation; assume online
  // until the client mounts and the effect below corrects it if needed.
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = React.useState(getInitialOnlineState);
  const [showBanner, setShowBanner] = React.useState(() => !getInitialOnlineState());

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show "back online" message briefly
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 safe-area-top transition-all duration-300",
        showBanner ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium",
          isOnline
            ? "bg-green-500 text-white"
            : "bg-amber-500 text-white animate-pulse-amber"
        )}
      >
        {isOnline ? (
          <>
            <CloudOff className="h-4 w-4" strokeWidth={2.5} />
            <span>Back online - syncing data...</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" strokeWidth={2.5} />
            <span>No connection - data saved locally</span>
          </>
        )}
      </div>
    </div>
  );
}
