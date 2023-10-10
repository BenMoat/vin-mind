import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

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
  });

  const modifications = await prismadb.modification.findMany({
    where: {
      vehicleId: params.vehicleId,
    },
  });

  const modificationTypes = await prismadb.modificationType.findMany({
    where: {
      vehicleId: params.vehicleId,
    },
  });

  if (!vehicle) {
    redirect("/");
  }

  return (
    <div className="fkex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm
          initialData={vehicle}
          modifications={modifications}
          modificationTypes={modificationTypes}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
