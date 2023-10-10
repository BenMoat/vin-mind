"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) {
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
      href: `/${params.vehicleId}/settings`,
      label: "Settings",
      active: pathname === `/${params.vehicleId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
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
