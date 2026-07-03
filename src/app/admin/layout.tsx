import { Metadata } from "next";
import { AdminProviders } from "./providers";

export const metadata: Metadata = {
  title: "ServicePulse - Dispatch Command Center",
  description: "Admin dispatch board for assigning and scheduling field jobs",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProviders>{children}</AdminProviders>;
}
