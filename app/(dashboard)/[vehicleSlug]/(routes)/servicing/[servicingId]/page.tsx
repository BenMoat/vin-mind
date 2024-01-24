import prismadb from "@/lib/prismadb";
import { getVehicleBySlug } from "@/app/actions/vehicle";

import { ServicingForm } from "./components/servicing-form";

const ModificationPage = async ({
  params,
}: {
  params: { servicingId: string; vehicleSlug: string };
}) => {
  const vehicle = await getVehicleBySlug(params.vehicleSlug);

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
