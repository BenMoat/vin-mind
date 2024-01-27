"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { differenceInHours } from "date-fns";

import { DvlaData } from "@prisma/client";
import { vehicleEnquiry } from "@/app/actions/vehicle";

import CardSkeleton from "./card-skeleton";
import { LastUpdatedBadge } from "../last-updated-badge";
import { TaxAndMOTModal } from "../modals/tax-and-mot-modal";

import { CheckCircle, InfoIcon, PlusCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DvlaDataProps {
  vehicleId: string;
  initialData: DvlaData | null;
}

export const TaxAndMOTCards: React.FC<DvlaDataProps> = ({
  vehicleId,
  initialData,
}) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registrationNumber = initialData?.registrationNumber;

  useEffect(() => {
    if (registrationNumber) {
      const { updatedAt } = initialData;
      const timeDifference = differenceInHours(new Date(), new Date(updatedAt));

      if (timeDifference > 24) {
        const handleVehicleEnquiry = async () => {
          try {
            const response = await vehicleEnquiry(
              vehicleId,
              registrationNumber
            );
            saveData(response);
          } catch (error) {
            setError("Failed to retrieve Tax and MOT status.");
          }
        };

        handleVehicleEnquiry();
      }
    }
  }, [registrationNumber, initialData, vehicleId]);

  async function saveData(data: DvlaDataProps) {
    try {
      setLoading(true);
      setError("");
      if (initialData) {
        await axios.patch(
          `/api/${vehicleId}/vehicle-enquiry/save-enquiry`,
          data
        );
      }
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError("Failed to sync DVLA data with database.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TaxAndMOTModal
        vehicleId={vehicleId}
        initialData={initialData}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      {error ? (
        <div className="px-6 py-6 space-y-2 w-full rounded-lg border text-center">
          <span className="flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </span>
          <p className="text-sm">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : loading ? (
        <>
          <CardSkeleton />
          <CardSkeleton />
        </>
      ) : initialData ? (
        <>
          <Card className="relative text-center">
            <LastUpdatedBadge tax updatedAt={initialData.updatedAt} />
            <CardHeader className="pb-1">
              <CardTitle className="pb-1">Tax</CardTitle>
              <CardDescription>
                <span className="flex items-center justify-center">
                  {initialData.taxStatus === "Taxed" ? (
                    <CheckCircle className="w-8 h-8 mr-2 text-green" />
                  ) : (
                    <XCircle className="w-8 h-8 mr-2 text-destructive" />
                  )}
                  {initialData.taxStatus}
                </span>
              </CardDescription>
            </CardHeader>
            {initialData.taxDueDate && (
              <CardContent>
                Due:{" "}
                {new Date(initialData.taxDueDate).toLocaleDateString("en-GB")}
              </CardContent>
            )}
          </Card>

          <Card className="relative text-center">
            <LastUpdatedBadge mot updatedAt={initialData.updatedAt} />
            <CardHeader className="pb-1">
              <CardTitle className="pb-1">MOT</CardTitle>
              <CardDescription>
                <span className="flex items-center justify-center">
                  {initialData.motStatus === "Valid" ? (
                    <CheckCircle className="w-8 h-8 mr-2 text-green" />
                  ) : initialData.motStatus === "No details held by DVLA" ? (
                    <InfoIcon className="w-8 h-8 mr-2" />
                  ) : (
                    <XCircle className="w-8 h-8 mr-2 text-destructive" />
                  )}
                  {initialData.motStatus}
                </span>
              </CardDescription>
            </CardHeader>
            {initialData.motExpiryDate && (
              <CardContent>
                Due:{" "}
                {new Date(initialData.motExpiryDate).toLocaleDateString(
                  "en-GB"
                )}
              </CardContent>
            )}
          </Card>
        </>
      ) : (
        <>
          <Card className="relative text-center">
            <CardHeader className="pb-1">
              <CardTitle className="pb-1">Tax</CardTitle>
              <CardDescription>
                <span className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    className="rounded-full w-10 p-0"
                    type="button"
                    onClick={() => setIsOpen(true)}
                  >
                    <PlusCircle className="h-8 w-8" />
                  </Button>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>Retrieve Tax status</CardContent>
          </Card>
          <Card className="relative text-center">
            <CardHeader className="pb-1">
              <CardTitle className="pb-1">MOT</CardTitle>
              <CardDescription>
                <span className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    className="rounded-full w-10 p-0"
                    type="button"
                    onClick={() => setIsOpen(true)}
                  >
                    <PlusCircle className="h-8 w-8" />
                  </Button>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>Retrieve MOT status</CardContent>
          </Card>
        </>
      )}
    </>
  );
};
