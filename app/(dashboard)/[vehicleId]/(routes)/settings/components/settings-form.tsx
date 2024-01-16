"use client";

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { DvlaData, Vehicle } from "@prisma/client";

import toast from "react-hot-toast";

import { AlertTriangle } from "lucide-react";

import { AlertModal } from "@/components/modals/alert-modal";
import { RegChecker } from "@/components/reg-checker";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface SettingsFormProps {
  initialData: Vehicle;
  dvlaData: DvlaData | null;
  noOfModifications: number;
  noOfModificationTypes: number;
  noOfServices: number;
}

enum DeleteAction {
  Vehicle,
  Modifications,
  ModificationTypes,
  ServiceHistory,
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Enter a name for your vehicle")
    .max(40, "Vehicle name must be less than 40 characters")
    .refine((value) => value.trim().length > 0, {
      message: "Enter a name for your vehicle",
    }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
  dvlaData,
  noOfModifications,
  noOfModificationTypes,
  noOfServices,
}) => {
  const params = useParams();
  const router = useRouter();

  const [deleteAction, setDeleteAction] = useState<DeleteAction | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
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
      switch (deleteAction) {
        case DeleteAction.Vehicle:
          await axios.delete(`/api/vehicles/${params.vehicleId}`);
          router.refresh();
          router.push("/");
          toast.success("Vehicle deleted");
          break;
        case DeleteAction.Modifications:
          await axios.delete(`/api/${params.vehicleId}/modifications`);
          router.refresh();
          toast.success("All modifications deleted");
          break;
        case DeleteAction.ModificationTypes:
          await axios.delete(`/api/${params.vehicleId}/modification-types`);
          router.refresh();
          toast.success("All modifications types deleted");
          break;
        case DeleteAction.ServiceHistory:
          await axios.delete(`/api/${params.vehicleId}/servicing`);
          router.refresh();
          toast.success("Service history deleted");
          break;
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setDeleteAction(null);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={deleteAction !== null}
        onClose={() => {
          setDeleteAction(null);
        }}
        onConfirm={onDelete}
        loading={loading}
        // Pass the appropriate props based on the delete action
        vehicle={
          deleteAction === DeleteAction.Vehicle ? initialData.name : undefined
        }
        allModifications={deleteAction === DeleteAction.Modifications}
        allModificationTypes={deleteAction === DeleteAction.ModificationTypes}
        allServices={deleteAction === DeleteAction.ServiceHistory}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage your vehicle's settings and data."
        />
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <CardHeader>
                      <CardTitle>Vehicle Name</CardTitle>
                      <CardDescription>
                        Change your vehicle's name at any time without affecting
                        the data attached to it.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 !mt-[-12px]">
                      <Input
                        className="max-w-[300px]"
                        disabled={loading}
                        placeholder="Vehicle Name"
                        {...field}
                      />
                      <FormMessage />
                      <Button
                        disabled={
                          loading || field.value.trim() === initialData?.name
                        }
                        type="submit"
                      >
                        Save Name
                      </Button>
                    </CardContent>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </Card>
        <RegChecker initialData={dvlaData} />
      </div>
      <div className="flex justify-center !mt-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="inline-flex items-center">
              <AlertTriangle className="mr-2" size={25} /> Danger Zone
            </CardTitle>
            <CardDescription>
              Actions taken within the Danger Zone{" "}
              <b className="text-bold">cannot</b> be undone.
            </CardDescription>
            <Separator className="!mt-4" />
          </CardHeader>
          <CardContent>
            <p className="flex justify-center text-xl">Modifications</p>
            <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Delete All {noOfModifications > 0 && noOfModifications}{" "}
                    Modifications
                  </CardTitle>
                  <CardDescription>
                    You will still keep all of your modification types, but all
                    modifications including their associated files will be
                    deleted.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-full">
                  <div>
                    <Button
                      type="button"
                      className="flex"
                      disabled={loading || noOfModifications === 0}
                      variant="destructive"
                      onClick={() => {
                        setDeleteAction(DeleteAction.Modifications);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Delete All{" "}
                    {noOfModificationTypes > 0 && noOfModificationTypes}{" "}
                    Modification Types
                  </CardTitle>
                  <CardDescription>
                    If your vehicle has no modifications, you can delete all
                    modification types.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-full">
                  <div className="pt-5">
                    <Button
                      type="button"
                      disabled={
                        loading ||
                        noOfModificationTypes === 0 ||
                        noOfModifications > 0
                      }
                      variant="destructive"
                      onClick={() => {
                        setDeleteAction(DeleteAction.ModificationTypes);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="flex justify-center text-xl mt-6 mb-2">Servicing</p>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Delete Service History
                </CardTitle>
                <CardDescription>
                  You can delete your vehicle's service history at any time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  disabled={loading || noOfServices === 0}
                  variant="destructive"
                  onClick={() => {
                    setDeleteAction(DeleteAction.ServiceHistory);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
            <p className="flex justify-center text-xl mt-6 mb-2">Vehicle </p>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Delete "{initialData.name}"
                </CardTitle>
                <CardDescription>
                  You can delete your vehicle and all of it's associated data at
                  any time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  disabled={loading}
                  variant="destructive"
                  onClick={() => {
                    setDeleteAction(DeleteAction.Vehicle);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
