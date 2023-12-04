"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Vehicle } from "@prisma/client";
import VehicleSwitcher from "./vehicle-switcher";
import { VehicleMenu } from "./vehicle-menu";

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
      <SheetTrigger className="sm:hidden" asChild>
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
          <div className="!ml-[-4px] space-y-6">
            <SheetTitle>Menu</SheetTitle>
            <VehicleSwitcher
              items={items}
              onClick={handleItemClick}
              className="flex items-center justify-center"
            />
            <VehicleMenu
              onClick={handleItemClick}
              className="flex flex-col space-x-0 space-y-4 text-md"
            />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
