"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ServiceHistory } from "@prisma/client";

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
        <Button
          onClick={() => router.push(`/${params.vehicleId}/servicing/new`)}
          className="flex items-center"
        >
          <Plus className="sm:mr-2 h-4 w-4" />
          <span className="hidden sm:block">Add Servicing</span>
        </Button>
      </div>
      <Separator />
      {data.map((service, index) => (
        <div
          className="!mb-20 relative flex items-center justify-center"
          key={index}
        >
          <Link href={`/${params.vehicleId}/servicing/${service.id}`}>
            <Card key={index} className="w-[600px] mx-auto">
              <CardHeader>
                <CardTitle className="flex justify-center">
                  {service.type}
                </CardTitle>
                <CardDescription className="flex justify-center">
                  {service.provider} ·{" "}
                  {service.serviceDate.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {service.details}
              </CardContent>
              <CardFooter className="flex justify-center">
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                }).format(+service.cost)}
              </CardFooter>
            </Card>
          </Link>
          {index < data.length - 1 && (
            <div className="absolute left-1/2 bottom-[-80px] transform -translate-x-1/2 h-20 w-0.5 bg-secondary"></div>
          )}
        </div>
      ))}
    </>
  );
};
