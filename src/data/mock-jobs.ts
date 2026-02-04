import { Job, Technician } from "@/types/job";

export const currentTechnician: Technician = {
  id: "tech-001",
  name: "Mike Johnson",
  email: "mike.johnson@servicepulse.com",
  phone: "(555) 123-4567",
  avatar: undefined,
};

const today = new Date();
today.setHours(0, 0, 0, 0);

export const mockJobs: Job[] = [
  {
    id: "job-001",
    jobNumber: "WO-2024-0847",
    status: "dispatch",
    scheduledDate: today,
    scheduledStartTime: "8:00 AM",
    scheduledEndTime: "10:00 AM",
    jobType: "Water Heater Flush",
    description: "Annual maintenance flush for tankless water heater",
    client: {
      id: "client-001",
      name: "Sarah Thompson",
      phone: "(555) 234-5678",
      email: "sarah.t@email.com",
    },
    serviceAddress: {
      street: "1234 Oak Street",
      city: "Springfield",
      state: "IL",
      zip: "62701",
      fullAddress: "1234 Oak Street, Springfield, IL 62701",
    },
    accessNotes: "Ring doorbell, dogs are friendly. Park in driveway.",
    gateCode: "4521#",
    tasks: [
      { id: "task-001", description: "Turn off water heater power", completed: false },
      { id: "task-002", description: "Connect flush kit to heater", completed: false },
      { id: "task-003", description: "Run flush cycle (45 min)", completed: false },
      { id: "task-004", description: "Check pressure relief valve", completed: false },
      { id: "task-005", description: "Inspect anode rod condition", completed: false },
      { id: "task-006", description: "Restore power and test operation", completed: false },
    ],
    photos: [],
    materials: [],
    notes: [],
    technicianId: "tech-001",
  },
  {
    id: "job-002",
    jobNumber: "WO-2024-0848",
    status: "dispatch",
    scheduledDate: today,
    scheduledStartTime: "10:30 AM",
    scheduledEndTime: "12:00 PM",
    jobType: "HVAC Filter Replacement",
    description: "Quarterly filter change and system inspection",
    client: {
      id: "client-002",
      name: "Robert Chen",
      phone: "(555) 345-6789",
      email: "rchen@email.com",
    },
    serviceAddress: {
      street: "567 Maple Avenue",
      city: "Springfield",
      state: "IL",
      zip: "62702",
      fullAddress: "567 Maple Avenue, Springfield, IL 62702",
    },
    accessNotes: "Access through side gate, HVAC unit in basement.",
    tasks: [
      { id: "task-007", description: "Replace air filter (20x25x1)", completed: false },
      { id: "task-008", description: "Check refrigerant levels", completed: false },
      { id: "task-009", description: "Clean condenser coils", completed: false },
      { id: "task-010", description: "Test thermostat operation", completed: false },
    ],
    photos: [],
    materials: [],
    notes: [],
    technicianId: "tech-001",
  },
  {
    id: "job-003",
    jobNumber: "WO-2024-0849",
    status: "dispatch",
    scheduledDate: today,
    scheduledStartTime: "1:00 PM",
    scheduledEndTime: "3:00 PM",
    jobType: "Garbage Disposal Install",
    description: "Remove old disposal, install new InSinkErator Evolution",
    client: {
      id: "client-003",
      name: "Maria Garcia",
      phone: "(555) 456-7890",
      email: "mgarcia@email.com",
    },
    serviceAddress: {
      street: "890 Pine Road",
      city: "Springfield",
      state: "IL",
      zip: "62703",
      fullAddress: "890 Pine Road, Springfield, IL 62703",
    },
    accessNotes: "Customer works from home, will be available. Use front door.",
    tasks: [
      { id: "task-011", description: "Disconnect old disposal", completed: false },
      { id: "task-012", description: "Remove mounting assembly", completed: false },
      { id: "task-013", description: "Install new mounting ring", completed: false },
      { id: "task-014", description: "Connect new disposal unit", completed: false },
      { id: "task-015", description: "Test for leaks", completed: false },
      { id: "task-016", description: "Demonstrate operation to customer", completed: false },
    ],
    photos: [],
    materials: [
      { id: "mat-001", name: "InSinkErator Evolution Compact", quantity: 1, unit: "unit", unitCost: 199.99 },
      { id: "mat-002", name: "Plumber's Putty", quantity: 1, unit: "container", unitCost: 4.99 },
    ],
    notes: [],
    technicianId: "tech-001",
  },
  {
    id: "job-004",
    jobNumber: "WO-2024-0850",
    status: "dispatch",
    scheduledDate: today,
    scheduledStartTime: "3:30 PM",
    scheduledEndTime: "5:00 PM",
    jobType: "Toilet Repair",
    description: "Running toilet, likely flapper or fill valve issue",
    client: {
      id: "client-004",
      name: "James Wilson",
      phone: "(555) 567-8901",
    },
    serviceAddress: {
      street: "2345 Elm Drive",
      city: "Springfield",
      state: "IL",
      zip: "62704",
      fullAddress: "2345 Elm Drive, Springfield, IL 62704",
    },
    accessNotes: "Upstairs bathroom, second door on the left.",
    tasks: [
      { id: "task-017", description: "Diagnose running toilet issue", completed: false },
      { id: "task-018", description: "Replace flapper if needed", completed: false },
      { id: "task-019", description: "Replace fill valve if needed", completed: false },
      { id: "task-020", description: "Adjust water level", completed: false },
      { id: "task-021", description: "Test flush operation", completed: false },
    ],
    photos: [],
    materials: [],
    notes: [],
    technicianId: "tech-001",
  },
  {
    id: "job-005",
    jobNumber: "WO-2024-0851",
    status: "complete",
    scheduledDate: today,
    scheduledStartTime: "7:00 AM",
    scheduledEndTime: "7:30 AM",
    jobType: "Emergency Call - Gas Smell",
    description: "Customer reported gas smell near water heater",
    client: {
      id: "client-005",
      name: "Patricia Adams",
      phone: "(555) 678-9012",
    },
    serviceAddress: {
      street: "678 Birch Lane",
      city: "Springfield",
      state: "IL",
      zip: "62705",
      fullAddress: "678 Birch Lane, Springfield, IL 62705",
    },
    accessNotes: "Emergency - customer was instructed to leave windows open.",
    tasks: [
      { id: "task-022", description: "Check for gas leaks with detector", completed: true },
      { id: "task-023", description: "Inspect pilot light and burner", completed: true },
      { id: "task-024", description: "Tighten gas line connections", completed: true },
      { id: "task-025", description: "Verify safe operation", completed: true },
    ],
    photos: [],
    materials: [],
    notes: [
      {
        id: "note-001",
        content: "Found loose connection at gas flex line. Tightened and tested - no leaks detected.",
        timestamp: new Date(today.getTime() + 7 * 60 * 60 * 1000 + 25 * 60 * 1000),
        isPrivate: false,
      },
    ],
    startedAt: new Date(today.getTime() + 7 * 60 * 60 * 1000),
    completedAt: new Date(today.getTime() + 7 * 60 * 60 * 1000 + 28 * 60 * 1000),
    signature: "data:image/png;base64,mockSignatureData",
    technicianId: "tech-001",
  },
];

