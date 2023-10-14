"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  RegexIcon,
  TextCursor,
  TextCursorInput,
  XCircle,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface DvlaData {
  registrationNumber: string;
  taxStatus: string;
  taxDueDate: string;
  motStatus: string;
  motExpiryDate: string;
  artEndDate: string;
  make: string;
  colour: string;
  yearOfManufacture: number;
  engineCapacity: number;
  co2Emissions: number;
  fuelType: string;
  markedForExport: boolean;
  typeApproval: string;
  euroStatus: string;
  dateOfLastV5CIssued: string;
  wheelplan: string;
  monthOfFirstRegistration: string;
}

interface DvlaCardProps {
  registrationNumber: string;
}

interface ErrorState {
  message: string | null;
  icon: JSX.Element | null;
}

export const DVLACard: React.FC<DvlaCardProps> = ({ registrationNumber }) => {
  const params = useParams();

  const [dvlaData, setDvlaData] = useState<DvlaData | null>(null);
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
        setDvlaData(response.data);
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
      {loading && (
        <div className="px-6 py-6 space-y-2 w-40 rounded-lg border text-center">
          <div>
            <div className="flex items-center justify-center">
              <Skeleton className="w-8 h-8 mr-2 rounded-full" />
              <Skeleton className="h-4 w-[50px]" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      )}
      {error.message !== null && (
        <div className="px-6 py-6 space-y-2 w-40 rounded-lg border text-center">
          <div>
            <span className="flex items-center justify-center">
              <>{error.icon}</>
            </span>
          </div>
          <p className="text-sm">{error.message}</p>
        </div>
      )}
      {dvlaData && (
        <div className="px-6 py-6 space-y-2 w-40 rounded-lg border text-center">
          <div>
            <span className="flex items-center justify-center">
              {dvlaData?.taxStatus === "Taxed" ? (
                <>
                  <CheckCircle className="w-8 h-8 mr-2 text-green-500" />
                  {dvlaData?.taxStatus}
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 mr-2 text-red-500" />
                  {dvlaData?.taxStatus}
                </>
              )}
            </span>
          </div>
          <p className="text-sm">
            Due:{" "}
            {dvlaData?.taxDueDate
              ? new Date(dvlaData.taxDueDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })
              : "--/--/--"}
          </p>
        </div>
      )}
    </>
  );
};
