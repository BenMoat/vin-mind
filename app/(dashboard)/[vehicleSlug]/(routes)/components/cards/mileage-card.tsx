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
    <Card className="text-center">
      <CardHeader className="pb-1">
        <CardTitle className="pb-1">Mileage</CardTitle>
        <CardDescription className="flex items-center justify-center text-bold text-md">
          {initialData ? (
            <>
              <Milestone className="w-8 h-8 mr-2 text-green" />
              {formatMileage(initialData.mileage)}
            </>
          ) : (
            <Milestone className="w-8 h-8 mr-2 text-muted-foreground" />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {initialData ? (
          <>Since: {serviceDate?.toLocaleDateString("en-GB")}</>
        ) : (
          <span className="text-sm italic whitespace-nowrap">
            Populated by vehicle service history
          </span>
        )}
      </CardContent>
    </Card>
  );
};
