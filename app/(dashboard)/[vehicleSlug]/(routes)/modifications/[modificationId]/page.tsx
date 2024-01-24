import prismadb from "@/lib/prismadb";
import { getVehicleBySlug } from "@/app/actions/vehicle";

import { ModificationForm } from "./components/modification-form";

const ModificationPage = async ({
  params,
}: {
  params: { modificationId: string; vehicleSlug: string };
}) => {
  const vehicle = await getVehicleBySlug(params.vehicleSlug);

  const modification = await prismadb.modification.findUnique({
    where: { id: params.modificationId },
    include: {
      modificationType: true,
      files: true,
    },
  });

  const modificationTypes = await prismadb.modificationType.findMany({
    where: { vehicleId: vehicle.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ModificationForm
          vehicleId={vehicle.id}
          initialData={JSON.parse(JSON.stringify(modification))}
          modificationTypes={modificationTypes}
        />
      </div>
    </div>
  );
};

export default ModificationPage;
