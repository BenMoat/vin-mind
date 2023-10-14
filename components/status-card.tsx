import { CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { DvlaData } from "./tax-and-mot";
import { Skeleton } from "./ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface StatusCardProps {
  data: DvlaData | null;
  loading?: boolean;
  mot?: boolean;
  tax?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  data,
  mot,
  tax,
  loading,
}) => {
  return (
    <>
      {loading && (
        <Card className="px-6 space-y-2 text-center">
          <CardHeader className="flex items-center justify-center">
            <CardTitle>
              <div>
                <Skeleton className="h-6 w-[60px]" />
              </div>
            </CardTitle>
            <div className="flex items-center justify-center">
              <Skeleton className="w-8 h-8 mr-2 rounded-full" />
              <Skeleton className="h-4 w-[50px]" />
            </div>
            <CardContent className="pb-0">
              <div>
                <Skeleton className="h-5 w-[140px]" />
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      )}
      {data && (
        <>
          {tax && data?.taxStatus === "Taxed" ? (
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
                  Expires: {data?.taxDueDate}
                </CardContent>
              </CardHeader>
            </Card>
          ) : (
            tax && (
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
                    Expires: {data?.taxDueDate}
                  </CardContent>
                </CardHeader>
              </Card>
            )
          )}

          {mot && data?.motStatus === "Valid" ? (
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
                  Expires: {data?.motExpiryDate}
                </CardContent>
              </CardHeader>
            </Card>
          ) : (
            mot && (
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
                    Expires: {data?.motExpiryDate}
                  </CardContent>
                </CardHeader>
              </Card>
            )
          )}
        </>
      )}
    </>
  );
};
