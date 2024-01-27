"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, FieldValues } from "react-hook-form";
import toast from "react-hot-toast";

import { DashboardConfigure } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface ConfigureModalProps {
  initialData: DashboardConfigure | null;
}

export const ConfigureModal: React.FC<ConfigureModalProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const form = useForm<ConfigureModalProps>({
    defaultValues: {
      initialData: initialData,
    },
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    try {
      const data = form.getValues().initialData;
      await axios.patch(
        `/api/${initialData?.vehicleId}/dashboard-configure`,
        data
      );
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const selectAll = () => {
    if (initialData) {
      const newValues = Object.keys(initialData).reduce((acc, key) => {
        return { ...acc, [key]: true };
      }, {});

      form.reset({ initialData: newValues });
    }
  };

  const deselectAll = () => {
    if (initialData) {
      const newValues = Object.keys(initialData).reduce((acc, key) => {
        return { ...acc, [key]: false };
      }, {});

      form.reset({ initialData: newValues });
    }
  };

  //Define the form field names
  type CardName =
    | "taxAndMot"
    | "insurance"
    | "totalModifications"
    | "mileage"
    | "servicing";

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
    {
      name: "servicing",
      formattedName: "Servicing",
      description: "Your latest servicing record.",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="space-y-4">
          {cards
            .sort((a, b) => a.formattedName.localeCompare(b.formattedName))
            .map((card) => (
              <FormField
                key={card.name}
                control={form.control}
                name={`initialData.${card.name}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
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
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          onSubmit(form.getValues());
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
        </div>
        <div className="flex flex-row justify-between">
          <Button
            onClick={deselectAll}
            variant="outline"
            className="btn btn-secondary"
          >
            Deselect All
          </Button>

          <Button
            onClick={selectAll}
            variant="outline"
            className="btn btn-primary"
          >
            Select All
          </Button>
        </div>
      </form>
    </Form>
  );
};
