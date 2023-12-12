"use client";
import { ServiceHistory } from "@prisma/client";

import { formatMileage } from "@/lib/utils";

import { Milestone } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MileaCardProps {
  initialData: ServiceHistory;
}

export const MileageCard: React.FC<MileaCardProps> = ({ initialData }) => {
  const serviceDate = new Date(initialData.serviceDate);

  return (
    <Card className="relative px-6 space-y-2 text-center">
      <CardHeader>
        <CardTitle>Mileage</CardTitle>
        <CardDescription className="flex items-center justify-center boldText text-md">
          {initialData ? (
            <>
              <Milestone className="w-8 h-8 mr-2 text-[#adfa1d]" />
              {formatMileage(initialData.mileage)}
            </>
          ) : (
            <>
              <Milestone className="w-8 h-8 mr-2 text-gray-400 " />
            </>
          )}
        </CardDescription>
        <CardContent className="pb-0">
          {initialData ? (
            <>Since: {serviceDate.toLocaleDateString("en-GB")}</>
          ) : (
            <span className="text-sm italic">
              Enter your vehicle's service history to populate this card.
            </span>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
