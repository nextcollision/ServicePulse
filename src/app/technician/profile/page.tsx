"use client";

import { MobileLayout } from "@/components/technician/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentTechnician } from "@/data/mock-jobs";
import {
  User,
  Mail,
  Phone,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <MobileLayout title="Profile">
      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentTechnician.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Field Technician
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardContent className="py-2">
            <div className="divide-y">
              <div className="flex items-center gap-3 py-3">
                <Mail className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm">{currentTechnician.email}</span>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Phone className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm">{currentTechnician.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <Card>
          <CardContent className="py-2">
            <div className="divide-y">
              <MenuItem icon={Settings} label="Settings" />
              <MenuItem icon={Bell} label="Notifications" />
              <MenuItem icon={HelpCircle} label="Help & Support" />
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="outline" size="lg" className="w-full gap-2 text-destructive">
          <LogOut className="h-5 w-5" strokeWidth={2} />
          Sign Out
        </Button>
      </div>
    </MobileLayout>
  );
}

function MenuItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <button className="flex items-center justify-between w-full py-3 touch-target">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
        <span className="text-sm">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
    </button>
  );
}
