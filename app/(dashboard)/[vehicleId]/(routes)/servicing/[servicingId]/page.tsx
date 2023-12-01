import prismadb from "@/lib/prismadb";

import { ServicingForm } from "./components/servicing-form";

const ModificationPage = async ({
  params,
}: {
  params: { servicingId: string; vehicleId: string };
}) => {
  const service = await prismadb.serviceHistory.findUnique({
    where: { id: params.servicingId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServicingForm initialData={JSON.parse(JSON.stringify(service))} />
      </div>
    </div>
  );
};

export default ModificationPage;
