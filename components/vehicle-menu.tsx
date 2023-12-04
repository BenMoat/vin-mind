"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

export function VehicleMenu({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      href: `/${params.vehicleId}`,
      label: "Overview",
      active: pathname === `/${params.vehicleId}`,
    },
    {
      href: `/${params.vehicleId}/modifications`,
      label: "Modifications",
      active:
        pathname === `/${params.vehicleId}/modifications` ||
        pathname === `/${params.vehicleId}/modification-types` ||
        pathname ===
          `/${params.vehicleId}/modifications/${params.modificationId}` ||
        pathname ===
          `/${params.vehicleId}/modification-types/${params.modificationTypeId}`,
    },
    {
      href: `/${params.vehicleId}/servicing`,
      label: "Servicing",
      active: pathname === `/${params.vehicleId}/servicing`,
    },
    {
      href: `/${params.vehicleId}/settings`,
      label: "Settings",
      active: pathname === `/${params.vehicleId}/settings`,
    },
  ];
  const currentRoute = routes.find((route) => route.active);

  return (
    <nav
      className={cn(
        "sm:flex items-center space-x-4 lg:space-x-6 hidden",
        className
      )}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
