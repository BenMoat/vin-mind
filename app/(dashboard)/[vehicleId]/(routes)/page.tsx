import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { getTotalModifications } from "@/actions/get-total-modifications";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { CarIcon, Eye, Milestone, PoundSterling } from "lucide-react";

import { TaxAndMOTCards } from "./components/cards/tax-and-mot-cards";
import { Mileage } from "./components/mileage";
import { InsuranceCard } from "./components/cards/insurance-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ConfigureModal } from "./components/modals/configure-modal";
import { Button } from "@/components/ui/button";

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
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Heading
            title="Dashboard"
            description="An overview of your vehicle"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Eye className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:block">Cards</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="space-y-2">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Cards</h4>
                <p className="text-sm text-muted-foreground">
                  Toggle the visibility of cards on your dashboard.
                </p>
              </div>
              <ConfigureModal initialData={vehicle.dashboardConfigure} />
            </PopoverContent>
          </Popover>
        </div>
        <Separator />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {vehicle.dashboardConfigure?.taxAndMot && (
            <TaxAndMOTCards initialData={vehicle.dvlaData} />
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
