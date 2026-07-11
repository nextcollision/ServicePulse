import { DispatchJob, DispatchTechnician } from "@/types/job";
import { setHours, setMinutes, addMinutes } from "date-fns";

// ───────────────────────────────────────────
// Technicians
// ───────────────────────────────────────────

export const dispatchTechnicians: DispatchTechnician[] = [
  {
    id: "tech-001",
    name: "Mike Johnson",
    phone: "(555) 123-4567",
    email: "mike.johnson@servicepulse.com",
    color: "#3b82f6", // blue
  },
  {
    id: "tech-002",
    name: "Lisa Park",
    phone: "(555) 234-5678",
    email: "lisa.park@servicepulse.com",
    color: "#8b5cf6", // violet
  },
  {
    id: "tech-003",
    name: "Carlos Rivera",
    phone: "(555) 345-6789",
    email: "carlos.rivera@servicepulse.com",
    color: "#059669", // emerald
  },
  {
    id: "tech-004",
    name: "Dana Osei",
    phone: "(555) 456-7890",
    email: "dana.osei@servicepulse.com",
    color: "#d97706", // amber
  },
];

// ───────────────────────────────────────────
// Helper – build a Date for "today at HH:MM"
// ───────────────────────────────────────────

function todayAt(hour: number, minute: number = 0): Date {
  // Compute "today" at call time rather than module load, so the mock data
  // doesn't go stale on a long-running server that crosses midnight.
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return setMinutes(setHours(d, hour), minute);
}

// ───────────────────────────────────────────
// Scheduled jobs (already on the grid)
// ───────────────────────────────────────────

