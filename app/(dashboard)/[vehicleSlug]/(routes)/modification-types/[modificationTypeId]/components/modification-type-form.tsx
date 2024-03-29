"use client";

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Modification, ModificationType } from "@prisma/client";

import toast from "react-hot-toast";

import { Info, Link } from "lucide-react";

import { AlertModal } from "@/components/modals/alert-modal";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ModificationTypeFormProps {
  vehicleId: string;
  initialData: ModificationType | null;
  modifications: Modification[] | null;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter a modification type")
    .refine((value) => value.trim().length > 0, {
      message: "Please enter a modification type",
    }),
});

type ModificationTypeFormValues = z.infer<typeof formSchema>;

export const ModificationTypeForm: React.FC<ModificationTypeFormProps> = ({
  vehicleId,
  initialData,
  modifications,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData
    ? `Edit Modification Type: ${initialData.name}`
    : "Create Modification Type";
  const description = initialData
    ? "Edit your vehicle's modification type."
    : "Create a new modification type for your vehicle.";
  const toastMessage = initialData
    ? "Modification type updated"
    : "Modification type created";
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
      const request = initialData
        ? axios.patch(
            `/api/${vehicleId}/modification-types/${params.modificationTypeId}`,
            data
          )
        : axios.post(`/api/${vehicleId}/modification-types`, data);
      const navigation = router.push(
        `/${params.vehicleSlug}/modification-types`
      );
      await Promise.all([request, navigation]);
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
      const request = axios.delete(
        `/api/${vehicleId}/modification-types/${params.modificationTypeId}`
      );
      const navigation = router.push(
        `/${params.vehicleSlug}/modification-types`
      );
      await Promise.all([request, navigation]);
      toast.success("Modification Type deleted");
    } catch (error) {
      toast.error(
        `This modification type cannot be deleted as it has ${modifications?.length} modifications attached to it.`
      );
    } finally {
      setLoading(false);
      setOpen(false);
      router.refresh();
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
        modificationType={initialData?.name}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} goBack />
      </div>
      <Separator />
      {initialData ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="flex items-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex justify-center w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <CardHeader>Name</CardHeader>
                      <CardContent className="space-y-4 !mt-[-12px]">
                        <FormControl>
                          <Input
                            className="max-w-[300px] placeholder:italic"
                            disabled={loading}
                            placeholder="Performance"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        {modifications?.length == 0 && (
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
                        )}
                        <Button
                          disabled={
                            loading ||
                            form.getValues("name").trim() === initialData?.name
                          }
                          className="ml-auto"
                          type="submit"
                        >
                          {action}
                        </Button>
                      </CardContent>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center">
                <Info className="mr-2" size={25} />
                {modifications?.length === 1
                  ? " 1 Mod Associated with "
                  : ` ${modifications?.length} Mods Associated with `}
                {initialData?.name}
              </CardTitle>
              <CardDescription>
                A mod type's name can be changed, but a type cannot be deleted
                if there are mods associated with it.
                <br />
                <br />
                {(modifications?.length ?? 0) > 0 && (
                  <b className="text-bold">Click on a mod to view or edit it</b>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 w-full">
              <ul className="list-disc list-inside marker:text-secondary dark:marker:text-secondary">
                {modifications?.map((modification) => (
                  <li key={modification.id}>
                    <a
                      className="underline"
                      href={`/${modification.vehicleId}/modifications/${modification.id}`}
                    >
                      {modification.name}
                    </a>
                    &nbsp;
                    <Link size={14} className="inline-block" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <CardHeader>
                        <CardTitle>Name</CardTitle>
                        <CardDescription>
                          Create a modification type to categorise your
                          modifications. <br></br> What type of modification is
                          this? (e.g. Engine, Wheels)...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 !mt-[-12px]">
                        <Input
                          className="max-w-[300px] placeholder:italic"
                          disabled={loading}
                          placeholder="Performance"
                          {...field}
                        />
                        <FormMessage />
                        <Button disabled={loading} type="submit">
                          {action}
                        </Button>
                      </CardContent>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </Card>
        </div>
      )}
    </>
  );
};
