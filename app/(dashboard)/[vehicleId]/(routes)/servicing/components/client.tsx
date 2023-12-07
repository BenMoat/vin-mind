"use client";

import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ServiceHistory } from "@prisma/client";

import {
  calculateAndFormatTimeDifference,
  compareMileage,
  formatCurrency,
  formatMileage,
} from "@/lib/utils";

import { InfoIcon, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface ServiceHistoryProps {
  data: ServiceHistory[];
}

export const ServiceHistoryClient: React.FC<ServiceHistoryProps> = ({
  data,
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Service History"
          description="Manage your vehicle's service history."
        />
        {data.length > 0 && (
          <Button
            onClick={() => router.push(`/${params.vehicleId}/servicing/new`)}
            className="flex items-center"
          >
            <Plus className="sm:mr-2 h-4 w-4" />
            <span className="hidden sm:block">Add Servicing</span>
          </Button>
        )}
      </div>
      <Separator />

      {data.length === 0 ? (
        <div className="relative flex items-center !justify-center">
          <Card className="w-[600px]">
            <CardHeader>
              <CardTitle>Servicing Log</CardTitle>
              <CardDescription>
                Log your vehicle's services, and the list will automatically
                update to display the most recent service at the top.
              </CardDescription>
              <div className="flex justify-center">
                <Button
                  onClick={() =>
                    router.push(`/${params.vehicleId}/servicing/new`)
                  }
                  className="max-w-[200px] mt-2"
                >
                  <Plus className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:block">Add Servicing</span>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      ) : (
        data.map((service, index) => {
          // Compare the mileage difference the current service and next service
          const nextMilage = data[index + 1];
          const mileageDifference = nextMilage
            ? compareMileage(service.mileage, nextMilage.mileage)
            : null;

          // Compare the time difference between the current service and next service
          const nextService = data[index + 1];
          const timeDifference = nextService
            ? calculateAndFormatTimeDifference(
                new Date(nextService.serviceDate),
                new Date(service.serviceDate)
              )
            : "";

          return (
            <div
              className="!mb-[130px] relative flex items-center justify-center"
              key={index}
            >
              <Link href={`/${params.vehicleId}/servicing/${service.id}`}>
                <Card
                  key={index}
                  className="sm:w-[600px] transition-colors hover:bg-secondary"
                >
                  <CardHeader>
                    <CardTitle className="flex justify-center">
                      {service.type}
                    </CardTitle>
                    <CardDescription className="flex justify-center">
                      {service.provider} ·{" "}
                      {new Date(service.serviceDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    Mileage:&nbsp;
                    <b className="boldText">{formatMileage(service.mileage)}</b>
                  </CardContent>
                  {service.details && (
                    <CardContent className="flex justify-center">
                      <p>"{service.details}"</p>
                    </CardContent>
                  )}
                  {service.nextServiceDate && (
                    <CardContent className="flex justify-center">
                      <p>
                        <InfoIcon className="mr-1 mb-1 h-5 inline-block" />
                        Next Service Due:{" "}
                        <b className="boldText">
                          {new Date(
                            service.nextServiceDate
                          ).toLocaleDateString()}
                        </b>
                      </p>
                    </CardContent>
                  )}
                  <CardFooter className="flex justify-center">
                    Cost:{" "}
                    {formatCurrency.format(parseFloat(service.cost.toString()))}
                  </CardFooter>
                </Card>
              </Link>
              {index < data.length - 1 && (
                <>
                  <div className="w-[1px] bg-secondary absolute left-1/2 h-[29px] bottom-[-29px]"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-102px]">
                    <div className="flex items-center justify-center border rounded-md p-6 min-w-[220px] max-h-[75px]">
                      {mileageDifference !== null && (
                        <p className="text-center">
                          {`${mileageDifference} miles · ${timeDifference}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-[1px] bg-secondary absolute left-1/2 h-[30px] bottom-[-132px]"></div>
                </>
              )}
            </div>
          );
        })
      )}
    </>
  );
};
