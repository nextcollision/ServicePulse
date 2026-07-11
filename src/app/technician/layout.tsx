import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ServicePulse - Technician",
  description: "Field service management for technicians",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ServicePulse",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
