import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { getTotalModifications } from "@/actions/get-total-modifications";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { CarIcon, Milestone, PoundSterling } from "lucide-react";

import { TaxAndMOT } from "./components/tax-and-mot";
import { Mileage } from "./components/mileage";
import { InsuranceCard } from "./components/insurance-card";

interface DashboardPageProps {
  params: { vehicleId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalModifications = await getTotalModifications(params.vehicleId);

  const vehicle = await prismadb.vehicle.findFirst({
    where: {
      id: params.vehicleId,
    },
    include: {
      modifications: true,
      dvlaData: true,
      insurance: true,
    },
  });

  if (!vehicle) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <CarIcon className="h-16 w-16 text-muted-foreground mx-auto" />
          Vehicle not found. <br></br> Please refresh the page.{" "}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="An overview of your vehicle" />
        <Separator />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {vehicle.dvlaData && <TaxAndMOT initialData={vehicle.dvlaData} />}
          <InsuranceCard initialData={vehicle?.insurance} />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Total of {vehicle.modifications.length} Modifications
              </CardTitle>
              <PoundSterling className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatter.format(totalModifications)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Mileage</CardTitle>
              <Milestone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">11,897 miles</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>Annual Mileage</CardHeader>
          <CardContent className="pl-2">
            <Mileage data={[4, 8]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default DashboardPage;
