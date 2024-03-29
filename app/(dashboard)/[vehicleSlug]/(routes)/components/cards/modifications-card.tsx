import { formatCurrency } from "@/lib/utils";

import { Wrench } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ModificationsCardProps {
  totalPrice: number;
  totalModifications: number;
  className?: string;
}

export const ModificationsCard: React.FC<ModificationsCardProps> = ({
  totalPrice,
  totalModifications,
  className,
}) => {
  return (
    <Card className={`text-center ${className}`}>
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
