"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { BottomNavigation } from "./bottom-navigation";
import { OfflineIndicator } from "./offline-indicator";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  headerRight?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function MobileLayout({
  children,
  title,
  showBackButton = false,
  showBottomNav = true,
  headerRight,
  className,
  contentClassName,
}: MobileLayoutProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col",
        // Hide desktop-only elements
        "[&_.desktop-only]:hidden",
        className
      )}
    >
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Header */}
      {(title || showBackButton || headerRight) && (
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border safe-area-top">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-2">
              {showBackButton && (
                <button
                  onClick={() => router.back()}
                  className="flex items-center justify-center h-10 w-10 -ml-2 rounded-full hover:bg-muted transition-colors touch-target"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                </button>
              )}
              {title && (
                <h1 className="text-lg font-semibold truncate">{title}</h1>
              )}
            </div>
            {headerRight && <div className="flex items-center">{headerRight}</div>}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto hide-scrollbar",
          showBottomNav && "pb-20", // Space for bottom navigation
          contentClassName
        )}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
