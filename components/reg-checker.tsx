"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { SubmitHandler, FieldValues } from "react-hook-form";
import { DvlaData } from "@prisma/client";
import { vehicleEnquiry } from "@/app/actions/vehicle";
import { areStringsEqual } from "@/lib/utils";

import { ExternalLink } from "lucide-react";

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
  vehicleId: string;
  initialData: DvlaData | null;
  isModal?: boolean;
  onClose?: () => void;
}

export const RegChecker: React.FC<DvlaDataProps> = ({
  vehicleId,
  initialData,
  isModal,
  onClose,
}) => {
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
    try {
      const data = await vehicleEnquiry(vehicleId, registrationNumber);
      await saveData(data);
      setError("");
      toast.success("Registration updated");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function saveData(data: DvlaDataProps) {
    try {
      if (initialData) {
        await axios.patch(
          `/api/${vehicleId}/vehicle-enquiry/save-enquiry`,
          data
        );
      } else {
        await axios.post(
          `/api/${vehicleId}/vehicle-enquiry/save-enquiry`,
          data
        );
      }
      router.refresh();
    } catch (error) {
      toast.error("Error saving the vehicle information. Please try again.");
    } finally {
      setLoading(false);
      if (onClose) {
        onClose();
      }
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${vehicleId}/vehicle-enquiry/save-enquiry`);
      form.setValue("initialData.registrationNumber", "");
      router.refresh();
      toast.success("Registration removed");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={
        isModal ? "border-none ml-[-22px] mt-[-15px] bg-transparent" : ""
      }
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="initialData.registrationNumber"
            render={({ field }) => (
              <FormItem>
                <CardHeader>
                  <CardTitle
                    className={isModal ? "text-md font-medium mt-[-10px]" : ""}
                  >
                    Number Plate
                  </CardTitle>
                  <CardDescription className={isModal ? "hidden" : ""}>
                    Enter your vehicle's number plate to view its up-to-date tax
                    and MOT status in the <b className="text-bold">Overview</b>{" "}
                    tab. This is directly sourced from the{" "}
                    <a
                      className=" underline font-bold text-bold hover:text-primary transition-colors"
                      href="https://dvladigital.blog.gov.uk/2020/03/12/dvlas-new-api-developer-portal-launch-first-api-vehicle-enquiry-service-ves-on-gov-uk/"
                      target="_blank"
                    >
                      DVLA
                      <ExternalLink className="inline-block ml-1 h-3 w-3 " />
                    </a>
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 !mt-[-12px]">
                  <div
                    className={
                      isModal
                        ? "grid grid-cols-2 space-x-[-60px]"
                        : "grid grid-cols-2 space-x-[-20px]"
                    }
                  >
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
                  {isModal ? (
                    <div className="space-x-2 flex items-center justify-end w-full ml-[25px] !mb-[-25px]">
                      <Button
                        className="ml-2"
                        type="button"
                        variant="outline"
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button disabled={loading || !field.value} type="submit">
                        Add Reg
                      </Button>
                    </div>
                  ) : (
                    <Button
                      disabled={
                        loading ||
                        !field.value ||
                        areStringsEqual(
                          field.value,
                          initialData?.registrationNumber || ""
                        )
                      }
                      type="submit"
                    >
                      {initialData ? "Update" : "Add"} Reg
                    </Button>
                  )}
                  {initialData && !isModal && (
                    <Button
                      className="ml-2"
                      type="button"
                      variant="destructive"
                      disabled={loading}
                      onClick={onDelete}
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
