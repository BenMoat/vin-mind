import prismadb from "@/lib/prismadb";

import { ServiceHistoryClient } from "./components/client";

const ModificationsPage = async ({
  params,
}: {
  params: { vehicleId: string };
}) => {
  const serviceHistory = await prismadb.serviceHistory.findMany({
    where: {
      vehicleId: params.vehicleId,
    },
    orderBy: {
      serviceDate: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-2">
        <ServiceHistoryClient data={serviceHistory} />
      </div>
    </div>
  );
};

export default ModificationsPage;
