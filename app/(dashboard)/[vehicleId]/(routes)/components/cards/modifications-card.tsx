"use client";
import { Wrench } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ModificationsCardProps {
  totalPrice: number;
  totalModifications: number;
}

export const ModificationsCard: React.FC<ModificationsCardProps> = ({
  totalPrice,
  totalModifications,
}) => {
  return (
    <Card className="relative px-6 space-y-2 text-center">
      <CardHeader>
        <CardTitle>Modifications</CardTitle>
        <CardDescription className="flex items-center justify-center text-bold text-md">
          {totalPrice ? (
            <>
              <Wrench className="w-8 h-8 mr-2 text-green" />
              {totalModifications}
            </>
          ) : (
            <>
              <Wrench className="w-8 h-8 mr-2 text-muted-foreground" />
            </>
          )}
        </CardDescription>
        <CardContent className="pb-0">
          {totalModifications ? (
            <>Costing: {formatCurrency.format(totalPrice)}</>
          ) : (
            <span className="text-sm italic">
              Enter your vehicle's modifications to populate this card.
            </span>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
