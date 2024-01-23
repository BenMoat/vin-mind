import prismadb from "@/lib/prismadb";

import { ServiceHistoryClient } from "./components/client";

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
