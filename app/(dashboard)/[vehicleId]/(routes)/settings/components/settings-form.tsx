"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { DvlaData, ServiceHistory, Vehicle } from "@prisma/client";

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
  CardFooter,
} from "@/components/ui/card";
import { RegChecker } from "@/components/reg-checker";

interface SettingsFormProps {
  initialData: Vehicle;
  dvlaData: DvlaData | null;
  noOfModifications: number;
  noOfModificationTypes: number;
  noOfServices: number;
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
  noOfServices,
}) => {
  const params = useParams();
  const router = useRouter();

  const [vehicleDeleteOpen, setvehicleDeleteOpen] = useState(false);
  const [modificationsDeleteOpen, setmodificationsDeleteOpen] = useState(false);
  const [modificationTypesDeleteOpen, setmodificationTypesDeleteOpen] =
    useState(false);
  const [serviceHistoryDeleteOpen, setserviceHistoryDeleteOpen] =
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

  const onServiceHistoryDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.vehicleId}/servicing`);
      router.refresh();
      toast.success("Service history deleted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setserviceHistoryDeleteOpen(false);
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
      <AlertModal
        isOpen={serviceHistoryDeleteOpen}
        onClose={() => {
          setserviceHistoryDeleteOpen(false);
        }}
        onConfirm={onServiceHistoryDelete}
        loading={loading}
        allServices
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
              <b className="boldText">cannot</b> be undone.
            </CardDescription>
            <Separator className="!mt-4" />
          </CardHeader>
          <CardContent>
            <p className="flex justify-center text-xl">Modifications</p>
            <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2">
              <Card>
                <CardContent>
                  <p className="mt-5 mb-2">
                    Delete All{" "}
                    {noOfModifications > 0 ? noOfModifications : null}{" "}
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
              <Card>
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
                  <div className="!pl-0 pt-5">
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
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="flex justify-center text-xl mt-6 mb-2">Servicing</p>
            <Card>
              <CardContent>
                <p className="mt-5 mb-2">Delete Service History</p>
                <CardDescription className="mb-2">
                  You can delete your vehicle's service history at any time.
                </CardDescription>
                <Button
                  type="button"
                  disabled={loading || noOfServices === 0}
                  variant="destructive"
                  onClick={() => {
                    setserviceHistoryDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
            <p className="flex justify-center text-xl mt-6 mb-2">Vehicle </p>
            <Card>
              <CardContent>
                <p className="mt-5 mb-2">
                  Delete "<b>{initialData.name}</b>"
                </p>
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