export function getJobById(id: string): Job | undefined {
  return mockJobs.find((job) => job.id === id);
}

export function getTodaysJobs(technicianId: string): Job[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return mockJobs
    .filter((job) => {
      const jobDate = new Date(job.scheduledDate);
      jobDate.setHours(0, 0, 0, 0);
      return job.technicianId === technicianId && jobDate.getTime() === today.getTime();
    })
    .sort((a, b) => {
      const timeA = parseTime(a.scheduledStartTime);
      const timeB = parseTime(b.scheduledStartTime);
      return timeA - timeB;
    });
}

function parseTime(timeStr: string): number {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let hour24 = hours;
  if (period === "PM" && hours !== 12) hour24 += 12;
  if (period === "AM" && hours === 12) hour24 = 0;
  return hour24 * 60 + minutes;
}

export function updateJobStatus(jobId: string, status: Job["status"]): Job | undefined {
  const job = mockJobs.find((j) => j.id === jobId);
  if (job) {
    job.status = status;
    if (status === "in-progress" && !job.startedAt) {
      job.startedAt = new Date();
    }
    if (status === "complete" && !job.completedAt) {
      job.completedAt = new Date();
    }
  }
  return job;
}

export function toggleTaskCompletion(jobId: string, taskId: string): Job | undefined {
  const job = mockJobs.find((j) => j.id === jobId);
  if (job) {
    const task = job.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
  }
  return job;
}
