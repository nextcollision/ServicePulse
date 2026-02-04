"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { ROW_HEIGHT_PX } from "./grid-constants";

interface DroppableTimeSlotProps {
  /** Unique id: "slot-<techId>-<slotIndex>" */
  id: string;
  /** Data carried by this droppable so onDrop can decode it */
  technicianId: string;
  slotIndex: number;
  isEvenHour: boolean;
  children?: React.ReactNode;
}

export function DroppableTimeSlot({
  id,
  technicianId,
  slotIndex,
  isEvenHour,
  children,
}: DroppableTimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { technicianId, slotIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative border-b border-r border-border/60 transition-colors",
        isEvenHour ? "bg-background" : "bg-muted/30",
        isOver && "bg-primary/10 ring-2 ring-inset ring-primary/40",
      )}
      style={{ minHeight: ROW_HEIGHT_PX }}
    >
      {children}
    </div>
  );
}
