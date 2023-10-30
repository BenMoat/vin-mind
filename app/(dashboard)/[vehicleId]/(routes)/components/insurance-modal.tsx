"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Insurance } from "@prisma/client";

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
      startDate: initialData ? initialData.startDate : undefined,
      endDate: initialData ? initialData.endDate : undefined,
      isInsured: initialData?.isInsured || false,
    },
  });

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const today = new Date();
      values.isInsured = values.endDate >= today;

      if (!initialData?.startDate) {
        await axios.post(`/api/${params.vehicleId}/insurance`, values);
      } else {
        await axios.patch(`/api/${params.vehicleId}/insurance`, values);
      }
      router.refresh();
      toast.success("Insurance Reminder Added");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      onClose();
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Renewal Reminder"
        description="Set a reminder for when your insurance is due."
        isOpen={isOpen}
        onClose={onClose}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
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
                          variant={"outline"}
                          className="w-[240px] pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yy")
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
                  <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-[240px] pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yy")
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
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
};
