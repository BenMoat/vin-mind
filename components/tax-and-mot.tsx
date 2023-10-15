"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import CardSkeleton from "./card-skeleton";

export interface DvlaData {
  registrationNumber: string;
  taxStatus: string;
  taxDueDate: Date;
  motStatus: string;
  motExpiryDate: Date;
  artEndDate: Date;
  make: string;
  colour: string;
  yearOfManufacture: number;
  engineCapacity: number;
  co2Emissions: number;
  fuelType: string;
  markedForExport: boolean;
  typeApproval: string;
  euroStatus: string;
  dateOfLastV5CIssued: Date;
  wheelplan: string;
  monthOfFirstRegistration: string;
}

interface DvlaCardProps {
  registrationNumber?: string;
}

interface ErrorState {
  message: string | null;
  icon: JSX.Element | null;
}

export const TaxAndMOT: React.FC<DvlaCardProps> = ({ registrationNumber }) => {
  if (!registrationNumber) {
    return null;
  }

  const params = useParams();

  const [data, setData] = useState<DvlaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ message: null, icon: null });

  useEffect(() => {
    setLoading(true);
    const registratonNumber = JSON.stringify({
      registrationNumber: registrationNumber,
    });
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `/api/${params.vehicleId}/vehicle-enquiry`,
          registratonNumber
        );
        setData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError({
            message: error.response.data.message,
            icon: <XCircle className="w-8 h-8 text-red-500" />,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.vehicleId]);

  return (
    <>
      {error.message !== null && (
        <div className="px-6 py-6 space-y-2 w-full rounded-lg border text-center">
          <div>
            <span className="flex items-center justify-center">
              {error.icon}
            </span>
          </div>
          <p className="text-sm">{error.message.toString()}</p>
        </div>
      )}

      {loading && (
        <div className="grid gap-4 grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {data && (
        <div className="grid gap-4 grid-cols-3">
          {data?.taxStatus === "Taxed" ? (
            <Card className="px-6 space-y-2 text-center">
              <CardHeader>
                <CardTitle>Tax</CardTitle>
                <CardDescription>
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 mr-2 text-[#adfa1d]" />
                    {data?.taxStatus}
                  </span>
                </CardDescription>
                <CardContent className="pb-0">
                  Due: {new Date(data?.taxDueDate).toLocaleDateString("en-GB")}
                </CardContent>
              </CardHeader>
            </Card>
          ) : (
            <Card className="px-6 space-y-2 text-center">
              <CardHeader>
                <CardTitle>Tax</CardTitle>
                <CardDescription>
                  <span className="flex items-center justify-center">
                    <XCircle className="w-8 h-8 mr-2 text-[#7f1d1d]" />
                    {data?.taxStatus}
                  </span>
                </CardDescription>
                <CardContent className="pb-0">
                  Due: {new Date(data?.taxDueDate).toLocaleDateString("en-GB")}
                </CardContent>
              </CardHeader>
            </Card>
          )}

          {data?.motStatus === "Valid" ? (
            <Card className="px-6 space-y-2 text-center">
              <CardHeader>
                <CardTitle>MOT</CardTitle>
                <CardDescription>
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 mr-2 text-[#adfa1d]" />
                    {data?.motStatus}
                  </span>
                </CardDescription>
                <CardContent className="pb-0">
                  Expires:{" "}
                  {new Date(data?.motExpiryDate).toLocaleDateString("en-GB")}
                </CardContent>
              </CardHeader>
            </Card>
          ) : (
            <Card className="px-6 space-y-2 text-center">
              <CardHeader>
                <CardTitle>MOT</CardTitle>
                <CardDescription>
                  <span className="flex items-center justify-center">
                    <XCircle className="w-8 h-8 mr-2 text-[#7f1d1d]" />
                    {data?.motStatus}
                  </span>
                </CardDescription>
                <CardContent className="pb-0">
                  {data?.motExpiryDate
                    ? "Expires:" +
                      new Date(data?.motExpiryDate).toLocaleDateString("en-GB")
                    : "Expires: --/--/----"}
                </CardContent>
              </CardHeader>
            </Card>
          )}
        </div>
      )}
    </>
  );
};
