"use client";

import { CheckCircle, InfoIcon, PlusCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LastUpdatedBadge } from "@/app/(dashboard)/[vehicleId]/(routes)/components/last-updated-badge";

interface MockVehicleStatusProps {
  updatedAt: Date;
  taxStatus: string;
  taxDueDate: Date;
}

export const MockVehicleStatus: React.FC<MockVehicleStatusProps> = ({
  updatedAt,
  taxStatus,
  taxDueDate,
}) => {
  return (
    <Card className="relative text-center">
      <LastUpdatedBadge tax updatedAt={updatedAt} />
      <CardHeader className="pb-1">
        <CardTitle className="pb-1">Tax</CardTitle>
        <CardDescription>
          <span className="flex items-center justify-center">
            {taxStatus === "Taxed" ? (
              <CheckCircle className="w-8 h-8 mr-2 text-green" />
            ) : (
              <XCircle className="w-8 h-8 mr-2 text-destructive" />
            )}
            {taxStatus}
          </span>
        </CardDescription>
      </CardHeader>
      {taxDueDate && (
        <CardContent>
          Due: {new Date(taxDueDate).toLocaleDateString("en-GB")}
        </CardContent>
      )}
    </Card>
  );
};
