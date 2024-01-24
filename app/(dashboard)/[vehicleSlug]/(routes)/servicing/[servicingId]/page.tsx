import prismadb from "@/lib/prismadb";

import { ServicingForm } from "./components/servicing-form";

const ModificationPage = async ({
  params,
}: {
  params: { servicingId: string; vehicleSlug: string };
}) => {
  const vehicle = await prismadb.vehicle.findFirst({
    where: { slug: params.vehicleSlug },
  });

  if (!vehicle) {
    throw new Error(`Vehicle with slug ${params.vehicleSlug} not found`);
  }

  const service = await prismadb.serviceHistory.findUnique({
    where: { id: params.servicingId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ServicingForm
          vehicleId={vehicle.id}
          initialData={JSON.parse(JSON.stringify(service))}
        />
      </div>
    </div>
  );
};

export default ModificationPage;
