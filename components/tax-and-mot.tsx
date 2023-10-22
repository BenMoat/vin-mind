"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DvlaData } from "@prisma/client";
import { LastUpdatedBadge } from "./last-updated-badge";
import CardSkeleton from "./card-skeleton";
import { Button } from "./ui/button";

interface DvlaDataProps {
  initialData: DvlaData;
}

export const TaxAndMOT: React.FC<DvlaDataProps> = ({ initialData }) => {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registrationNumber = initialData.registrationNumber;
  const now = new Date();
  const updatedAt = new Date(initialData.updatedAt);
  const hoursSinceUpdate =
    (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

  const fetchData = async () => {
    try {
      if (hoursSinceUpdate < 24) {
        setLoading(true);
        setError("");
        const response = await axios.post(
          `/api/${params.vehicleId}/vehicle-enquiry`,
          { registrationNumber }
        );
        await saveData(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError("Failed to fetch data from the DVLA.");
      }
    } finally {
      setLoading(false);
    }
  };

  async function saveData(data: DvlaDataProps) {
    try {
      setLoading(true);
      setError("");
      if (initialData) {
        await axios.patch(
          `/api/${params.vehicleId}/vehicle-enquiry/save-enquiry`,
          data
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError("Failed to sync DVLA data with database.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    fetchData();
  };

  return (
    <>
      {error ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="px-6 py-6 space-y-2 w-full rounded-lg border text-center">
            <span className="flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </span>
            <p className="text-sm">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </div>
      ) : loading ? (
        <div className="grid gap-4 grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        initialData && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {initialData.taxStatus === "Taxed" ? (
              <Card className="relative px-6 space-y-2 text-center">
                <LastUpdatedBadge tax updatedAt={initialData.updatedAt} />
                <CardHeader>
                  <CardTitle>Tax</CardTitle>
                  <CardDescription>
                    <span className="flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 mr-2 text-[#adfa1d]" />
                      {initialData.taxStatus}
                    </span>
                  </CardDescription>
                  <CardContent className="pb-0">
                    Due:{" "}
                    {new Date(initialData.taxDueDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            ) : (
              <Card className="relative px-6 space-y-2 text-center">
                <LastUpdatedBadge tax updatedAt={initialData.updatedAt} />
                <CardHeader>
                  <CardTitle>Tax</CardTitle>
                  <CardDescription>
                    <span className="flex items-center justify-center">
                      <XCircle className="w-8 h-8 mr-2 text-[#7f1d1d]" />
                      {initialData.taxStatus}
                    </span>
                  </CardDescription>
                  <CardContent className="pb-0">
                    Due:{" "}
                    {new Date(initialData.taxDueDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            )}

            {initialData.motStatus === "Valid" ? (
              <Card className="relative px-6 space-y-2 text-center">
                <LastUpdatedBadge mot updatedAt={initialData.updatedAt} />
                <CardHeader>
                  <CardTitle>MOT</CardTitle>
                  <CardDescription>
                    <span className="flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 mr-2 text-[#adfa1d]" />
                      {initialData.motStatus}
                    </span>
                  </CardDescription>
                  <CardContent className="pb-0">
                    Expires:{" "}
                    {new Date(initialData.motExpiryDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            ) : (
              <Card className="relative px-6 space-y-2 text-center">
                <LastUpdatedBadge mot updatedAt={initialData.updatedAt} />
                <CardHeader>
                  <CardTitle>MOT</CardTitle>
                  <CardDescription>
                    <span className="flex items-center justify-center">
                      <XCircle className="w-8 h-8 mr-2 text-[#7f1d1d]" />
                      {initialData.motStatus}
                    </span>
                  </CardDescription>
                  <CardContent className="pb-0">
                    Expires:{" "}
                    {new Date(initialData.motExpiryDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            )}
          </div>
        )
      )}
    </>
  );
};
