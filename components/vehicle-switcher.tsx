"use client";

import { useState } from "react";
import { Vehicle } from "@prisma/client";

import { useParams, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";
import {
  CarFront,
  CarFrontIcon,
  Check,
  ChevronsUpDown,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface VehicleSwitcherProps extends PopoverTriggerProps {
  items: Vehicle[];
}

export default function VehicleSwitcher({
  className,
  items = [],
}: VehicleSwitcherProps) {
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

  const [open, setOpen] = useState(false);

  const onVehicleSelect = (vehicle: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/${vehicle.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Vehicle"
          className={cn("w-[200px] justify-between", className)}
        >
          <CarFrontIcon className="mr-2 h-4 w-4" />
          {currentVehicle?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search vehicles" />
            <CommandEmpty>No vehicle found</CommandEmpty>
            <CommandGroup heading="Vehicles">
              {formattedItems.map((vehicle) => (
                <CommandItem
                  key={vehicle.value}
                  onSelect={() => onVehicleSelect(vehicle)}
                  className="text-sm cursor-pointer"
                >
                  <CarFront className="mr-2 h-4 w-4" />
                  {vehicle.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentVehicle?.value === vehicle.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="cursor-pointer"
                onSelect={() => {
                  setOpen(false);
                  vehicleModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add a Vehicle
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
