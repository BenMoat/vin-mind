import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ModificationClient } from "./components/client";
import { ModificationColumn } from "./components/columns";

const ModificationsPage = async ({
  params,
}: {
  params: { vehicleSlug: string };
}) => {
  const vehicle = await prismadb.vehicle.findFirst({
    where: { slug: params.vehicleSlug },
  });

  if (!vehicle) {
    throw new Error(`Vehicle with slug ${params.vehicleSlug} not found`);
  }

  const modifications = await prismadb.modification.findMany({
    where: {
      vehicleId: vehicle.id,
    },
    include: {
      modificationType: true,
      files: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedModifications: ModificationColumn[] = modifications.map(
    (item) => ({
      id: item.id,
      name: item.name,
      type: item.modificationType.name,
      price: Number(item.price),
      isObsolete: item.isObsolete,
      notes: item.notes?.toString() ?? "",
      createdAt: format(item.createdAt, "do MMM yyyy"),
      files: item.files.map((file) => file.id),
    })
  );

  const modificationTypes = await prismadb.modificationType.findMany({
    where: { vehicleId: vehicle.id },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ModificationClient
          data={formattedModifications}
          modificationTypes={modificationTypes}
        />
      </div>
    </div>
  );
};

export default ModificationsPage;
