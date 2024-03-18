/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

import React, { useEffect, useState } from "react";
import ConfettiComponent from "./Confetti";

import { Button } from "@/components/ui/button";
import { saveFormResponse } from "../monday/form/actions";
import { toast } from "./ui/use-toast";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type Props = {
  data?: string | null;
  type: "in" | "out";
};

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  items: z.array(
    z.object({
      name: z.string({
        required_error: "Please select an Event.",
      }),
    }),
  ),
});

export function DefaultForm({ data, type }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const router = useRouter();
  const checkin = type === "in";
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "items", // The key of the field array
  });

  const showConfirmationModal = (data: object) => {
    // Store the validated form data for later submission or use it directly in the submit function
    setFormData(data); // Assuming you have a state to temporarily hold the validated data
    setIsModalOpen(true); // Show the modal for confirmation
  };

  // 2. Define a submit handler.
  async function confirmAndSubmit() {
    console.log("Form data:", formData);
    // Submit formData here
    // const result = createCheckoutOrder(formData);
    const jsonValues = JSON.stringify(formData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await saveFormResponse(jsonValues);
    form.reset();
    setIsModalOpen(false);
    // Show confetti
    setIsConfettiVisible(true);

    // Hide confetti after 5 seconds
    setTimeout(() => setIsConfettiVisible(false), 5000);

    //Show Toast
    toast({
      title: "Sucessfully Submitted",
      description: (
        // <div className="min-h-[150px]">{/* <ConfettiComponent /> */}</div>

        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          Sucessfully Submitted:
          <code className="text-white">
            {JSON.stringify(formData, null, 2)}
          </code>
          w
        </pre>
      ),
    });
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("form submitted", values);
    const jsonValues = JSON.stringify(values);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await saveFormResponse(jsonValues);

    toast({
      title: "Sucessfully Submitted:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          Sucessfully Submitted:
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  useEffect(() => {
    if (data) {
      const parsedData = JSON.parse(data);
      form.reset(parsedData); // Prepopulate form if data is provided
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, form.reset]);

  return (
    <div className="flex w-full flex-1 flex-col rounded-md bg-white p-3 text-black shadow-md md:w-2/5">
      {isConfettiVisible && <ConfettiComponent />}
      <div className="flex w-full items-center justify-between">
        {type === "in" ? "Check-In Form" : "Check-Out Form"}
        <Button className="self-end" onClick={() => router.push("/order")}>
          Previous Orders
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 text-black"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} disabled={checkin} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {itemFields.map((field, index) => (
            <div
              key={field.id}
              className="z-50 flex w-full flex-col flex-wrap bg-slate-100 p-3"
            >
              <FormField
                control={form.control}
                name={`items.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        {...field}
                        disabled={checkin}
                      />
                    </FormControl>
                    <FormDescription>The item category</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          {!checkin && (
            <Button
              className="self-end"
              type="button"
              onClick={() =>
                append({
                  quantity: "1",
                })
              }
            >
              Add Item
            </Button>
          )}

          <Button
            type="submit"
            onClick={form.handleSubmit(showConfirmationModal)}
          >
            {type === "in" ? "Check-In" : "Check-Out"}
          </Button>
          <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  order.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmAndSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </div>
  );
}
