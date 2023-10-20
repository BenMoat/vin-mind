"use client";

import { useState } from "react";
import { SubmitHandler, FieldValues } from "react-hook-form";
import axios from "axios";
import { DvlaData } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

  const { handleSubmit } = useForm();
  const form = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ message: null });

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    setLoading(true);
    const registrationNumber =
      form.getValues("registrationNumber") || initialData?.registrationNumber; // Use initialData if form value is empty
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

  return (
    <Card className="max-w-full md:max-w-[406px]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <CardHeader>
                  <CardTitle>Number Plate</CardTitle>
                  <CardDescription>
                    Enter your vehicle's registration number to access its
                    up-to-date tax and MOT status, directly sourced from the{" "}
                    <a
                      className="underline font-bold"
                      href="https://developer-portal.driver-vehicle-licensing.api.gov.uk/apis/vehicle-enquiry-service/vehicle-enquiry-service-description.html#vehicle-enquiry-service-ves-api-guide"
                      target="_blank"
                    >
                      DVLA
                    </a>
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    className="max-w-[130px] text-center bg-yellow-400 text-black font-bold text-lg uppercase"
                    disabled={loading}
                    placeholder="YOUR REG"
                    {...field}
                    defaultValue={initialData?.registrationNumber}
                  />
                  <FormMessage>{error.message}</FormMessage>
                  <Button disabled={loading} type="submit">
                    Save Changes
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
