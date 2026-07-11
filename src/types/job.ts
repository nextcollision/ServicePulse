export type JobStatus =
  | "dispatch"
  | "en-route"
  | "in-progress"
  | "complete"
  | "cancelled";

export interface TaskItem {
  id: string;
  description: string;
  completed: boolean;
}

export interface JobPhoto {
  id: string;
  url: string;
  type: "before" | "after" | "issue";
  timestamp: Date;
  caption?: string;
}

export interface JobMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface JobNote {
  id: string;
  content: string;
  timestamp: Date;
  isPrivate: boolean;
}

export interface ClientInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Job {
  id: string;
  jobNumber: string;
  status: JobStatus;
  scheduledDate: Date;
  scheduledStartTime: string;
  scheduledEndTime: string;
  jobType: string;
  description?: string;
  client: ClientInfo;
  serviceAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    fullAddress: string;
  };
  accessNotes?: string;
  gateCode?: string;
  tasks: TaskItem[];
  photos: JobPhoto[];
  materials: JobMaterial[];
  notes: JobNote[];
  startedAt?: Date;
  completedAt?: Date;
  signature?: string;
  technicianId: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface JobWorkflowState {
  currentStatus: JobStatus;
  elapsedSeconds: number;
  isTimerRunning: boolean;
  completedTasks: string[];
  localPhotos: File[];
  technicianNotes: string;
  signature: string | null;
}

// ---------------------
// Dispatch Command Center types
// ---------------------

/** Status vocabulary used on the admin dispatch board */
export type DispatchStatus =
  | "draft"
  | "scheduled"
  | "en-route"
  | "in-progress"
  | "complete"
  | "cancelled";

/**
 * A flattened view of a Job optimised for grid rendering.
 * `scheduledStart` / `scheduledEnd` are real Date objects so the grid can
 * compute row positions arithmetically rather than parsing "8:00 AM" strings.
 */
export interface DispatchJob {
  id: string;
  jobNumber: string;
  status: DispatchStatus;
  jobType: string;
  description?: string;
  /** Duration in minutes – used to compute block height */
  durationMinutes: number;
  /** ISO Date objects used for grid positioning */
  scheduledStart: Date;
  scheduledEnd: Date;
  client: ClientInfo;
  serviceAddress: Job["serviceAddress"];
  technicianId: string | null;
  accessNotes?: string;
  gateCode?: string;
}

export interface DispatchTechnician {
  id: string;
  name: string;
  phone: string;
  email: string;
  color: string; // Hex color used as the column accent
  avatar?: string;
}

/** Payload returned by the grid when a drop occurs */
export interface DropResult {
  jobId: string;
  technicianId: string;
  /** The Date representing the time-slot the card was dropped onto */
  startTime: Date;
}
