"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { Plus, PoundSterling } from "lucide-react";
import Link from "next/link";

import { ModificationType } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

import { ModificationColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ModificationClientProps {
  data: ModificationColumn[];
  modificationTypes: ModificationType[];
}

export const ModificationClient: React.FC<ModificationClientProps> = ({
  data,
  modificationTypes,
}) => {
  const params = useParams();
  const router = useRouter();
  const [filteredPrice, setFilteredPrice] = useState(0);

  const totalPrice = data.reduce(
    (total, modification) => total + Number(modification.price),
    0
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`${data.length} ${
            data.length === 1 ? "Modification" : "Modifications"
          }`}
          description="Manage your vehicle's modifications."
        />
        <Button
          onClick={() => router.push(`/${params.vehicleId}/modifications/new`)}
          className="flex items-center"
        >
          <Plus className="sm:mr-2 h-4 w-4" />
          <span className="hidden sm:block">Add New</span>
        </Button>
      </div>
      <Separator />
      <div className="flex relative justify-between items-center">
        <Tabs className="sm:w-[350px]" defaultValue="modifications">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger asChild value="modifications">
              <Link href={`/${params.vehicleId}/modifications`}>Mods</Link>
            </TabsTrigger>
            <TabsTrigger asChild value="modification-types">
              <Link href={`/${params.vehicleId}/modification-types`}>
                Mod Types
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {totalPrice > 0 && (
          <>
            <div className="absolute hidden sm:grid right-0 top-0 grid-rows-2 justify-end ">
              <a className="border rounded-md px-4 py-2">
                <b>{formatCurrency.format(filteredPrice)} </b>
                of <b>{formatCurrency.format(totalPrice)}</b>
              </a>
            </div>
            <Popover>
              <PopoverTrigger asChild className="sm:hidden">
                <Button variant="outline">
                  <PoundSterling className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="left" className="w-auto">
                <b>{formatCurrency.format(filteredPrice)} </b>
                of <b>{formatCurrency.format(totalPrice)}</b>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
      <DataTable
        routeName="modifications"
        filterKey="name"
        columns={columns}
        data={data}
        modType={modificationTypes}
        isObsolete
        onFilteredPriceChange={setFilteredPrice}
      />
    </>
  );
};
