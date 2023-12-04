import { redirect } from "next/navigation";
import { UserButton, ClerkLoading, ClerkLoaded, auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

import { Gauge } from "lucide-react";

import { VehicleMenu } from "@/components/vehicle-menu";
import VehicleSwitcher from "@/components/vehicle-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "./ui/skeleton";
import { NavbarMobile } from "./navbar-mobile";

export const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const vehicles = await prismadb.vehicle.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 cursor-default">
        <NavbarMobile items={vehicles} />
        <Gauge className="w-6 h-6 hidden sm:block" />
        <p className="text-xl font-bold sm:ml-2 ml-4 mr-4 flex-shrink-0">
          VinMind
        </p>
        <VehicleSwitcher className="hidden sm:flex" items={vehicles} />
        <VehicleMenu className="hidden sm:flex text-sm flex-grow mx-4 space-x-4" />
        <div className="ml-auto flex items-center space-x-2">
          <ThemeToggle />
          <ClerkLoading>
            <Skeleton className="w-8 h-8 mr-2 rounded-full" />
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton afterSignOutUrl="/" />
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};
