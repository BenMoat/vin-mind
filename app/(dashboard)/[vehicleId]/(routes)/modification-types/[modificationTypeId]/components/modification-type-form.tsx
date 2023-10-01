"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ModificationType } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

interface ModificationTypeFormProps {
  initialData: ModificationType | null;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine((value) => {
      if (!value) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message: "Please enter a vehicle name",
            path: ["name"],
          },
        ]);
      }
      return true;
    }),
});

type ModificationTypeFormValues = z.infer<typeof formSchema>;

export const ModificationTypeForm: React.FC<ModificationTypeFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData
    ? "Edit Modification Type"
    : "Create Modification Type";
  const description = initialData
    ? "Edit your vehicle's modification type."
    : "Create a new modification type for your vehicle.";
  const toastMessage = initialData
    ? "Modification type updated."
    : "Modification type created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ModificationTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (data: ModificationTypeFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/vehicles/${params.vehicleId}`, data);
      router.refresh();
      toast.success("Vehicle updated");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/vehicles/${params.vehicleId}`);
      router.refresh();
      router.push("/");
      toast.success("Vehicle deleted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
        vehicleName={initialData?.name}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Vehicle Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
