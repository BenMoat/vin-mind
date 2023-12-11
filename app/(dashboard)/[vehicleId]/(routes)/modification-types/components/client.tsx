"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";

import { ModificationTypeColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModificationTypesClientProps {
  data: ModificationTypeColumn[];
}

export const ModificationTypesClient: React.FC<
  ModificationTypesClientProps
> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`${data.length} ${
            data.length === 1 ? "Modification Type" : "Modification Types"
          }`}
          description="Manage your vehicle's modification types."
        />
        <Button
          onClick={() =>
            router.push(`/${params.vehicleId}/modification-types/new`)
          }
        >
          <Plus className="sm:mr-2 h-4 w-4" />
          <span className="hidden sm:block">Add New</span>
        </Button>
      </div>
      <Separator />
      <Tabs className="sm:w-[400px]" defaultValue="modification-types">
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
      <DataTable
        routeName="modification-types"
        filterKey="name"
        columns={columns}
        data={data}
      />
    </>
  );
};
