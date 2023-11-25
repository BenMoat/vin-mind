import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ServiceHistory } from "./components/service-history";

interface SettingsPageProps {
  params: {
    vehicleId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const vehicle = await prismadb.vehicle.findFirst({
    where: {
      id: params.vehicleId,
      userId,
    },
    include: {
      dvlaData: true,
    },
  });

  if (!vehicle) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-2">
        <ServiceHistory initialData={vehicle} />
      </div>
    </div>
  );
};

export default SettingsPage;
