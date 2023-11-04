"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { SubmitHandler, FieldValues } from "react-hook-form";
import { DvlaData } from "@prisma/client";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
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

export const RegChecker: React.FC<DvlaDataProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { handleSubmit } = useForm();
  const form = useForm<DvlaDataProps>({
    defaultValues: {
      initialData: initialData,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    setLoading(true);
    const registrationNumber = form.getValues("initialData.registrationNumber");
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `/api/${params.vehicleId}/vehicle-enquiry`,
          { registrationNumber }
        );
        response.data.registrationNumber = registrationNumber;
        await saveData(response.data);
        setError("");
        toast.success("Registration updated");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.message);
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
      router.refresh();
    } catch (error) {
      toast.error("Error saving the vehicle information. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.vehicleId}/vehicle-enquiry/save-enquiry`
      );
      localStorage.removeItem(`resTMS-${params.vehicleId}`);
      form.setValue("initialData.registrationNumber", "");
      router.refresh();
      toast.success("Registration removed");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
    <Card className="max-w-full md:max-w-[400px]">
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
                <CardContent className="space-y-4 !mt-[-12px]">
                  <div className="grid grid-cols-2 space-x-[-20px]">
                    <Input
                      className="max-w-[135px] font-UKNumberPlate text-black text-center bg-yellow-400 text-2xl uppercase"
                      disabled={loading}
                      placeholder="YOUR REG"
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(event);
                        if (event.target.value === "") {
                          form.setValue("initialData.registrationNumber", "");
                        }
                      }}
                    />
                    <FormMessage className="flex items-center">
                      {error}
                    </FormMessage>
                  </div>
                  <Button
                    disabled={
                      loading ||
                      !field.value ||
                      areEqual(
                        field.value,
                        initialData?.registrationNumber || ""
                      )
                    }
                    type="submit"
                  >
                    {initialData ? "Update" : "Add"} Reg
                  </Button>
                  {initialData && (
                    <Button
                      className="ml-2"
                      type="button"
                      variant="destructive"
                      disabled={loading}
                      onClick={() => {
                        onDelete();
                      }}
                    >
                      Remove Reg
                    </Button>
                  )}
                </CardContent>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Card>
  );
};
