import prismadb from "@/lib/prismadb";
import { getVehicleBySlug } from "@/app/actions/vehicle";

import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: {
    vehicleSlug: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const vehicle = await getVehicleBySlug(params.vehicleSlug);

  const vehicleSettings = await prismadb.vehicle.findFirst({
    where: {
      id: vehicle.id,
    },
    include: {
      dvlaData: true,
    },
  });

  const noOfModifications = await prismadb.modification.count({
    where: {
      vehicleId: vehicle.id,
    },
  });

  const noOfModificationTypes = await prismadb.modificationType.count({
    where: {
      vehicleId: vehicle.id,
    },
  });

  const noOfServices = await prismadb.serviceHistory.count({
    where: {
      vehicleId: vehicle.id,
    },
  });

  if (!vehicleSettings) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <SettingsForm
          initialData={vehicleSettings}
          dvlaData={vehicleSettings.dvlaData}
          noOfModifications={noOfModifications}
          noOfModificationTypes={noOfModificationTypes}
          noOfServices={noOfServices}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
