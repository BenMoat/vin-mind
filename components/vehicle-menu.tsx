"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
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
      href: `/${params.vehicleSlug}`,
      label: "Overview",
      active: pathname === `/${params.vehicleSlug}`,
    },
    {
      href: `/${params.vehicleSlug}/modifications`,
      label: "Modifications",
      active:
        pathname === `/${params.vehicleSlug}/modifications` ||
        pathname === `/${params.vehicleSlug}/modification-types` ||
        pathname ===
          `/${params.vehicleSlug}/modifications/${params.modificationId}` ||
        pathname ===
          `/${params.vehicleSlug}/modification-types/${params.modificationTypeId}`,
    },
    {
      href: `/${params.vehicleSlug}/servicing`,
      label: "Servicing",
      active: pathname === `/${params.vehicleSlug}/servicing`,
    },
    {
      href: `/${params.vehicleSlug}/settings`,
      label: "Settings",
      active: pathname === `/${params.vehicleSlug}/settings`,
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
