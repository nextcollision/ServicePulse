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
