"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { DvlaData, Vehicle } from "@prisma/client";
import { AlertCircle } from "lucide-react";
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
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RegChecker } from "./reg-checker";

interface SettingsFormProps {
  initialData: Vehicle;
  dvlaData: DvlaData;
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 max-w-[300px]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name</FormLabel>
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
            Save Changes
          </Button>
        </form>
      </Form>
      <RegChecker initialData={dvlaData} />
      <Card className="border-destructive max-w-[850px]">
        <CardHeader>
          <CardTitle className="inline-flex items-center">
            <AlertCircle className="mr-2" /> Danger Zone
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
                You will still keep your modification types, but all
                modifications including their associated files will be deleted.
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
                If your vehicle has no modifications, you will be able to delete
                all modification types.
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
    </>
  );
};
