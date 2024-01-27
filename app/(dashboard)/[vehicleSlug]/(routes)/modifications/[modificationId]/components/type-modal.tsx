"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface TypeModalProps {
  vehicleId: string;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter a modification type name")
    .refine((value) => value.trim().length > 0, {
      message: "Please enter a modification type name",
    }),
});

export const TypeModal: React.FC<TypeModalProps> = ({
  vehicleId,
  isOpen,
  onClose,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await axios.post(`/api/${vehicleId}/modification-types`, values);
      router.refresh();
      toast.success("Modification Type Added");
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      onClose();
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add a New Modification Type"
      description="This will be accessible from the modification type dropdown when adding a new modification."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
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
          <div className="space-x-2 flex items-center justify-end w-full">
            <Button
              disabled={loading}
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
