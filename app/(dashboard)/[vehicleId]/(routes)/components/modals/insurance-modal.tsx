"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Insurance } from "@prisma/client";

import { format } from "date-fns";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InsuranceModalProps {
  initialData: Insurance | null;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  startDate: z.date({ required_error: "Please enter a start date" }),
  endDate: z.date({ required_error: "Please enter an end date" }),
  isInsured: z.boolean(),
});

export const InsuranceModal: React.FC<InsuranceModalProps> = ({
  initialData,
  isOpen,
  onClose,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: initialData?.startDate || undefined,
      endDate: initialData?.endDate || undefined,
      isInsured: initialData?.isInsured || false,
    },
  });

  const params = useParams();
  const router = useRouter();
  const { formState } = form;

  const [loading, setLoading] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // If the end date is today or in the future, then the vehicle is insured
      const today = new Date();
      values.isInsured = values.endDate >= today;

      if (!initialData?.startDate) {
        await axios.post(`/api/${params.vehicleId}/insurance`, values);
      } else {
        await axios.patch(`/api/${params.vehicleId}/insurance`, values);
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      onClose();
      setLoading(false);
      toast.success("Insurance Reminder Added");
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.vehicleId}/insurance`);
      localStorage.removeItem(`insTMS-${params.vehicleId}`);
      router.refresh();
      toast.success("Insurance Reminder Deleted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      onClose();
      setLoading(false);
    }
  };

  const closeAndReset = () => {
    onClose();
    form.reset();
    router.refresh();
  };

  //Ensure that the form is reset when the modal is closed
  useEffect(() => {
    if (initialData) {
      form.reset({
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        isInsured: initialData.isInsured,
      });
    } else {
      form.reset({
        startDate: undefined,
        endDate: undefined,
        isInsured: false,
      });
    }
  }, [initialData]);

  return (
    <>
      <Modal
        title="Renewal Reminder"
        description="Set a reminder for when your insurance is due."
        isOpen={isOpen}
        onClose={closeAndReset}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover
                      open={isStartDateOpen}
                      onOpenChange={setIsStartDateOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
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
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={initialData?.startDate}
                          onSelect={(e) => {
                            field.onChange(e);
                            setIsStartDateOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover
                      open={isEndDateOpen}
                      onOpenChange={setIsEndDateOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
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
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={initialData?.endDate}
                          onSelect={(e) => {
                            field.onChange(e);
                            setIsEndDateOpen(false);
                          }}
                          disabled={(date) =>
                            date <= new Date(form.getValues("startDate"))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-x-2 flex items-center justify-end w-full">
              <div className="flex justify-start w-full">
                <Button
                  disabled={loading || initialData?.vehicleId === undefined}
                  variant="destructive"
                  type="button"
                  onClick={onDelete}
                >
                  Delete Reminder
                </Button>
              </div>
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                onClick={closeAndReset}
              >
                Cancel
              </Button>
              <Button disabled={loading || !formState.isDirty} type="submit">
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
};
