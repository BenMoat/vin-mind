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
import CardSkeleton from "./card-skeleton";

interface DvlaData {
  registrationNumber: string;
  taxStatus: string;
  taxDueDate: Date;
  artEndDate: Date;
  motStatus: string;
  make: string;
  yearOfManufacture: number;
  engineCapacity: number;
  co2Emissions: number;
  fuelType: string;
  markedForExport: boolean;
  colour: string;
  typeApproval: string;
  euroStatus: string;
  dateOfLastV5CIssued: Date;
  motExpiryDate: Date;
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="px-6 py-6 space-y-2 w-full rounded-lg border text-center">
            <span className="flex items-center justify-center">
              {error.icon}
            </span>
            <p className="text-sm">{error.message.toString()}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {data && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
