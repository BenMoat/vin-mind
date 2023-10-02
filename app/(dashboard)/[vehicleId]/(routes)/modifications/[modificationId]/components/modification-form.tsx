"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Modification, ModificationType } from "@prisma/client";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface ModificationFormProps {
  initialData: Modification | null;
  modificationTypes: ModificationType[];
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
  modificationTypeId: z.string().min(1),
  price: z.coerce.number().min(1),
  isObsolete: z.boolean().default(false).optional(),
  notes: z.string().optional(),
});

type ModificationFormValues = z.infer<typeof formSchema>;

export const ModificationForm: React.FC<ModificationFormProps> = ({
  initialData,
  modificationTypes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData
    ? `Edit Modification: ${initialData.name}`
    : "Add a Modification";
  const description = initialData
    ? "Edit the details of the selected modification."
    : "Add a modification to this vehicle.";
  const toastMessage = initialData
    ? "Modification updated."
    : "Modification created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ModificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          notes: initialData?.notes ?? "",
        }
      : {
          name: "",
          modificationTypeId: "",
          price: 0,
          isObsolete: false,
          notes: "",
        },
  });

  const onSubmit = async (data: ModificationFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.vehicleId}/modifications/${params.modificationId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.vehicleId}/modifications`, data);
      }
      router.refresh();
      router.push(`/${params.vehicleId}/modifications`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.vehicleId}/modifications/${params.modificationId}`
      );
      router.refresh();
      router.push(`/${params.vehicleId}/modifications`);
      toast.success("Modification Type deleted");
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
                      placeholder="Modification Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modificationTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Modification type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modificationTypes.map((modificationType) => (
                        <SelectItem
                          key={modificationType.id}
                          value={modificationType.id}
                        >
                          {modificationType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isObsolete"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Obsolete</FormLabel>
                    <FormDescription>
                      Is this modification still in use?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Notes about this modification"
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
