"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { DvlaData, Vehicle } from "@prisma/client";

import { AlertTriangle } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RegChecker } from "./reg-checker";

interface SettingsFormProps {
  initialData: Vehicle;
  dvlaData: DvlaData | null;
  noOfModifications: number;
  noOfModificationTypes: number;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Enter a name for your vehicle")
    .max(40, "Vehicle name must be less than 40 characters"),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
  dvlaData,
  noOfModifications,
  noOfModificationTypes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [vehicleDeleteOpen, setvehicleDeleteOpen] = useState(false);
  const [modificationsDeleteOpen, setmodificationsDeleteOpen] = useState(false);
  const [modificationTypesDeleteOpen, setmodificationTypesDeleteOpen] =
    useState(false);
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

  const onVehicleDelete = async () => {
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
      setvehicleDeleteOpen(false);
    }
  };

  const onModificationsDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.vehicleId}/modifications`);
      router.refresh();
      toast.success("All modifications deleted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setmodificationsDeleteOpen(false);
    }
  };

  const onModificationTypesDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.vehicleId}/modification-types`);
      router.refresh();
      toast.success("All modifications types deleted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setmodificationTypesDeleteOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={vehicleDeleteOpen}
        onClose={() => {
          setvehicleDeleteOpen(false);
        }}
        onConfirm={onVehicleDelete}
        loading={loading}
        vehicle={initialData.name}
      />
      <AlertModal
        isOpen={modificationsDeleteOpen}
        onClose={() => {
          setmodificationsDeleteOpen(false);
        }}
        onConfirm={onModificationsDelete}
        loading={loading}
        allModifications
      />
      <AlertModal
        isOpen={modificationTypesDeleteOpen}
        onClose={() => {
          setmodificationTypesDeleteOpen(false);
        }}
        onConfirm={onModificationTypesDelete}
        loading={loading}
        allModificationTypes
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage your vehicle's settings and data."
        />
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Card className="max-w-full md:max-w-[407px] md:ml-auto">
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
                    <CardContent className="space-y-4">
                      <Input
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
      <div className="flex justify-center ">
        <Card className="border-destructive max-w-[850px]">
          <CardHeader>
            <CardTitle className="inline-flex items-center">
              <AlertTriangle className="mr-2" size={25} /> Danger Zone
            </CardTitle>
            <CardDescription>
              Actions taken within the Danger Zone{" "}
              <b className="text-black dark:text-white">cannot</b> be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card>
              <CardContent>
                <p className="mt-5 mb-2">
                  Delete All {noOfModifications > 0 ? noOfModifications : null}{" "}
                  Modifications
                </p>
                <CardDescription className="mb-2">
                  You will still keep all of your modification types, but all
                  modifications including their associated files will be
                  deleted.
                </CardDescription>
                <Button
                  type="button"
                  disabled={loading || noOfModifications === 0}
                  variant="destructive"
                  onClick={() => {
                    setmodificationsDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
            <Card className="mt-2">
              <CardContent>
                <p className="mt-5 mb-2">
                  Delete All{" "}
                  {noOfModificationTypes > 0 ? noOfModificationTypes : null}{" "}
                  Modification Types
                </p>
                <CardDescription className="mb-2">
                  If your vehicle has no modifications, you can delete all
                  modification types.
                </CardDescription>
                <Button
                  type="button"
                  disabled={
                    loading ||
                    noOfModificationTypes === 0 ||
                    noOfModifications > 0
                  }
                  variant="destructive"
                  onClick={() => {
                    setmodificationTypesDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
            <Card className="mt-2">
              <CardContent>
                <p className="mt-5 mb-2">Delete Vehicle</p>
                <CardDescription className="mb-2">
                  You can delete your vehicle and all of it's associated data at
                  any time.
                </CardDescription>
                <Button
                  type="button"
                  disabled={loading}
                  variant="destructive"
                  onClick={() => {
                    setvehicleDeleteOpen(true);
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
