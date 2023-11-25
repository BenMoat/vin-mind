"use client";

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modification, ModificationType } from "@prisma/client";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { Info, Link } from "lucide-react";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ModificationTypeFormProps {
  initialData: ModificationType | null;
  modifications: Modification[] | null;
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
      if (initialData) {
        await axios.patch(
          `/api/${params.vehicleId}/modification-types/${params.modificationTypeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.vehicleId}/modification-types`, data);
      }
      router.refresh();
      router.push(`/${params.vehicleId}/modification-types`);
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
        `/api/${params.vehicleId}/modification-types/${params.modificationTypeId}`
      );
      router.refresh();
      router.push(`/${params.vehicleId}/modification-types`);
      toast.success("Modification Type deleted");
    } catch (error) {
      toast.error(
        `This modification type cannot be deleted as it has ${modifications?.length} modifications attached to it.`
      );
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
        modificationType={initialData?.name}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} goBack />
      </div>
      <Separator />
      {initialData ? (
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 pr-4 flex items-center justify-center">
            <Card className="h-full w-full flex flex-col justify-center items-center min-h-[200px]">
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 w-full"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Type of modification"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="w-full md:w-1/2">
            <Card className="min-h-[200px]">
              <CardHeader className="pb-2">
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
                    <b className="dark:text-white text-black">
                      Click on a mod to view or edit it
                    </b>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 w-full">
                <ul className="list-disc list-inside marker:text-[#e2e8f0] dark:marker:text-[#1e293b]">
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
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Card className="w-[407px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <CardHeader className="pb-2">
                        <CardTitle>Name</CardTitle>
                        <CardDescription>
                          Create a modification type to categorise your
                          modifications. <br></br> What type of modification is
                          this? (e.g. Engine, Wheels)...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input
                          disabled={loading}
                          placeholder="Type of modification"
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
