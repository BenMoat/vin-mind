"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModificationColumn, columns } from "./columns";
import { ModificationType } from "@prisma/client";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

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
      <Tabs className="sm:w-[400px]" defaultValue="modifications">
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
        routeName="modifications"
        filterKey="name"
        modType={modificationTypes}
        isObsolete
        columns={columns}
        data={data}
      />
    </>
  );
};
