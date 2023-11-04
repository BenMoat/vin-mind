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
import { formatLabelWithEllipsis } from "@/lib/utils";
interface VehicleSwitcherProps {
  items: Vehicle[];
}

export default function VehicleSwitcher({ items = [] }: VehicleSwitcherProps) {
  const { onOpen: openVehicleModal } = useStoreModal();
  const params = useParams();
  const { push } = useRouter();

  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const currentVehicle = items.find((item) => item.id === params.vehicleId);
  const formattedLabel = formatLabelWithEllipsis(currentVehicle?.name);

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
          <ChevronDown
            className={`ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-300 ${
              open ? "transform rotate-180" : ""
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0" align="end">
        <DropdownMenuLabel>Garage</DropdownMenuLabel>
        {items.map((vehicle) => (
          <DropdownMenuCheckboxItem
            key={vehicle.id}
            checked={vehicle.id === params.vehicleId}
            onSelect={() => {
              setOpen(false);
              push(`/${vehicle.id}`);
            }}
            className={`text-sm truncate w-full ${
              vehicle.id === params.vehicleId && !hoveredItem ? "bg-accent" : ""
            }`}
            onMouseEnter={() => setHoveredItem(vehicle.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <CarFront className="absolute left-2 mr-2 h-4 w-4" />
            {formatLabelWithEllipsis(vehicle.name)}
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
