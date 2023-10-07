"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModificationColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();

  const routes = [
    {
      href: `/${params.vehicleId}/modifications`,
      label: "Modifications",
      active: pathname === `/${params.vehicleId}/modifications`,
    },
    {
      href: `/${params.vehicleId}/modification-types`,
      label: "Modification Types",
      active: pathname === `/${params.vehicleId}/modification-types`,
    },
  ];

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
      <Tabs defaultValue="modifications" className="w-[400px]">
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
