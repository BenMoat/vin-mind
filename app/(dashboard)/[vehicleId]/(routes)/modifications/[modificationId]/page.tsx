import prismadb from "@/lib/prismadb";

import { ModificationForm } from "./components/modification-form";

const ModificationPage = async ({
  params,
}: {
  params: { modificationId: string; vehicleId: string };
}) => {
  const modification = await prismadb.modification.findUnique({
    where: { id: params.modificationId },
    include: {
      modificationType: true,
      files: true,
    },
  });

  const modificationTypes = await prismadb.modificationType.findMany({
    where: { vehicleId: params.vehicleId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModificationForm
          initialData={JSON.parse(JSON.stringify(modification))}
          modificationTypes={modificationTypes}
        />
      </div>
    </div>
  );
};

export default ModificationPage;
