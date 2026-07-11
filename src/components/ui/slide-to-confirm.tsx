"use client";

import * as React from "react";
import { useDrag } from "@use-gesture/react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SlideToConfirmProps {
  onConfirm: () => void;
  label: string;
  confirmLabel?: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "success" | "destructive";
}

export function SlideToConfirm({
  onConfirm,
  label,
  confirmLabel = "Release to confirm",
  className,
  disabled = false,
  variant = "default",
}: SlideToConfirmProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState(0);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const thumbWidth = 64;
  const threshold = 0.85; // 85% of container width to confirm

  React.useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxPosition = containerWidth - thumbWidth - 8; // 8px padding

  const bind = useDrag(
    ({ movement: [mx], last, cancel }) => {
      if (disabled || isConfirmed) {
        cancel();
        return;
      }

      const newPosition = Math.max(0, Math.min(mx, maxPosition));
      setPosition(newPosition);

      if (last) {
        if (newPosition >= maxPosition * threshold) {
          setIsConfirmed(true);
          setPosition(maxPosition);
          onConfirm();
          // Reset after animation
          setTimeout(() => {
            setIsConfirmed(false);
            setPosition(0);
          }, 1000);
        } else {
          setPosition(0);
        }
      }
    },
    {
      axis: "x",
      bounds: { left: 0, right: maxPosition },
      rubberband: false,
    }
  );

  const progress = maxPosition > 0 ? position / maxPosition : 0;
  const isNearConfirm = progress > threshold;

  const variantStyles = {
    default: "bg-primary",
    success: "bg-[#22c55e]",
    destructive: "bg-destructive",
  };

  const thumbVariantStyles = {
    default: "bg-white text-primary",
    success: "bg-white text-[#22c55e]",
    destructive: "bg-white text-destructive",
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-16 rounded-2xl overflow-hidden transition-colors duration-200",
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Background progress indicator */}
      <div
        className="absolute inset-0 bg-white/20 transition-transform duration-100"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left",
        }}
      />

      {/* Label */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-base font-semibold text-white transition-opacity duration-200",
          isNearConfirm ? "opacity-0" : "opacity-100"
        )}
      >
        {label}
        <ChevronRight className="ml-2 h-5 w-5 animate-pulse" strokeWidth={2.5} />
      </div>

      {/* Confirm label */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-base font-semibold text-white transition-opacity duration-200",
          isNearConfirm ? "opacity-100" : "opacity-0"
        )}
      >
        {confirmLabel}
      </div>

      {/* Draggable thumb */}
      <div
        {...bind()}
        className={cn(
          "absolute top-1 left-1 h-14 w-14 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none shadow-lg transition-transform duration-75",
          thumbVariantStyles[variant],
          disabled && "cursor-not-allowed"
        )}
        style={{
          transform: `translateX(${position}px)`,
        }}
      >
        <ChevronRight className="h-7 w-7" strokeWidth={2.5} />
      </div>

      {/* Shimmer effect */}
      {!disabled && !isConfirmed && (
        <div className="absolute inset-0 pointer-events-none animate-shimmer" />
      )}
    </div>
  );
}
