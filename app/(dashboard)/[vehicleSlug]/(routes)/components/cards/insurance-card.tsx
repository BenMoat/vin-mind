"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { differenceInHours } from "date-fns";

import { Insurance } from "@prisma/client";

import { CheckCircle, PlusCircle, XCircle } from "lucide-react";

import CardSkeleton from "./card-skeleton";
import { InsuranceModal } from "../modals/insurance-modal";
import { LastUpdatedBadge } from "../last-updated-badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InsuranceCardProps {
  vehicleId: string;
  initialData: Insurance | null;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  vehicleId,
  initialData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      const { updatedAt } = initialData;
      const timeDifference = differenceInHours(new Date(), new Date(updatedAt));

      if (timeDifference > 24) {
        const fetchData = async () => {
          try {
            const response = await axios.get(`/api/${vehicleId}/insurance`);

            saveData(response.data[0]);
          } catch (error) {
            setError("Failed to fetch insurance data.");
          }
        };

        fetchData();
      }
    }
  }, [initialData, vehicleId]);

  async function saveData(data: Insurance) {
    try {
      setLoading(true);
      await axios.patch(`/api/${vehicleId}/insurance`, data);
      setError("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError("Failed to sync insurance data.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <InsuranceModal
        vehicleId={vehicleId}
        initialData={initialData}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      {error ? (
        <div className="px-6 py-6 space-y-2 w-full rounded-lg border text-center">
          <span className="flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </span>
          <p className="text-sm">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      ) : loading ? (
        <CardSkeleton />
      ) : (
        <Card className="relative text-center">
          {initialData ? (
            <>
              <LastUpdatedBadge insurance updatedAt={initialData.updatedAt} />
              <CardHeader className="pb-1">
                <CardTitle className="pb-1">Insurance</CardTitle>
                <CardDescription>
                  {initialData.isInsured ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 mr-2 text-green" />
                      Insured
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <XCircle className="w-8 h-8 mr-2 text-destructive" />
                      Not Insured
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="whitespace-nowrap mr-2">
                  Due: {initialData.endDate.toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  className="h-6"
                  type="button"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Edit
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-1">
                <CardTitle className="pb-1">Insurance</CardTitle>
                <CardDescription>
                  <span className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      className="rounded-full w-10 p-0"
                      type="button"
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    >
                      <PlusCircle className="h-8 w-8" />
                    </Button>
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>Add a renewal reminder</CardContent>
            </>
          )}
        </Card>
      )}
    </>
  );
};
