"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";

import { ServiceHistory } from "@prisma/client";

import { format } from "date-fns";

import { CalendarIcon } from "lucide-react";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ServiceFormProps {
  initialData: ServiceHistory;
}

const formSchema = z.object({
  provider: z.string().min(1, "Service Provider is required"),
  type: z.string().min(1, "Service Type is required"),
  mileage: z.string().min(1, "Mileage is required"),
  details: z.string().optional(),
  cost: z.coerce.number().optional(),
  serviceDate: z.date({
    required_error: "Service Date is required.",
  }),
  nextServiceDate: z.date().optional(),
});

type ServiceCardValues = z.infer<typeof formSchema>;

function formatNumberWithCommas(x: string | number): string {
  // First, convert the input to a string if it's a number
  const str = typeof x === "number" ? x.toString() : x;

  // Remove any characters that aren't digits
  const numericOnly = str.replace(/[^\d]/g, "");

  // Format the string with commas
  return numericOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const ServicingForm: React.FC<ServiceFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData
    ? `Edit Servicing: ${initialData.type}`
    : "Add a Servicing";
  const description = initialData
    ? "Edit the details of the selected servicing."
    : "Add a servicing to this vehicle.";
  const toastMessage = initialData ? "Servicing updated" : "Servicing created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ServiceCardValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          provider: initialData.provider,
          type: initialData.type,
          mileage: formatNumberWithCommas(initialData.mileage),
          details: initialData.details || "",
          cost: parseFloat(String(initialData.cost)),
          serviceDate: new Date(initialData.serviceDate),
          nextServiceDate: initialData.nextServiceDate
            ? new Date(initialData.nextServiceDate)
            : undefined,
        }
      : {
          provider: "",
          type: "",
          mileage: "",
          serviceDate: undefined,
        },
  });

  const onSubmit = async (data: ServiceCardValues) => {
    try {
      setLoading(true);
      //Ensure mileage set to a number
      const mileage = Number(data.mileage.replace(/,/g, ""));
      const formData = { ...data, mileage };
      if (initialData) {
        await axios.patch(
          `/api/${params.vehicleId}/servicing/${params.servicingId}`,
          formData
        );
      } else {
        await axios.post(`/api/${params.vehicleId}/servicing`, formData);
      }
      router.push(`/${params.vehicleId}/servicing`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.vehicleId}/servicing/${params.servicingId}`
      );
      router.push(`/${params.vehicleId}/servicing`);
      toast.success("Servicing record deleted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setAlertOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => {
          setAlertOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
        service={initialData?.type}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} goBack />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <div className="grid grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="max-w-[300px]">
                  <FormLabel>
                    <span className="text-red-600">*</span> Type
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      className="placeholder:italic"
                      placeholder="Intermediate Service"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem className="max-w-[300px]">
                  <FormLabel>
                    <span className="text-red-600">*</span> Provider
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      className="placeholder:italic"
                      placeholder="Auto Center"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem className="max-w-[300px]">
                  <FormLabel>
                    <span className="text-red-600">*</span> Mileage
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      className="placeholder:italic"
                      placeholder="19,254"
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatNumberWithCommas(
                          e.target.value
                        );
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem className="max-w-[500px]">
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      className="placeholder:italic"
                      placeholder="Oil change and wheel realignment"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem className="max-w-[140px]">
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <div className="flex items-center pl-3 border rounded-md">
                      <div className="border-r pr-2">£</div>
                      <Input
                        type="number"
                        disabled={loading}
                        className="placeholder:italic border-none h-full"
                        placeholder="149.99"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-6 pt-2">
              <FormField
                control={form.control}
                name="serviceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      <span className="text-red-600">*</span> Service Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          disabled={loading}
                          variant="outline"
                          className="w-[130px] pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={initialData?.serviceDate}
                          onSelect={(e) => {
                            field.onChange(e);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextServiceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Service Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          disabled={loading}
                          variant="outline"
                          className="w-[130px] pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={initialData?.nextServiceDate || undefined}
                          onSelect={(e) => {
                            field.onChange(e);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {initialData && (
            <Button
              type="button"
              disabled={loading}
              className="mr-2"
              variant="destructive"
              onClick={() => {
                setAlertOpen(true);
              }}
            >
              Delete
            </Button>
          )}
          <Button
            disabled={loading || !form.formState.isDirty}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
