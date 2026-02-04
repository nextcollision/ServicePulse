"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ClipboardList, Map, Package, User } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  matchPaths?: string[];
}

const navItems: NavItem[] = [
  {
    href: "/technician/dashboard",
    label: "My Jobs",
    icon: ClipboardList,
    matchPaths: ["/technician/dashboard", "/technician/job"],
  },
  {
    href: "/technician/map",
    label: "Map View",
    icon: Map,
  },
  {
    href: "/technician/inventory",
    label: "Inventory",
    icon: Package,
  },
  {
    href: "/technician/profile",
    label: "Profile",
    icon: User,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.matchPaths) {
      return item.matchPaths.some((path) => pathname.startsWith(path));
    }
    return pathname === item.href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors touch-target",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 mb-1 transition-transform duration-200",
                  active && "scale-110"
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  active && "font-semibold"
                )}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
