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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VehicleSwitcherProps {
  items: Vehicle[];
}

export default function VehicleSwitcher({ items = [] }: VehicleSwitcherProps) {
  const vehicleModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentVehicle = formattedItems.find(
    (item) => item.value === params.vehicleId
  );

  //Add ellipsis to label if it's above 19 chars
  const label = currentVehicle?.label;
  const formattedLabel =
    label && label.length > 19 ? `${label.slice(0, 19)}...` : label;

  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const onVehicleSelect = (vehicle: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/${vehicle.value}`);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Select a Vehicle"
          className="w-[70px] sm:w-[200px] justify-between"
        >
          <CarFront className="mr-2 h-4 w-4" />
          <span className="hidden truncate sm:block">{formattedLabel}</span>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0" align="end">
        {formattedItems.map((vehicle) => {
          const vehicleLabel =
            vehicle.label && vehicle.label.length > 19
              ? `${vehicle.label.slice(0, 19)}...`
              : vehicle.label;

          return (
            <DropdownMenuCheckboxItem
              key={vehicle.value}
              checked={vehicle.value === params.vehicleId}
              onSelect={() => onVehicleSelect(vehicle)}
              className={`text-sm cursor-pointer truncate w-full ${
                vehicle.value === params.vehicleId && hoveredItem === null
                  ? "bg-accent"
                  : ""
              }`}
              onMouseEnter={() => setHoveredItem(vehicle.value)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <CarFront className="absolute left-2 mr-2 h-4 w-4" />
              {vehicleLabel}
            </DropdownMenuCheckboxItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          onSelect={() => {
            setOpen(false);
            vehicleModal.onOpen();
          }}
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