export const scheduledJobs: DispatchJob[] = [
  // ── Mike Johnson ──
  {
    id: "dj-001",
    jobNumber: "WO-2024-0847",
    status: "scheduled",
    jobType: "Water Heater Flush",
    description: "Annual maintenance flush for tankless water heater",
    durationMinutes: 120,
    scheduledStart: todayAt(8, 0),
    scheduledEnd: todayAt(10, 0),
    client: { id: "c-001", name: "Sarah Thompson", phone: "(555) 234-5678", email: "sarah.t@email.com" },
    serviceAddress: { street: "1234 Oak Street", city: "Springfield", state: "IL", zip: "62701", fullAddress: "1234 Oak Street, Springfield, IL 62701" },
    technicianId: "tech-001",
    accessNotes: "Ring doorbell, dogs are friendly. Park in driveway.",
    gateCode: "4521#",
  },
  {
    id: "dj-002",
    jobNumber: "WO-2024-0848",
    status: "scheduled",
    jobType: "HVAC Filter Replacement",
    description: "Quarterly filter change and system inspection",
    durationMinutes: 90,
    scheduledStart: todayAt(10, 30),
    scheduledEnd: todayAt(12, 0),
    client: { id: "c-002", name: "Robert Chen", phone: "(555) 345-6789", email: "rchen@email.com" },
    serviceAddress: { street: "567 Maple Avenue", city: "Springfield", state: "IL", zip: "62702", fullAddress: "567 Maple Avenue, Springfield, IL 62702" },
    technicianId: "tech-001",
    accessNotes: "Access through side gate, HVAC unit in basement.",
  },
  {
    id: "dj-003",
    jobNumber: "WO-2024-0849",
    status: "in-progress",
    jobType: "Garbage Disposal Install",
    description: "Remove old disposal, install new InSinkErator Evolution",
    durationMinutes: 120,
    scheduledStart: todayAt(13, 0),
    scheduledEnd: todayAt(15, 0),
    client: { id: "c-003", name: "Maria Garcia", phone: "(555) 456-7890", email: "mgarcia@email.com" },
    serviceAddress: { street: "890 Pine Road", city: "Springfield", state: "IL", zip: "62703", fullAddress: "890 Pine Road, Springfield, IL 62703" },
    technicianId: "tech-001",
    accessNotes: "Customer works from home, will be available.",
  },
  // ── Lisa Park ──
  {
    id: "dj-004",
    jobNumber: "WO-2024-0852",
    status: "scheduled",
    jobType: "AC Tune-Up",
    description: "Seasonal AC maintenance and refrigerant check",
    durationMinutes: 90,
    scheduledStart: todayAt(8, 0),
    scheduledEnd: todayAt(9, 30),
    client: { id: "c-006", name: "Kevin Ng", phone: "(555) 111-2222" },
    serviceAddress: { street: "422 Cedar Blvd", city: "Springfield", state: "IL", zip: "62706", fullAddress: "422 Cedar Blvd, Springfield, IL 62706" },
    technicianId: "tech-002",
  },
  {
    id: "dj-005",
    jobNumber: "WO-2024-0853",
    status: "complete",
    jobType: "Thermostat Install",
    description: "Install Nest Learning Thermostat 4th gen",
    durationMinutes: 60,
    scheduledStart: todayAt(10, 0),
    scheduledEnd: todayAt(11, 0),
    client: { id: "c-007", name: "Amy Walsh", phone: "(555) 222-3333", email: "awalsh@email.com" },
    serviceAddress: { street: "88 Birch Court", city: "Springfield", state: "IL", zip: "62707", fullAddress: "88 Birch Court, Springfield, IL 62707" },
    technicianId: "tech-002",
  },
  {
    id: "dj-006",
    jobNumber: "WO-2024-0854",
    status: "scheduled",
    jobType: "Duct Inspection",
    description: "Annual ductwork inspection and leak test",
    durationMinutes: 120,
    scheduledStart: todayAt(12, 0),
    scheduledEnd: todayAt(14, 0),
    client: { id: "c-008", name: "Tom Bradley", phone: "(555) 333-4444" },
    serviceAddress: { street: "1600 Spruce Way", city: "Springfield", state: "IL", zip: "62708", fullAddress: "1600 Spruce Way, Springfield, IL 62708" },
    technicianId: "tech-002",
  },
  // ── Carlos Rivera ──
  {
    id: "dj-007",
    jobNumber: "WO-2024-0855",
    status: "en-route",
    jobType: "Sump Pump Replace",
    description: "Replace failed sump pump with Zoeller M53",
    durationMinutes: 150,
    scheduledStart: todayAt(7, 30),
    scheduledEnd: todayAt(10, 0),
    client: { id: "c-009", name: "Diana Ross", phone: "(555) 444-5555" },
    serviceAddress: { street: "710 Willow Lane", city: "Springfield", state: "IL", zip: "62709", fullAddress: "710 Willow Lane, Springfield, IL 62709" },
    technicianId: "tech-003",
    gateCode: "7890",
  },
  {
    id: "dj-008",
    jobNumber: "WO-2024-0856",
    status: "scheduled",
    jobType: "Water Softener Service",
    description: "Annual resin bed cleaning and salt refill",
    durationMinutes: 60,
    scheduledStart: todayAt(11, 0),
    scheduledEnd: todayAt(12, 0),
    client: { id: "c-010", name: "Greg Stein", phone: "(555) 555-6666", email: "gstein@email.com" },
    serviceAddress: { street: "309 Aspen Drive", city: "Springfield", state: "IL", zip: "62710", fullAddress: "309 Aspen Drive, Springfield, IL 62710" },
    technicianId: "tech-003",
  },
  // ── Dana Osei ──
  {
    id: "dj-009",
    jobNumber: "WO-2024-0857",
    status: "scheduled",
    jobType: "Tankless WH Install",
    description: "Install Rinnai RU199iN tankless water heater",
    durationMinutes: 240,
    scheduledStart: todayAt(8, 0),
    scheduledEnd: todayAt(12, 0),
    client: { id: "c-011", name: "Priya Mehta", phone: "(555) 666-7777", email: "pmehta@email.com" },
    serviceAddress: { street: "55 Magnolia Terrace", city: "Springfield", state: "IL", zip: "62711", fullAddress: "55 Magnolia Terrace, Springfield, IL 62711" },
    technicianId: "tech-004",
    accessNotes: "Construction crew on-site. Check in at trailer.",
  },
  {
    id: "dj-010",
    jobNumber: "WO-2024-0858",
    status: "scheduled",
    jobType: "Gas Line Inspection",
    description: "Annual residential gas line pressure test",
    durationMinutes: 60,
    scheduledStart: todayAt(13, 0),
    scheduledEnd: todayAt(14, 0),
    client: { id: "c-012", name: "Steve Park", phone: "(555) 777-8888" },
    serviceAddress: { street: "1122 Sycamore St", city: "Springfield", state: "IL", zip: "62712", fullAddress: "1122 Sycamore St, Springfield, IL 62712" },
    technicianId: "tech-004",
  },
];

// ───────────────────────────────────────────
// Unassigned (draft) jobs – no technician
// ───────────────────────────────────────────

