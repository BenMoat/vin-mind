"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DvlaData } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import CardSkeleton from "./card-skeleton";
import { LastUpdatedBadge } from "./last-updated-badge";

interface DvlaDataProps {
  initialData: DvlaData;
}

export const TaxAndMOT: React.FC<DvlaDataProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registrationNumber = initialData.registrationNumber;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `/api/${params.vehicleId}/vehicle-enquiry`,
          { registrationNumber }
        );
        response.data.registrationNumber = registrationNumber;
        await saveData(response.data);
        setError("");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError("Failed to fetch data from the DVLA.");
        }
      } finally {
        setLoading(false);
      }
    };

    /* Cache a timestamp for when the data was last fetched. Compare it against the current time
    to determine whether to fetch new data or not.*/
    const storedTimestamp = parseInt(
      localStorage.getItem(`resTMS-${params.vehicleId}`) || "0",
      10
    );
    const currentTime = Date.now();
    const timeThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (currentTime - storedTimestamp > timeThreshold) {
      fetchData();
      localStorage.setItem(
        `resTMS-${params.vehicleId}`,
        currentTime.toString()
      );
    }
  }, [initialData, registrationNumber]);

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
      {error ? (
        <div className="px-6 py-6 space-y-2 w-full rounded-lg border text-center">
          <span className="flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </span>
          <p className="text-sm">{error}</p>
          <Button variant="outline">Retry</Button>
        </div>
      ) : loading ? (
        <>
          <CardSkeleton />
          <CardSkeleton />
        </>
      ) : (
        initialData && (
          <>
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
                  {initialData.taxDueDate && (
                    <CardContent className="pb-0">
                      Due:{" "}
                      {new Date(initialData.taxDueDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </CardContent>
                  )}
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
                  {initialData.taxDueDate && (
                    <CardContent className="pb-0">
                      Due:{" "}
                      {new Date(initialData.taxDueDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </CardContent>
                  )}
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
                  {initialData.motExpiryDate && (
                    <CardContent className="pb-0">
                      Due:{" "}
                      {new Date(initialData.motExpiryDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </CardContent>
                  )}
                </CardHeader>
              </Card>
            ) : (
              <Card className="relative px-6 space-y-2 text-center">
                <LastUpdatedBadge mot updatedAt={initialData.updatedAt} />
                <CardHeader>
                  <CardTitle>MOT</CardTitle>
                  <CardDescription>
                    <span className="flex items-center justify-center">
                      <XCircle className="w-8 h-8 mr-2 text-[#a92727]" />
                      {initialData.motStatus}
                    </span>
                  </CardDescription>
                  {initialData.motExpiryDate && (
                    <CardContent className="pb-0">
                      Due:{" "}
                      {new Date(initialData.motExpiryDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </CardContent>
                  )}
                </CardHeader>
              </Card>
            )}
          </>
        )
      )}
    </>
  );
};
