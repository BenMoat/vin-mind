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
    <Card className="text-center">
      <CardHeader className="pb-1">
        <CardTitle className="pb-1">Modifications</CardTitle>
        <CardDescription className="flex items-center justify-center text-bold text-md">
          {totalPrice ? (
            <>
              <Wrench className="w-8 h-8 mr-2 text-green" />
              {totalModifications}
            </>
          ) : (
            <Wrench className="w-8 h-8 mr-2 text-muted-foreground" />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalModifications ? (
          <>Costing: {formatCurrency.format(totalPrice)}</>
        ) : (
          <span className="text-sm italic whitespace-nowrap">
            Populated by vehicle modifications
          </span>
        )}
      </CardContent>
    </Card>
  );
};
