"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const regNoRegex =
  /^([A-HJ-PR-Y]\d{1,2}\s?[A-Z]{1,2}\s?[A-HJ-PR-Y]{0,2})|([A-HJ-PR-Y]{2}\s?\d{2}\s?[A-Z]{3})$/i;

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Enter a name for your vehicle")
    .max(40, "Vehicle name must be less than 40 characters"),
  registrationNumber: z
    .string()
    .optional()
    .refine((value) => !value || regNoRegex.test(value), {
      message: "Invalid UK number plate",
    }),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post("/api/vehicles", values);

      toast.success("Vehicle added!");

      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Something went wrong 🫤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add a Vehicle"
      description="Add a new vehicle to your garage"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4"></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="A90 Toyota Supra"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem className="pt-3">
                  <FormLabel>Number Plate</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="BM69 MER"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={loading}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
