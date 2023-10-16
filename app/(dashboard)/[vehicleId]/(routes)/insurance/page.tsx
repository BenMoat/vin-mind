import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { InsuranceForm } from "./components/insurance-form";

interface InsurancePageProps {
  params: {
    vehicleId: string;
  };
}

const SettingsPage: React.FC<InsurancePageProps> = async ({ params }) => {
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

  if (!vehicle) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InsuranceForm initialData={vehicle} />
      </div>
    </div>
  );
};

export default SettingsPage;
