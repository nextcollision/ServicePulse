"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { WifiOff, CloudOff } from "lucide-react";

const RECONNECTED_BANNER_MS = 3000;

function subscribeToConnectivity(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

const getOnlineSnapshot = () => navigator.onLine;
// Server render (and hydration) always assume online. Don't sniff
// `typeof navigator`: Node 21+ defines a global navigator with no onLine,
// which made the server render the offline banner for every visitor.
const getServerOnlineSnapshot = () => true;

export function OfflineIndicator() {
  const isOnline = React.useSyncExternalStore(
    subscribeToConnectivity,
    getOnlineSnapshot,
    getServerOnlineSnapshot,
  );
  const [showReconnected, setShowReconnected] = React.useState(false);

  // Briefly confirm reconnection. setState only runs inside event
  // callbacks, and the timer is cleared if connectivity flips again.
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleOnline = () => {
      clearTimeout(timer);
      setShowReconnected(true);
      timer = setTimeout(() => setShowReconnected(false), RECONNECTED_BANNER_MS);
    };
    const handleOffline = () => {
      clearTimeout(timer);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Derived, so the offline banner can never be hidden while offline.
  const showBanner = !isOnline || showReconnected;
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
