"use client";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DvlaData } from "@prisma/client";

interface DvlaDataProps {
  initialData: DvlaData;
}

export const TaxAndMOT: React.FC<DvlaDataProps> = ({ initialData }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {initialData.taxStatus === "Taxed" ? (
        <Card className="px-6 space-y-2 text-center">
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
              {new Date(initialData.taxDueDate).toLocaleDateString("en-GB")}
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
                {initialData.taxStatus}
              </span>
            </CardDescription>
            <CardContent className="pb-0">
              Due:{" "}
              {new Date(initialData.taxDueDate).toLocaleDateString("en-GB")}
            </CardContent>
          </CardHeader>
        </Card>
      )}

      {initialData.motStatus === "Valid" ? (
        <Card className="px-6 space-y-2 text-center">
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
              {new Date(initialData.motExpiryDate).toLocaleDateString("en-GB")}
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
                {initialData.motStatus}
              </span>
            </CardDescription>
            <CardContent className="pb-0">
              {initialData.motExpiryDate
                ? "Expires: " +
                  new Date(initialData.motExpiryDate).toLocaleDateString(
                    "en-GB"
                  )
                : "Expires: --/--/----"}
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
