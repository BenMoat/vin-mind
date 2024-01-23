import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { ModificationTypesClient } from "./components/client";
import { ModificationTypeColumn } from "./components/columns";

const ModificationTypesPage = async ({
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

  const modificationTypes = await prismadb.modificationType.findMany({
    where: {
      vehicleId: vehicle.id,
    },
    include: {
      modifications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedModificationTypes: ModificationTypeColumn[] =
    modificationTypes.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: format(item.createdAt, "do MMM yyyy"),
      noOfModifications: item.modifications.length,
    }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ModificationTypesClient data={formattedModificationTypes} />
      </div>
    </div>
  );
};

export default ModificationTypesPage;
