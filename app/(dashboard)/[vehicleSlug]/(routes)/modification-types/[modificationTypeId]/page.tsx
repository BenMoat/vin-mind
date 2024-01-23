import prismadb from "@/lib/prismadb";

import { ModificationTypeForm } from "./components/modification-type-form";

const ModificationTypePage = async ({
  params,
}: {
  params: { modificationTypeId: string; vehicleSlug: string };
}) => {
  const vehicle = await prismadb.vehicle.findFirst({
    where: { slug: params.vehicleSlug },
  });

  if (!vehicle) {
    throw new Error(`Vehicle with slug ${params.vehicleSlug} not found`);
  }

  const modificationType = await prismadb.modificationType.findUnique({
    where: { id: params.modificationTypeId },
  });

  const modifications = await prismadb.modification.findMany({
    where: { modificationTypeId: params.modificationTypeId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ModificationTypeForm
          vehicleId={vehicle.id}
          initialData={modificationType}
          modifications={JSON.parse(JSON.stringify(modifications))}
        />
      </div>
    </div>
  );
};

export default ModificationTypePage;
