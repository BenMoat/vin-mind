"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ServiceHistory } from "@prisma/client";

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
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { AlertModal } from "@/components/modals/alert-modal";
import { Textarea } from "@/components/ui/textarea";

interface ServiceFormProps {
  initialData: ServiceHistory;
}

const formSchema = z.object({
  provider: z.string().min(1),
  type: z.string().min(1),
  mileage: z.coerce.number().min(1),
  details: z.string().optional(),
  cost: z.coerce.number().optional(),
  serviceDate: z.date(),
  nextServiceDate: z.date().optional(),
});

type ServiceCardValues = z.infer<typeof formSchema>;

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
          mileage: initialData.mileage,
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
          mileage: 0,
          details: "",
          cost: 0,
          serviceDate: undefined,
          nextServiceDate: undefined,
        },
  });

  const onSubmit = async (data: ServiceCardValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.vehicleId}/servicing/${params.servicingId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.vehicleId}/servicing`, data);
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
                <FormItem className="max-w-[100px]">
                  <FormLabel>
                    <span className="text-red-600">*</span> Mileage
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      className="placeholder:italic"
                      placeholder="19,254"
                      type="number"
                      {...field}
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
                          className="w-full pl-3 text-left font-normal"
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
                          className="w-[280px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
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
