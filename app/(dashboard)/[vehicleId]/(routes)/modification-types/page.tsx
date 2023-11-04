import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { ModificationTypesClient } from "./components/client";
import { ModificationTypeColumn } from "./components/columns";

const ModificationTypesPage = async ({
  params,
}: {
  params: { vehicleId: string };
}) => {
  const modificationTypes = await prismadb.modificationType.findMany({
    where: {
      vehicleId: params.vehicleId,
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
      <div className="flex-1 space-y-4 p-8 pt-2">
        <ModificationTypesClient data={formattedModificationTypes} />
      </div>
    </div>
  );
};

export default ModificationTypesPage;
