"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams } from "next/navigation";

import toast from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";

import { ExternalLink } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DvlaData = {
  registrationNumber?: string;
  taxStatus?: string;
  taxDueDate?: string;
  motStatus?: string;
  motExpiryDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Enter a name for your vehicle")
    .max(40, "Vehicle name must be less than 40 characters")
    .refine((value) => value.trim().length > 0, {
      message: "Enter a name for your vehicle",
    }),
  registrationNumber: z.any(), //DVLA RES API handles this validation
});

export const VehicleModal = () => {
  const params = useParams();

  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
    },
  });

  const { formState } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const registrationNumber = values.registrationNumber;
    if (registrationNumber) {
      const fetchData = async () => {
        try {
          const request = axios.post(
            `/api/${params.vehicleId}/vehicle-enquiry`,
            { registrationNumber }
          );
          const response = await request;
          response.data.registrationNumber = registrationNumber;
          const save = saveData(values.name, response.data);
          await Promise.all([request, save]);
          setError("");
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            setError(error.response.data.message);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      await saveData(values.name, null);
      setError("");
      setLoading(false);
    }
  };

  const saveData = async (
    vehicleName: string,
    responseData: DvlaData | null
  ) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/vehicles", {
        name: vehicleName,
        ...responseData,
      });

      toast.success("Vehicle added");

      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Something went wrong 🫤");
    } finally {
      setLoading(false);
    }
  };

  const { reset } = form;

  const closeModal = () => {
    reset();
    storeModal.onClose();
    setError("");
  };

  const renderDescription = () => {
    return (
      <>
        <a className="mb-4 mt-2 block">Add a vehicle to your garage.</a>
        Additionally, enter your vehicle's number plate to view its up-to-date
        tax and MOT status, directly sourced from the{" "}
        <a
          className="underline font-bold hover:text-primary transition-colors"
          href="https://dvladigital.blog.gov.uk/2020/03/12/dvlas-new-api-developer-portal-launch-first-api-vehicle-enquiry-service-ves-on-gov-uk/"
          target="_blank"
        >
          DVLA
          <ExternalLink className="inline-block ml-1 h-3 w-3" />
        </a>
        .
      </>
    );
  };

  return (
    <Modal
      title="Add a Vehicle"
      description={renderDescription()}
      isOpen={storeModal.isOpen}
      onClose={closeModal}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-8 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel>Vehicle Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="A90 Toyota Supra"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Number Plate (optional)</FormLabel>
                  <FormControl>
                    <Input
                      className="max-w-[135px] font-UKNumberPlate text-black text-center bg-yellow-400 text-2xl uppercase"
                      disabled={loading}
                      placeholder="YOUR REG"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="flex items-center">
                    {error}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>

          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              type="button"
              disabled={loading}
              variant="outline"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button disabled={loading || !formState.isDirty} type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
