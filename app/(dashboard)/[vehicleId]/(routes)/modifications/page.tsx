import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ModificationClient } from "./components/client";
import { ModificationColumn } from "./components/columns";

const ModificationsPage = async ({
  params,
}: {
  params: { vehicleId: string };
}) => {
  const modifications = await prismadb.modification.findMany({
    where: {
      vehicleId: params.vehicleId,
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
      price: item.price.toString(),
      isObsolete: item.isObsolete,
      notes: item.notes?.toString() ?? "",
      createdAt: format(item.createdAt, "do MMM yyyy"),
      files: item.files.map((file) => file.id),
    })
  );

  const modificationTypes = await prismadb.modificationType.findMany({
    where: { vehicleId: params.vehicleId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-2">
        <ModificationClient
          data={formattedModifications}
          modificationTypes={modificationTypes}
        />
      </div>
    </div>
  );
};

export default ModificationsPage;
