"use client";

import { ServiceHistory } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, InfoIcon, PlusCircle, XCircle } from "lucide-react";

interface ServiceHistoryCardProps {
  initialData: ServiceHistory | null;
}

export const ServicingCard: React.FC<ServiceHistoryCardProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <Card className="relative px-6 space-y-2 text-center">
      {initialData ? (
        <CardHeader>
          <CardTitle>Servicing</CardTitle>
          <CardDescription>
            <span className="flex items-center justify-center">
              {initialData.nextServiceDate &&
              new Date(initialData.serviceDate) <
                new Date(initialData.nextServiceDate) ? (
                <>
                  <CheckCircle className="w-8 h-8 mr-2 text-[#adfa1d]" />
                  Serviced
                </>
              ) : initialData.nextServiceDate === null ? (
                <>
                  <InfoIcon className="w-8 h-8 mr-2" />
                  No next service date
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 mr-2 text-[#7f1d1d]" />
                  Service Overdue
                </>
              )}
            </span>
          </CardDescription>
          {initialData.nextServiceDate ? (
            <CardContent className="pb-0">
              Due:{" "}
              {new Date(initialData.nextServiceDate).toLocaleDateString(
                "en-GB"
              )}
            </CardContent>
          ) : (
            <CardContent className="pb-0 inline-flex justify-center">
              <span className="whitespace-nowrap mr-2">Due: Not Set</span>
              <Button
                variant="outline"
                className="h-6"
                type="button"
                onClick={() => {
                  router.push(
                    `/${params.vehicleId}/servicing/${initialData.id}`
                  );
                }}
              >
                Edit
              </Button>
            </CardContent>
          )}
        </CardHeader>
      ) : (
        <CardHeader className="pt-7">
          <CardTitle>Servicing</CardTitle>
          <CardDescription>
            <span className="flex items-center justify-center">
              <Button
                variant="ghost"
                className="rounded-full w-10 p-0 mb-[-5px]"
                type="button"
                onClick={() => {
                  router.push(`/${params.vehicleId}/servicing/new`);
                }}
              >
                <PlusCircle className="h-8 w-8" />
              </Button>
            </span>
          </CardDescription>
          <CardContent className="pb-0">Add a servicing</CardContent>
        </CardHeader>
      )}
    </Card>
  );
};
