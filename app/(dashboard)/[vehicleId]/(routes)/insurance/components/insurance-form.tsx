"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Modification, Vehicle } from "@prisma/client";

interface ModificationFormProps {
  initialData: Vehicle | null;
}

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export const InsuranceForm: React.FC<ModificationFormProps> = ({
  initialData,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Your insurance details have been saved.");
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={() => {}}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Insurance"
          description="Manage your vehicle's insurance detials"
        />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Button
            type="button"
            disabled={loading}
            className="mr-2"
            variant="destructive"
            onClick={() => {
              setOpen(true);
            }}
          >
            Delete
          </Button>

          <Button disabled={loading} className="ml-auto" type="submit">
            Create
          </Button>
        </form>
      </Form>
    </>
  );
};
