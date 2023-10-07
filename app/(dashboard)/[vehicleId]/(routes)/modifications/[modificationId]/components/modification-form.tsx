"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Modification, ModificationType, Files } from "@prisma/client";
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
import FileUpload from "@/components/file-upload";
import { TypeModal } from "@/components/modals/type-modal";

interface ModificationFormProps {
  initialData:
    | (Modification & {
        files: Files[];
      })
    | null;
  modificationTypes: ModificationType[];
}

const formSchema = z.object({
  name: z.string().min(1, "Modification name is required"),
  price: z.coerce
    .number()
    .min(0.01, "Please add the price of the modification"),
  modificationTypeId: z.string().min(1, "Select a modification type"),
  isObsolete: z.boolean().default(false).optional(),
  notes: z.string().optional(),
  files: z.object({ url: z.string() }).array(),
});

type ModificationFormValues = z.infer<typeof formSchema>;

export const ModificationForm: React.FC<ModificationFormProps> = ({
  initialData,
  modificationTypes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [alertOpen, setAlertOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData
    ? `Edit Modification: ${initialData.name}`
    : "Add a Modification";
  const description = initialData
    ? "Edit the details of the selected modification."
    : "Add a modification to this vehicle.";
  const toastMessage = initialData
    ? "Modification updated"
    : "Modification created";
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
          files: [],
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
      setAlertOpen(false);
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
        vehicleName={initialData?.name}
      />
      <TypeModal
        isOpen={typeOpen}
        onClose={() => {
          setTypeOpen(false);
        }}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} goBack />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 w-[55%] gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Fake-but-real-to-me Carbon Spoiler"
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
                  <FormLabel aria-required>Modification Type</FormLabel>
                  <FormDescription>
                    What type of modification is this? (e.g. Engine, Wheels)...
                  </FormDescription>
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
            <Button
              type="button"
              className="ml-auto"
              onClick={() => {
                setTypeOpen(true);
              }}
            >
              New Modification Type
            </Button>
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
                      placeholder="This cold air intake will add at least 170hp"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Files</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value.map((file) => file.url)}
                      disabled={loading}
                      onChange={(url) =>
                        field.onChange([...field.value, { url }])
                      }
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
