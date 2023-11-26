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
import { Configure } from "./components/configure";

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
      dashboardConfigure: true,
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
      <div className="flex-1 space-y-4 p-8 pt-2">
        <div className="flex items-center justify-between">
          <Heading
            title="Dashboard"
            description="An overview of your vehicle"
          />
          {vehicle.dashboardConfigure && (
            <Configure initialData={vehicle.dashboardConfigure} />
          )}
        </div>
        <Separator />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {vehicle.dashboardConfigure?.taxAndMot && (
            <TaxAndMOT initialData={vehicle.dvlaData} />
          )}
          {vehicle.dashboardConfigure?.insurance && (
            <InsuranceCard initialData={vehicle?.insurance} />
          )}
          {vehicle.dashboardConfigure?.totalModifications && (
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
          )}
          {vehicle.dashboardConfigure?.mileage && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Mileage</CardTitle>
                <Milestone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">11,897 miles</div>
              </CardContent>
            </Card>
          )}
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
