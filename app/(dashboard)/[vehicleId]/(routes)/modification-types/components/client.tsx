"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModificationTypeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

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
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <Tabs defaultValue="modification-types" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger asChild value="modifications" className="!space-x-10">
            <Link href={`/${params.vehicleId}/modifications`}>Mods</Link>
          </TabsTrigger>
          <TabsTrigger
            asChild
            value="modification-types"
            className="!space-x-10"
          >
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
