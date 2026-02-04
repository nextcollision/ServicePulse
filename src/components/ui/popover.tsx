"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Context ────────────────────────────────

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerNodeRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

function usePopover() {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error("usePopover must be used inside <Popover>");
  return ctx;
}

// ─── Root ───────────────────────────────────

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Popover({ open: controlledOpen, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerNodeRef = React.useRef<HTMLButtonElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerNodeRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

// ─── Trigger ────────────────────────────────

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, children, ...props }, ref) => {
  const { open, setOpen, triggerNodeRef } = usePopover();

  const handleRef = (node: HTMLButtonElement | null) => {
    triggerNodeRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <button
      ref={handleRef}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

// ─── Content ────────────────────────────────

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, side = "bottom", align = "center", sideOffset = 8, children, ...props }, ref) => {
    const { open, setOpen } = usePopover();
    const contentNodeRef = React.useRef<HTMLDivElement>(null);

    // Close on outside click
    React.useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (contentNodeRef.current && !contentNodeRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      const id = setTimeout(() => document.addEventListener("mousedown", handler), 0);
      return () => {
        clearTimeout(id);
        document.removeEventListener("mousedown", handler);
      };
    }, [open, setOpen]);

    // Close on Escape
    React.useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, setOpen]);

    if (!open) return null;

    const posClasses: Record<string, string> = {
      top: "bottom-full mb-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
      right: "left-full ml-2",
    };
    const alignClasses: Record<string, string> = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0",
    };

    return (
      <div
        ref={(node) => {
          contentNodeRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "absolute z-50 min-w-[220px] rounded-xl border bg-card text-card-foreground shadow-xl",
          posClasses[side],
          (side === "top" || side === "bottom") && alignClasses[align],
          className,
        )}
        style={{
          marginTop: side === "bottom" ? sideOffset : undefined,
          marginBottom: side === "top" ? sideOffset : undefined,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
