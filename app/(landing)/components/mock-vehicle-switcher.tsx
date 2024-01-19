"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CarFront, ChevronDown, PlusCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type MockVehicle = {
  id: string;
  name: string;
  userId: string;
  totalModifications: number;
  totalPrice: number;
};

interface MockVehicleSwitcherProps {
  onVehicleSwitch: (vehicle: MockVehicle) => void;
}

const mockData = [
  {
    id: "1",
    name: "A90 Toyota Supra",
    userId: "Benjie",
    totalModifications: 12,
    totalPrice: 1360.69,
  },
  {
    id: "2",
    name: "McLaren F1",
    userId: "Future Benjie",
    totalModifications: 2,
    totalPrice: 123.92,
  },
  {
    id: "3",
    name: "Mercedes AMG GT Black Series",
    userId: "Slightly more realistic Future Benjie",
    totalModifications: 13,
    totalPrice: 19286.78,
  },
];

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
          <ChevronDown
            className={`ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-300 ${
              open && "transform rotate-180"
            }`}
            aria-hidden="true"
          />
          <span className="absolute top-[-6px] right-[-6px] flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0">
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
          className="border-t"
          onSelect={signUp}
          onMouseEnter={() => setHoveredItem("addVehicle")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add a Vehicle
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
