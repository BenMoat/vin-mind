"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils/wrapper-utils";
import Link from "next/link";

interface VehicleMenuProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

export function VehicleMenu({
  className,
  onClick,
  ...props
}: VehicleMenuProps) {
  const pathname = usePathname();
  const params = useParams();

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

  return (
    <nav className={cn("items-center lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
          onClick={() => {
            if (onClick) onClick();
          }}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
