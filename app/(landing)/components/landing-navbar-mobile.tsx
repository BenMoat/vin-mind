"use client";

import { useState } from "react";

import { Menu } from "lucide-react";
import VehicleSwitcher from "@/components/vehicle-switcher";
import { VehicleMenu } from "@/components/vehicle-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Scrollspy from "react-scrollspy";
import Link from "next/link";
import { sectionRoutes } from "@/lib/constants";

export const LandingNavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden" asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="h-9"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] pt-20 dark">
        <SheetHeader>
          <SheetTitle className="flex justify-center">Menu</SheetTitle>
          <div className="space-y-4">
            <Separator />
            <Scrollspy
              items={["overview", "modifications", "servicing", "settings"]}
              offset={-100}
              currentClassName="text-white font-bold"
              className="flex flex-col space-x-0 space-y-4 text-md transition-colors text-muted-foreground"
            >
              {sectionRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={handleItemClick}
                  className="flex justify-center font-medium transition-colors hover:text-primary"
                >
                  {route.label}
                </Link>
              ))}
            </Scrollspy>
            <Separator />
            <div className="sm:hidden grid grid-cols-1 space-y-2">
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="w-28 text-white">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
