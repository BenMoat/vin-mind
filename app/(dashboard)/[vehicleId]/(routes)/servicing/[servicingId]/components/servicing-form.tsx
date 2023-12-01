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

  const [loading, setLoading] = useState(false);

  const title = initialData
    ? `Edit Servicing: ${initialData.provider}`
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
          serviceDate: initialData.serviceDate,
          nextServiceDate: initialData.nextServiceDate || new Date(),
        }
      : {
          provider: "",
          type: "",
          mileage: 0,
          details: "",
          cost: 0,
          serviceDate: new Date(),
          nextServiceDate: new Date(),
        },
  });

  const onSubmit = async (data: ServiceCardValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.vehicleId}/modifications/${params.servicingId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.vehicleId}/servicing`, data);
      }
      router.refresh();
      router.push(`/${params.vehicleId}/servicing`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} goBack />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <Input placeholder="Auto Center" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="Intermediate Service" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mileage</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="19,254" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Oil change and wheel realignment"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="£200.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
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
              <FormItem>
                <FormLabel>Service Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="ml-auto" type="submit">
            Save
          </Button>
        </form>
      </Form>
    </>
  );
};
