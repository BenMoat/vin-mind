import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { vehicleId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const vehicle = await prismadb.vehicle.findFirst({
    where: {
      id: params.vehicleId,
    },
  });

  return <div>Current Vehicle: {vehicle?.name}</div>;
};

export default DashboardPage;
