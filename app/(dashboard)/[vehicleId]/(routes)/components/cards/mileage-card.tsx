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
  initialData: ServiceHistory | null;
}

export const MileageCard: React.FC<MileaCardProps> = ({ initialData }) => {
  const serviceDate = initialData && new Date(initialData.serviceDate);

  return (
    <Card className="relative px-6 space-y-2 text-center">
      <CardHeader>
        <CardTitle>Mileage</CardTitle>
        <CardDescription className="flex items-center justify-center text-bold text-md">
          {initialData ? (
            <>
              <Milestone className="w-8 h-8 mr-2 text-green" />
              {formatMileage(initialData.mileage)}
            </>
          ) : (
            <>
              <Milestone className="w-8 h-8 mr-2 text-muted-foreground" />
            </>
          )}
        </CardDescription>
        <CardContent className="pb-0">
          {initialData ? (
            <>Since: {serviceDate?.toLocaleDateString("en-GB")}</>
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
