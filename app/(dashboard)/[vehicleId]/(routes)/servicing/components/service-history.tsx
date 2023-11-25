"use client";
import { useParams, useRouter } from "next/navigation";

import { Vehicle } from "@prisma/client";

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceHistoryProps {
  initialData: Vehicle;
}

export const ServiceHistory: React.FC<ServiceHistoryProps> = ({
  initialData,
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
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon 🔨</CardTitle>
          <CardDescription></CardDescription>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
};
