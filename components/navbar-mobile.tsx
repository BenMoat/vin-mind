"use client";

import { useState } from "react";

import { Vehicle } from "@prisma/client";

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
import { ThemeToggle } from "./theme-toggle";

interface NavbarMobileProps {
  items: Vehicle[];
}

export const NavbarMobile: React.FC<NavbarMobileProps> = ({ items }) => {
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
      <SheetContent side="left" className="w-[240px]">
        <SheetHeader>
          <SheetTitle className="flex justify-center">Menu</SheetTitle>
          <div className="!ml-[-4px] space-y-4">
            <Separator />
            <VehicleSwitcher
              items={items}
              onClick={handleItemClick}
              className="flex items-center justify-center"
            />
            <VehicleMenu
              onClick={handleItemClick}
              className="flex flex-col space-x-0 space-y-4 text-md"
            />
            <Separator />
            <ThemeToggle />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
