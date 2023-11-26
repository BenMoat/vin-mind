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
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DashboardConfigure } from "@prisma/client";

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
  const [error, setError] = useState("");

  const { handleSubmit } = useForm();
  const form = useForm<ConfigureModalProps>({
    defaultValues: {
      initialData: initialData,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async () => {};

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

  return (
    <Modal
      title="Show or Hide Info Cards"
      description="Select which cards you would like to see on your dashboard."
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
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </Modal>
  );
};
