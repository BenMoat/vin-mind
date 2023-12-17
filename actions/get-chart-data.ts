import prismadb from "@/lib/prismadb";

export const getChartData = async (vehicleId: string) => {
  const vehicle = await prismadb.vehicle.findFirst({
    where: {
      id: vehicleId,
    },
    include: {
      modifications: true,
      dvlaData: true,
      insurance: true,
      dashboardConfigure: true,
      serviceHistory: true,
    },
  });

  if (!vehicle) {
    throw new Error(`Vehicle with ID ${vehicleId} not found`);
  }

  const data = vehicle.serviceHistory.map((service, index) => ({
    name: new Date(service.serviceDate).toLocaleString("default", {
      month: "long",
      year: "numeric",
    }),
    uv: service.mileage,
    pv: vehicle.modifications.length,
  }));

  return data;
};
