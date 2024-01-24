import { Modification } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { stringify } from "@/lib/utils";

import { getVehicleBySlug } from "@/app/actions/vehicle";

import { Eye, HelpCircle } from "lucide-react";

import { ConfigureModal } from "./components/modals/configure-modal";
import { InsuranceCard } from "./components/cards/insurance-card";
import { MileageCard } from "./components/cards/mileage-card";
import { ModificationsCard } from "./components/cards/modifications-card";
import { PhotoGallery } from "./components/photo-gallery";
import { ServicingCard } from "./components/cards/servicing-card";
import { TaxAndMOTCards } from "./components/cards/tax-and-mot-cards";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DashboardPageProps {
  params: { vehicleSlug: string };
}

export const DashboardPage: React.FC<DashboardPageProps> = async ({
  params,
}) => {
  const vehicle = await getVehicleBySlug(params.vehicleSlug);

  const vehicleDashboard = await prismadb.vehicle.findFirst({
    where: {
      id: vehicle.id,
    },
    include: {
      dashboardConfigure: true,
      images: true,
      dvlaData: true,
      insurance: true,
      modifications: true,
      serviceHistory: {
        orderBy: {
          serviceDate: "desc",
        },
      },
    },
  });

  if (!vehicleDashboard) {
    return (
      <>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <HelpCircle className="h-10 w-10 mb-2" />
          Are you sure this vehicle exists? <br></br> Please check the URL and
          try again.
        </div>
        <div className="absolute bottom-0">
          <img src="/where.gif" width="200" alt="Vehicle does not exist GIF" />
        </div>
      </>
    );
  }

  const totalPriceOfModifications =
    vehicleDashboard.modifications?.reduce(
      (total: number, modification: Modification) =>
        total + Number(modification.price),
      0
    ) || 0;

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
            <ConfigureModal initialData={vehicleDashboard.dashboardConfigure} />
          </PopoverContent>
        </Popover>
      </div>
      <Separator />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {vehicleDashboard.dashboardConfigure?.taxAndMot && (
          <TaxAndMOTCards initialData={vehicleDashboard.dvlaData} />
        )}
        {vehicleDashboard.dashboardConfigure?.insurance && (
          <InsuranceCard initialData={vehicleDashboard.insurance} />
        )}
        {vehicleDashboard.dashboardConfigure?.servicing && (
          <ServicingCard
            initialData={stringify(vehicleDashboard.serviceHistory[0])}
          />
        )}
        {vehicleDashboard.dashboardConfigure?.totalModifications && (
          <ModificationsCard
            totalPrice={totalPriceOfModifications}
            totalModifications={vehicleDashboard.modifications?.length}
          />
        )}
        {vehicleDashboard.dashboardConfigure?.mileage && (
          <MileageCard
            initialData={stringify(vehicleDashboard.serviceHistory[0])}
          />
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Photo Gallery</CardTitle>
          <CardDescription>
            Upload up to 5 pictures of your {vehicleDashboard.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PhotoGallery
            initialData={vehicleDashboard.images.map((image) => image.url)}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default DashboardPage;
