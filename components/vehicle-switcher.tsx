"use client";

import { useState } from "react";

import { Vehicle } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useStoreModal } from "@/hooks/use-store-modal";

import { Button } from "@/components/ui/button";
import { CarFront, ChevronDown, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface VehicleSwitcherProps {
  items: Vehicle[];
  className?: string;
  onClick?: () => void;
}

export default function VehicleSwitcher({
  items = [],
  className,
  ...props
}: VehicleSwitcherProps) {
  const { onOpen: openVehicleModal } = useStoreModal();
  const params = useParams();
  const { push } = useRouter();

  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const currentVehicle = items.find((item) => item.id === params.vehicleId);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-haspopup="true"
          aria-expanded={open}
          className={cn("flex w-[200px] justify-between", className)}
        >
          <CarFront className="mr-2 h-4 w-4" aria-hidden="true" />
          <span id="vehicleButtonLabel" className="truncate">
            <span className="truncate">{currentVehicle?.name}</span>
          </span>
          <ChevronDown
            className={`ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-300 ${
              open && "transform rotate-180"
            }`}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0" align="end">
        <DropdownMenuLabel>Garage</DropdownMenuLabel>
        {items
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((vehicle) => (
            <DropdownMenuCheckboxItem
              key={vehicle.id}
              checked={vehicle.id === params.vehicleId}
              onSelect={() => {
                setOpen(false);
                push(`/${vehicle.id}`);
              }}
              className={`text-sm truncate w-full ${
                vehicle.id === params.vehicleId && !hoveredItem && "bg-accent"
              }`}
              onMouseEnter={() => setHoveredItem(vehicle.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <CarFront className="absolute left-2 mr-2 h-4 w-4" />
              <span
                title={vehicle.name}
                className={`truncate ${
                  vehicle.id === currentVehicle?.id && "mr-5"
                }`}
              >
                {vehicle.name}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        <DropdownMenuCheckboxItem
          className="border-t"
          onSelect={openVehicleModal}
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
