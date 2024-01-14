import { Gauge } from "lucide-react";

import { VehicleMenu } from "@/components/vehicle-menu";
import { NavbarMobile } from "@/components/navbar-mobile";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LandingNavbar = () => {
  return (
    <div className="fixed z-[99999999] w-full border-b backdrop-blur dark">
      <div className="flex h-16 items-center px-4 cursor-default">
        <NavbarMobile />
        <Gauge className="w-6 h-6 ml-3 md:ml-0" />
        <p className="text-xl font-bold ml-2 mr-4">VinMind</p>
        <VehicleMenu className="hidden md:flex text-sm flex-grow mx-4 space-x-4 dark" />
        <div className="ml-auto flex items-center space-x-2">
          <div className="hidden sm:block space-x-4">
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
