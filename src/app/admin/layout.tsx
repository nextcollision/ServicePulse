import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ServicePulse - Dispatch Command Center",
  description: "Admin dispatch board for assigning and scheduling field jobs",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
