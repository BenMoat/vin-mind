import prismadb from "@/lib/prismadb";

import { Eye } from "lucide-react";

import { ConfigureModal } from "./components/modals/configure-modal";
import { InsuranceCard } from "./components/cards/insurance-card";
import { Mileage } from "./components/mileage";
import { MileageCard } from "./components/cards/mileage-card";
import { ModificationsCard } from "./components/cards/modifications-card";
import { ServicingCard } from "./components/cards/servicing-card";
import { TaxAndMOTCards } from "./components/cards/tax-and-mot-cards";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DashboardPageProps {
  params: { vehicleId: string };
}

export const DashboardPage: React.FC<DashboardPageProps> = async ({
  params,
}) => {
  const vehicle = await prismadb.vehicle.findFirst({
    where: {
      id: params.vehicleId,
    },
    include: {
      modifications: true,
      dvlaData: true,
      insurance: true,
      dashboardConfigure: true,
      serviceHistory: {
        take: 1,
        orderBy: {
          serviceDate: "desc",
        },
      },
    },
  });

  const totalPriceOfModifications =
    vehicle?.modifications?.reduce(
      (total, modification) => total + Number(modification.price),
      0
    ) || 0;

  if (!vehicle) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <div className="absolute mt-[208px] ml-10">
          <img src="/where.gif" width="200" alt="Vehicle does not exist GIF" />
        </div>
        <div className="text-center">
          Are you sure this vehicle exists? <br></br> Please check the URL and
          try again.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <Heading title="Dashboard" description="An overview of your vehicle" />
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
          <InsuranceCard initialData={vehicle.insurance} />
        )}
        {vehicle.dashboardConfigure?.servicing && (
          <ServicingCard initialData={vehicle.serviceHistory[0]} />
        )}
        {vehicle.dashboardConfigure?.totalModifications && (
          <ModificationsCard
            totalPrice={totalPriceOfModifications}
            totalModifications={vehicle.modifications?.length}
          />
        )}
        {vehicle.dashboardConfigure?.mileage && (
          <MileageCard initialData={vehicle.serviceHistory[0]} />
        )}
      </div>
      <Card className="col-span-4">
        <CardHeader>Annual Mileage</CardHeader>
        <CardContent className="pl-2">
          <Mileage data={[4, 8]} />
        </CardContent>
      </Card>
    </div>
  );
};
export default DashboardPage;
