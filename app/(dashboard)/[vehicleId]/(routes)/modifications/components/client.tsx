"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModificationColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface ModificationClientProps {
  data: ModificationColumn[];
  modificationTypes: any[];
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
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        routeName="modifications"
        filterKey="name"
        modType={modificationTypes}
        columns={columns}
        data={data}
      />
    </>
  );
};
