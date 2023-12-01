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
          <span className="hidden sm:block">Add New</span>
        </Button>
      </div>
      <Separator />
      {data.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{item?.provider}</CardTitle>
            <CardDescription>{item?.details}</CardDescription>
          </CardHeader>
          <CardContent>tset</CardContent>
          <CardFooter>tset</CardFooter>
        </Card>
      ))}
    </>
  );
};
