import { redirect } from "next/navigation";
import { UserButton, auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

import { Gauge } from "lucide-react";

import { MainNav } from "@/components/main-nav";
import VehicleSwitcher from "@/components/vehicle-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

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
        <Gauge className="ml-4 w-5 h-5" />
        <p className="text-xl font-bold ml-2 mr-6">VinMind</p>
        <VehicleSwitcher items={vehicles} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
