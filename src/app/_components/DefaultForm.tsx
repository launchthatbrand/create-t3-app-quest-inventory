/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useState } from "react";
import { TbCaretUpDownFilled, TbTrashX } from "react-icons/tb";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import ConfettiComponent from "./Confetti";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { saveFormResponse } from "../monday/actions";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export interface FormProps {
  data?: string | null;
  type: "in" | "out";
  categories: Category[];
}

export interface Category {
  id: string;
  title: string;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  items: z.array(
    z.object({
      category: z.object({
        id: z.string({
          required_error: "Please select an Event.",
        }),
        title: z.string({
          required_error: "Please select an Event.",
        }),
      }),
      name: z.string({
        required_error: "Please select an Event.",
      }),
    }),
  ),
});

export function DefaultForm({ data, type, categories }: FormProps) {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  console.log("categories", categories);

  const router = useRouter();
  const checkin = type === "in";

  // Handler to open or close popovers
  const handleOpenChange = (popoverId: string) => {
    setOpenPopover((current) => (current === popoverId ? null : popoverId));
  };

  //  Define your form.
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

  // Define a submit handler.
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
          {/* {categories.map((category, index) => (
            <div key={index}>{category.title}</div>
          ))} */}
          {itemFields.map((field, index) => (
            <div
              key={field.id}
              className="z-50 flex w-full flex-col flex-wrap bg-slate-100 p-3"
            >
              <FormField
                control={form.control}
                name={`items.${index}.category`}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel className="flex items-start justify-between">
                      Category
                    </FormLabel>

                    <Popover
                      open={openPopover === `${field.name}`}
                      onOpenChange={() => handleOpenChange(`${field.name}`)}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? categories.find(
                                  (category) => category.id === field.value.id,
                                )?.title
                              : "Select category"}
                            <TbCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search categories..."
                            className="h-9"
                          />
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <ScrollArea className="h-[200px]">
                            <CommandList>
                              <CommandGroup>
                                {categories.map((category) => (
                                  <CommandItem
                                    value={category.title}
                                    key={category.id}
                                    onSelect={() => {
                                      form.setValue(`items.${index}.category`, {
                                        title: category.title,
                                        id: category.id,
                                      });
                                      // form.setValue(
                                      //   `items.${index}.name`,
                                      //   undefined,
                                      // );
                                      // setSelectedCategory(category.id);
                                      setOpenPopover("");
                                    }}
                                  >
                                    {category.title}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        category.id === field.value?.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </ScrollArea>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
              onClick={() => append({})}
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