export const unassignedJobs: DispatchJob[] = [
  {
    id: "dj-u01",
    jobNumber: "WO-2024-0860",
    status: "draft",
    jobType: "Toilet Repair",
    description: "Running toilet, likely flapper or fill valve",
    durationMinutes: 90,
    scheduledStart: todayAt(0, 0), // placeholder
    scheduledEnd: todayAt(0, 0),
    client: { id: "c-020", name: "James Wilson", phone: "(555) 567-8901" },
    serviceAddress: { street: "2345 Elm Drive", city: "Springfield", state: "IL", zip: "62704", fullAddress: "2345 Elm Drive, Springfield, IL 62704" },
    technicianId: null,
  },
  {
    id: "dj-u02",
    jobNumber: "WO-2024-0861",
    status: "draft",
    jobType: "Faucet Replacement",
    description: "Kitchen faucet leaking at base – customer supplied Moen fixture",
    durationMinutes: 60,
    scheduledStart: todayAt(0, 0),
    scheduledEnd: todayAt(0, 0),
    client: { id: "c-021", name: "Helen Torres", phone: "(555) 888-9999", email: "htorres@email.com" },
    serviceAddress: { street: "775 Walnut Circle", city: "Springfield", state: "IL", zip: "62713", fullAddress: "775 Walnut Circle, Springfield, IL 62713" },
    technicianId: null,
  },
  {
    id: "dj-u03",
    jobNumber: "WO-2024-0862",
    status: "draft",
    jobType: "Garbage Disposal Jam",
    description: "Disposal making grinding noise, won't drain",
    durationMinutes: 45,
    scheduledStart: todayAt(0, 0),
    scheduledEnd: todayAt(0, 0),
    client: { id: "c-022", name: "Frank Owens", phone: "(555) 321-6543" },
    serviceAddress: { street: "401 Poplar Avenue", city: "Springfield", state: "IL", zip: "62714", fullAddress: "401 Poplar Avenue, Springfield, IL 62714" },
    technicianId: null,
  },
  {
    id: "dj-u04",
    jobNumber: "WO-2024-0863",
    status: "draft",
    jobType: "Water Line Repair",
    description: "Low pressure in master bath – possible crimp in supply line",
    durationMinutes: 120,
    scheduledStart: todayAt(0, 0),
    scheduledEnd: todayAt(0, 0),
    client: { id: "c-023", name: "Nora Blake", phone: "(555) 654-3210", email: "nblake@email.com" },
    serviceAddress: { street: "1900 Hickory Road", city: "Springfield", state: "IL", zip: "62715", fullAddress: "1900 Hickory Road, Springfield, IL 62715" },
    technicianId: null,
    accessNotes: "Ring bell twice, customer is hard of hearing.",
  },
  {
    id: "dj-u05",
    jobNumber: "WO-2024-0864",
    status: "draft",
    jobType: "Boiler Service",
    description: "Annual boiler maintenance and safety check",
    durationMinutes: 90,
    scheduledStart: todayAt(0, 0),
    scheduledEnd: todayAt(0, 0),
    client: { id: "c-024", name: "Yuki Tanaka", phone: "(555) 999-0000" },
    serviceAddress: { street: "234 Chestnut Lane", city: "Springfield", state: "IL", zip: "62716", fullAddress: "234 Chestnut Lane, Springfield, IL 62716" },
    technicianId: null,
  },
];

// ───────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────

/** All dispatch jobs (scheduled + unassigned) in a single flat array. */
export function getAllDispatchJobs(): DispatchJob[] {
  return [...scheduledJobs, ...unassignedJobs];
}

export function getDispatchJobById(id: string): DispatchJob | undefined {
  return getAllDispatchJobs().find((j) => j.id === id);
}

export function getScheduledJobsForTechnician(techId: string): DispatchJob[] {
  return scheduledJobs.filter((j) => j.technicianId === techId);
}

/**
 * Simulate server-side mutation.  Moves a job to a technician's column at
 * the given start time, setting status to "scheduled".
 */
export function assignJob(
  jobId: string,
  technicianId: string,
  startTime: Date,
): DispatchJob | null {
  // Check unassigned first
  const uIdx = unassignedJobs.findIndex((j) => j.id === jobId);
  let job: DispatchJob | undefined;

  if (uIdx !== -1) {
    job = unassignedJobs.splice(uIdx, 1)[0];
    scheduledJobs.push(job);
  } else {
    job = scheduledJobs.find((j) => j.id === jobId);
  }

  if (!job) return null;

  job.technicianId = technicianId;
  job.status = "scheduled";
  job.scheduledStart = startTime;
  job.scheduledEnd = addMinutes(startTime, job.durationMinutes);
  return job;
}

export function rescheduleJob(
  jobId: string,
  technicianId: string,
  startTime: Date,
): DispatchJob | null {
  const job = scheduledJobs.find((j) => j.id === jobId);
  if (!job) return null;

  job.technicianId = technicianId;
  job.scheduledStart = startTime;
  job.scheduledEnd = addMinutes(startTime, job.durationMinutes);
  return job;
}
