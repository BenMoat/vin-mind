"use client";

import { useState } from "react";
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

interface InsuranceCardProps {
  initialData: Insurance | null;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InsuranceModal
        initialData={initialData}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
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
                <span>Due: {initialData.endDate.toLocaleDateString()}</span>
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
    </>
  );
};
