/**
 * Canonical job record route (/jobs/[id]) used by the admin dispatch board.
 * Renders the same job detail view as the technician route — the lookup
 * behind it resolves ids from both the technician and dispatch data stores.
 */
export { default } from "@/app/technician/job/[id]/page";
