import prismadb from "@/lib/prismadb";
import { getVehicleBySlug } from "@/app/actions/vehicle";

import { ServiceHistoryClient } from "./components/client";

const ModificationsPage = async ({
  params,
}: {
  params: { vehicleSlug: string };
}) => {
  const vehicle = await getVehicleBySlug(params.vehicleSlug);

  const serviceHistory = await prismadb.serviceHistory.findMany({
    where: {
      vehicleId: vehicle.id,
    },
    orderBy: {
      serviceDate: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ServiceHistoryClient
          data={JSON.parse(JSON.stringify(serviceHistory))}
        />
      </div>
    </div>
  );
};

export default ModificationsPage;
