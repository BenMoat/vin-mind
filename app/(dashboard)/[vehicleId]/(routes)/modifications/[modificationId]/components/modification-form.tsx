"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Modification,
  ModificationType,
  ModificationFiles,
} from "@prisma/client";
import { removeFilesFromAlbum } from "@/app/actions/cloudinary-api";

import toast from "react-hot-toast";

import { PlusCircle } from "lucide-react";

import { formatCurrency, formatFormCurrency } from "@/lib/utils";

import FileUpload from "./file-upload";
import { TypeModal } from "./type-modal";

import { AlertModal } from "@/components/modals/alert-modal";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModificationFormProps {
  initialData:
    | (Modification & {
        files: ModificationFiles[];
      })
    | null;
  modificationTypes: ModificationType[];
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Modification name is required")
    .refine((value) => value.trim().length > 0, {
      message: "Modification name is required",
    }),
  price: z.string().optional(),
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
  const [selectOpen, setSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUrls, setFileUrls] = useState<string[]>([]);

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
          price: formatCurrency.format(
            parseFloat(initialData.price.toString())
          ),
          notes: initialData?.notes ?? "",
        }
      : {
          name: "",
          modificationTypeId: "",
          isObsolete: false,
          files: [],
        },
  });

  const onSubmit = async (data: ModificationFormValues) => {
    try {
      setLoading(true);
      const price = Number(data.price?.replace(/£|,/g, ""));
      const formData = { ...data, price };
      const request = initialData
        ? axios.patch(
            `/api/${params.vehicleId}/modifications/${params.modificationId}`,
            formData
          )
        : axios.post(`/api/${params.vehicleId}/modifications`, formData);
      const navigation = router.push(`/${params.vehicleId}/modifications`);
      await Promise.all([request, navigation]);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  //Keep track of latest file urls for deletion
  const { watch } = form;
  const files = watch("files");

  useEffect(() => {
    const urls = files.map((file) => file.url);
    setFileUrls(urls);
  }, [files]);

  const onDelete = async () => {
    try {
      setLoading(true);
      const request = axios.delete(
        `/api/${params.vehicleId}/modifications/${params.modificationId}`
      );
      await removeFilesFromAlbum(fileUrls);
      const navigation = router.push(`/${params.vehicleId}/modifications`);
      await Promise.all([request, navigation]);
      toast.success("Modification deleted");
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
                <FormItem>
                  <FormLabel>
                    <span className="text-destructive">*</span> Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      className="max-w-[300px] placeholder:italic"
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
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading}
                      className="max-w-[300px] placeholder:italic"
                      placeholder="£149.99"
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatFormCurrency(
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
              name="modificationTypeId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>
                    <span className="text-destructive">*</span> Modification
                    Type
                  </FormLabel>
                  <FormDescription>
                    What type of modification is this? (e.g. Engine, Wheels)
                  </FormDescription>
                  <div className="sm:flex">
                    <Select
                      disabled={loading}
                      onOpenChange={setSelectOpen}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={`max-w-[300px] ${
                            !field.value && "text-muted-foreground italic"
                          }`}
                          open={selectOpen}
                          aria-label="Modification Type"
                        >
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Performance"
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
                      className="ml-auto mt-2 sm:ml-2 sm:mt-0"
                      variant="secondary"
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
            <FormField
              control={form.control}
              name="isObsolete"
              render={({ field }) => (
                <FormItem className="max-w-[450px]">
                  <FormLabel>Obsolete</FormLabel>
                  <FormDescription>
                    Has this modification been removed from the vehicle?
                  </FormDescription>
                  <div className="inline-flex items-center border transition-colors space-x-3 rounded-md px-4 py-3">
                    <FormControl>
                      <Switch
                        className="!ml-[-5px]"
                        aria-label="Is this mod no longer in use?"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="text-sm">
                      This mod is
                      <b>{field.value ? " no longer " : " currently "}</b>
                      in use
                    </div>
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
                      className="placeholder:italic sm:resize max-w-[850px]"
                      placeholder="This cold air intake will add at least 170hp."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem className="max-w-[850px]">
                <FormLabel>Files</FormLabel>
                <FormDescription>
                  Upload and view up to three files related to this
                  modification. (e.g invoices, guides, photos)
                </FormDescription>
                <FormControl>
                  <FileUpload
                    folder={`${params.vehicleId}/modifications`}
                    value={field.value.map((file) => file.url)}
                    disabled={loading}
                    onChange={(url) => {
                      field.onChange([...field.value, { url }]);
                    }}
                    onRemove={(url) => {
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ]);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
