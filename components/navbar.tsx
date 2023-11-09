import { redirect } from "next/navigation";
import { UserButton, ClerkLoading, ClerkLoaded, auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

import { Gauge } from "lucide-react";

import { MainNav } from "@/components/main-nav";
import VehicleSwitcher from "@/components/vehicle-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "./ui/skeleton";

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
        <Gauge className="sm:w-5 sm:h-5 mr-2 sm:mr-0" />
        <p className="sm:text-xl font-bold ml-2 mr-4 flex-shrink-0 hidden sm:block">
          VinMind
        </p>
        <VehicleSwitcher items={vehicles} />
        <MainNav className="flex-grow mx-6" />
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
