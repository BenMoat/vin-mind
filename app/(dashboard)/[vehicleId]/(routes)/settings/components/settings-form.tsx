"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Vehicle } from "@prisma/client";
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

interface SettingsFormProps {
  initialData: Vehicle;
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

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [vehicleDeleteOpen, setvehicleDeleteOpen] = useState(false);
  const [modificationsDeleteOpen, setmodificationsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
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

  return (
    <>
      <AlertModal
        isOpen={vehicleDeleteOpen}
        onClose={() => {
          setvehicleDeleteOpen(false);
        }}
        onConfirm={onVehicleDelete}
        loading={loading}
        vehicleName={initialData.name}
      />
      <AlertModal
        isOpen={modificationsDeleteOpen}
        onClose={() => {
          setmodificationsDeleteOpen(false);
        }}
        onConfirm={onModificationsDelete}
        loading={loading}
        vehicleName={"all modifications"}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage your vehicle's settings and data."
        />
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
          <Card className="border-destructive">
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
                  <p className="mt-5 mb-2">Delete All Modifications</p>
                  <CardDescription className="mb-2">
                    You will still keep your modification types, but all
                    modifications including their associated files will be
                    deleted.
                  </CardDescription>
                  <Button
                    type="button"
                    disabled={loading}
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
                  <p className="mt-5 mb-2">Delete All Modification Types</p>
                  <CardDescription className="mb-2">
                    If your vehicle has no modifications, you will be able to
                    delete all modification types.
                  </CardDescription>
                  <Button
                    type="button"
                    disabled={loading}
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
                  <p className="mt-5 mb-2">Delete Vehicle</p>
                  <CardDescription className="mb-2">
                    You can delete your vehicle and all of it's associated data
                    at any time.
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
        </form>
      </Form>
    </>
  );
};
