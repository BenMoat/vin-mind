import { getTotalModifications } from "@/actions/get-total-modifications";
import { TaxAndMOT } from "@/components/tax-and-mot";
import { Heading } from "@/components/heading";
import { Mileage } from "@/components/mileage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { Milestone, PoundSterling, Wallet } from "lucide-react";
import prismadb from "@/lib/prismadb";

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
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="An overview of your vehicle" />
        <Separator />
        {vehicle?.dvlaData[0] && (
          <TaxAndMOT initialData={vehicle?.dvlaData[0]} />
        )}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Total of {vehicle?.modifications.length} Modifications
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Insurance Due
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">01/03/04</div>
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
