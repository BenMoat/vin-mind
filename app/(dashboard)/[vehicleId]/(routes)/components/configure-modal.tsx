"use client";

import { useForm } from "react-hook-form";
import { SubmitHandler, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DashboardConfigure } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ConfigureModalProps {
  initialData: DashboardConfigure;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigureModal: React.FC<ConfigureModalProps> = ({
  initialData,
  isOpen,
  onClose,
}) => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { handleSubmit } = useForm();

  const form = useForm<ConfigureModalProps>({
    defaultValues: {
      initialData: initialData,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    try {
      setLoading(true);
      const data = form.getValues().initialData;
      await axios.patch(`/api/${params.vehicleId}/dashboard-configure`, data);
      router.refresh();
      toast.success("Preferences saved");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      onClose();
      setLoading(false);
    }
  };

  const closeAndReset = () => {
    onClose();
    form.reset();
    router.refresh();
  };

  //Define the form field names
  type CardName = "taxAndMot" | "insurance" | "totalModifications" | "mileage";

  //Map over each form field with the name, formatted name and description
  const cards: {
    name: CardName;
    formattedName: string;
    description: string;
  }[] = [
    {
      name: "taxAndMot",
      formattedName: "Tax and MOT",
      description: "The status and due dates of your vehicle's tax and MOT.",
    },
    {
      name: "mileage",
      formattedName: "Mileage",
      description: "Your vehicle's current mileage.",
    },
    {
      name: "insurance",
      formattedName: "Insurance",
      description: "Your vehicle's insurance status and due dates.",
    },
    {
      name: "totalModifications",
      formattedName: "Total Modifications",
      description: "The total number of modifications on your vehicle.",
    },
  ];

  const renderDescription = () => {
    return (
      <>
        <a className="mb-2 mt-2 block">
          Select which info cards you would like to see in your Overview tab.
        </a>
        <a className="italic">Hiding a card will not remove it's data.</a>
      </>
    );
  };

  return (
    <Modal
      title="Show or Hide Info Cards"
      description={renderDescription()}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div className="space-y-4">
            {cards.map((card) => (
              <FormField
                key={card.name}
                control={form.control}
                name={`initialData.${card.name}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-2">
                      <FormLabel className="text-base">
                        {card.formattedName}
                      </FormLabel>
                      <FormDescription className="mr-1">
                        {card.description}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="space-x-2 flex items-center justify-end w-full">
            <Button
              disabled={loading}
              type="button"
              variant="outline"
              onClick={closeAndReset}
            >
              Cancel
            </Button>
            <Button disabled={loading || !form.formState.isDirty} type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
