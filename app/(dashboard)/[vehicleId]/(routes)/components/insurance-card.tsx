"use client";

import { useEffect, useState } from "react";
import { Insurance } from "@prisma/client";

import { LastUpdatedBadge } from "./last-updated-badge";
import { InsuranceModal } from "./insurance-modal";

import { CheckCircle, PlusCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import CardSkeleton from "./card-skeleton";

interface InsuranceCardProps {
  initialData: Insurance | null;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  initialData,
}) => {
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/${params.vehicleId}/insurance`);

        // Check if the insurance is still valid against today's date
        const today = new Date();
        const endDate = new Date(response.data[0].endDate);

        if (endDate >= today) {
          response.data[0].isInsured = true;
        } else {
          response.data[0].isInsured = false;
        }

        await saveData(response.data[0]);
        setError("");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError("Failed to fetch insurance data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initialData]);

  async function saveData(data: Insurance) {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.vehicleId}/insurance`, data);
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
        initialData={initialData}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      {error ? (
        <div className="px-6 py-6 space-y-2 w-full rounded-lg border text-center">
          <span className="flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </span>
          <p className="text-sm">{error}</p>
          <Button variant="outline">Retry</Button>
        </div>
      ) : loading ? (
        <CardSkeleton />
      ) : (
        <Card className="relative px-6 space-y-2 text-center">
          {initialData ? (
            <>
              <LastUpdatedBadge insurance updatedAt={initialData.updatedAt} />
              <CardHeader>
                <CardTitle>Insurance</CardTitle>
                <CardDescription>
                  {initialData.isInsured ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 mr-2 text-[#adfa1d]" />
                      Insured
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <XCircle className="w-8 h-8 mr-2 text-[#fa1d1d]" />
                      Not Insured
                    </span>
                  )}
                </CardDescription>
                <CardContent className="pb-0 flex justify-between items-center">
                  <span className="whitespace-nowrap mr-2">
                    Due: {initialData.endDate.toLocaleDateString()}
                  </span>
                  <Button
                    variant="outline"
                    className="h-6 "
                    type="button"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </CardContent>
              </CardHeader>
            </>
          ) : (
            <CardHeader className="pt-7">
              <CardTitle>Insurance</CardTitle>
              <CardDescription>
                <span className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    className="rounded-full w-10 p-0 mb-[-5px]"
                    type="button"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <PlusCircle className="h-8 w-8" />
                  </Button>
                </span>
              </CardDescription>
              <CardContent className="pb-0">Add a renewal reminder</CardContent>
            </CardHeader>
          )}
        </Card>
      )}
    </>
  );
};
