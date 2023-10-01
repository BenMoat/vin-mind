"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModificationTypeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface ModificationTypesClientProps {
  data: ModificationTypeColumn[];
}

export const ModificationTypesClient: React.FC<
  ModificationTypesClientProps
> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Modification Types (${data.length})`}
          description="Manage your vehicle's modification types."
        />
        <Button
          onClick={() =>
            router.push(`/${params.vehicleId}/modification-types/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Modification Type
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
