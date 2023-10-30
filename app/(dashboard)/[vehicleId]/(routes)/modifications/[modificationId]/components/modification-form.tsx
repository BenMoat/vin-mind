"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";

import { Modification, ModificationType, Files } from "@prisma/client";

import { PlusCircle } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        modification={initialData?.name}
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="max-w-[300px]">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Cold Air Intake"
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
                <FormItem className="max-w-[120px]">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="149.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex ">
              <FormField
                control={form.control}
                name="modificationTypeId"
                render={({ field }) => (
                  <FormItem className="max-w-[400px] sm:w-[418px] ">
                    <FormLabel aria-required>Modification Type</FormLabel>
                    <FormDescription>
                      What type of modification is this? (e.g. Engine,
                      Wheels)...
                    </FormDescription>
                    <div className="sm:flex">
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
                              placeholder="---"
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
                      <Button
                        type="button"
                        className=" ml-auto mt-2 sm:ml-2 sm:mt-0 w-[200px] !max-w-[140px]"
                        onClick={() => {
                          setTypeOpen(true);
                        }}
                      >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        New Type
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isObsolete"
              render={({ field }) => (
                <FormItem className="max-w-[450px]">
                  <FormLabel>Obsolete</FormLabel>
                  <div className="iflex inline-flex items-start space-x-3 space-y-[-2px] rounded-md border p-4 ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormDescription>
                      Tick the box if this modification is no longer in use.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="max-w-[400px]">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="This cold air intake will add at least 170hp."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Card className="max-w-[850px]">
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
              <CardDescription>
                Upload any files related related to this modification. (e.g
                receipts, invoices, user guides)...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
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
            </CardContent>
          </Card>

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
