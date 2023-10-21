"use client";

import { useState } from "react";
import { SubmitHandler, FieldValues } from "react-hook-form";
import axios from "axios";
import { DvlaData } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DvlaDataProps {
  initialData: DvlaData | null;
}

interface ErrorState {
  message: string | null;
}

export const RegChecker: React.FC<DvlaDataProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ message: null });

  const { handleSubmit } = useForm();
  const form = useForm<DvlaDataProps>({
    defaultValues: {
      initialData: initialData,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    setLoading(true);
    const registrationNumber =
      form.getValues("initialData.registrationNumber") ||
      initialData?.registrationNumber; // Use initialData if form value is empty
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `/api/${params.vehicleId}/vehicle-enquiry`,
          { registrationNumber }
        );
        await saveData(response.data);
        setError({ message: null });
        toast.success("Registration updated");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError({
            message: error.response.data.message,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  async function saveData(data: DvlaDataProps) {
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.vehicleId}/vehicle-enquiry/save-enquiry`,
          data
        );
      } else {
        await axios.post(
          `/api/${params.vehicleId}/vehicle-enquiry/save-enquiry`,
          data
        );
      }
      router.refresh(); // Ensure latest data is displayed ASAP
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  //Check if the two registraion numbers are equal, ignoring whitespace and casing
  function areEqual(value1: string, value2: string | null) {
    if (value1 && value2) {
      const sanitizedValue1 = value1.replace(/\s/g, "").toUpperCase();
      const sanitizedValue2 = value2.replace(/\s/g, "").toUpperCase();
      return sanitizedValue1 === sanitizedValue2;
    }
    return false;
  }

  return (
    <Card className="max-w-full md:max-w-[407px]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="initialData.registrationNumber"
            render={({ field }) => (
              <FormItem>
                <CardHeader>
                  <CardTitle>Number Plate</CardTitle>
                  <CardDescription>
                    Enter your vehicle's registration number to view its
                    up-to-date tax and MOT status in the <b>Overview</b> tab.
                    This is directly sourced from the{" "}
                    <a
                      className="underline font-bold"
                      href="https://dvladigital.blog.gov.uk/2020/03/12/dvlas-new-api-developer-portal-launch-first-api-vehicle-enquiry-service-ves-on-gov-uk/"
                      target="_blank"
                    >
                      DVLA
                    </a>
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 !mt-[-12px]">
                  <Input
                    className="max-w-[140px] font-UKNumberPlate text-center bg-yellow-400 text-2xl uppercase"
                    disabled={loading}
                    placeholder="YOUR REG"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                  <FormMessage>{error.message}</FormMessage>
                  <Button
                    disabled={
                      loading ||
                      areEqual(
                        field.value,
                        initialData?.registrationNumber || ""
                      )
                    }
                    type="submit"
                  >
                    {initialData ? "Update" : "Add"} Reg
                  </Button>
                </CardContent>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Card>
  );
};
