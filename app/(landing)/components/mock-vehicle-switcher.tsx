"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MockVehicle, mockData } from "@/lib/constants";

import { CarFront, PlusCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Chevron from "@/components/chevron";

interface MockVehicleSwitcherProps {
  onVehicleSwitch: (vehicle: MockVehicle) => void;
}

export default function MockVehicleSwitcher({
  onVehicleSwitch,
}: MockVehicleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentVehicle, setCurrentVehicle] = useState<MockVehicle>(
    mockData[1]
  );

  const { push } = useRouter();

  const handleSelect = (vehicle: MockVehicle) => {
    setCurrentVehicle(vehicle);
    setOpen(false);
    setHoveredItem(null);

    if (onVehicleSwitch) {
      onVehicleSwitch(vehicle);
    }
  };

  const signUp = () => {
    push("/sign-up");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-haspopup="true"
          aria-expanded={open}
          className="relative flex w-[200px] justify-between"
        >
          <CarFront className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
          <span id="vehicleButtonLabel" className="truncate">
            <span className="truncate" title={currentVehicle.name}>
              {currentVehicle.name}
            </span>
          </span>
          <Chevron open={open} />
          <span className="absolute top-[-6px] right-[-6px] flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] dark">
        <DropdownMenuLabel>Garage</DropdownMenuLabel>
        {mockData
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((vehicle) => (
            <DropdownMenuCheckboxItem
              key={vehicle.id}
              checked={vehicle.id === currentVehicle.id}
              onSelect={() => handleSelect(vehicle)}
              className={`text-sm truncate w-full ${
                vehicle.id === currentVehicle.id && !hoveredItem && "bg-accent"
              }`}
              onMouseEnter={() => setHoveredItem(vehicle.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <CarFront className="absolute left-2 mr-2 h-4 w-4" />
              <span
                title={vehicle.name}
                className={`truncate ${
                  vehicle.id === currentVehicle.id && "mr-5"
                }`}
              >
                {vehicle.name}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        <DropdownMenuCheckboxItem
          className="border-t flex justify-center pl-0"
          onSelect={signUp}
          onMouseEnter={() => setHoveredItem("addVehicle")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Start my garage
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
