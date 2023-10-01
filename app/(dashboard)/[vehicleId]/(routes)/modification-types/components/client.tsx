"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ModificationTypesClient = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Modification Types (0)"
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
    </>
  );
};
