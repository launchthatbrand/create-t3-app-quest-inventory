/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckIcon, TrashIcon } from "lucide-react";
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
import ConfettiComponent from "./Confetti";
import { GroupedEvents } from "../order/actions";
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
  categories?: Category[];
  events?: GroupedEvents | undefined;
  locations?: unknown;
}

export interface Category {
  id: string;
  title: string;
}

export interface Event {
  id: string;
  title: string;
}

const formSchema = z.object({
  event: z.object({
    id: z.string({
      required_error: "Please select an Event.",
    }),
    name: z.string({
      required_error: "Please select an Event.",
    }),
  }),
  location: z.object({
    id: z.string({
      required_error: "Please select an Event.",
    }),
    name: z.string({
      required_error: "Please select an Event.",
    }),
  }),
  items: z.array(
    z.object({
      categories: z.object({
        id: z.string({
          required_error: "Please select an Event.",
        }),
        title: z.string({
          required_error: "Please select an Event.",
        }),
      }),
      quantity: z.object({
        checkout: z.coerce.number({
          required_error: "Please select an Event.",
        }),
        checkin: z.coerce.number({
          required_error: "Please select an Event.",
        }),
      }),
    }),
  ),
});

export function DefaultForm({
  data,
  type,
  categories,
  events,
  locations,
}: FormProps) {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  // console.log("categories", categories);

  const router = useRouter();
  const checkin = type === "in";
  const eventsArray = events ? Object.values(events) : undefined;

  // Handler to open or close popovers
  const handleOpenChange = (popoverId: string) => {
    setOpenPopover((current) => (current === popoverId ? null : popoverId));
  };

  //  Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event: {},
      items: [],
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
    console.log("showConfirmationModal", data);
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

  function onDelete(index: number) {
    console.log("onDeleteIndex", index);
    // Save it!
    console.log("form submitted", index);
    remove(index);
    toast({
      title: "Sucessfully Deleted Item:",
    });
  }

  useEffect(() => {
    if (data) {
      const parsedData = JSON.parse(data);
      console.log("parsedData", parsedData);

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
            name={`event`}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="flex items-start justify-between">
                  Event
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
                          !field.value?.name && "text-muted-foreground",
                        )}
                        aria-required
                        disabled={checkin}
                      >
                        {field.value?.name ?? "Select event"}
                        <TbCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search events..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No events found.</CommandEmpty>
                        {eventsArray?.map((group) => (
                          <div key={group.groupId}>
                            <CommandGroup heading={group.title}>
                              {group.items.map((event) => {
                                const formattedDate = event.column_values[0]
                                  .date
                                  ? event.column_values[0].date
                                      .split("-")
                                      .slice(1)
                                      .join("/")
                                  : "N/A";
                                return (
                                  <CommandItem
                                    value={event.name}
                                    key={event.id}
                                    onSelect={() => {
                                      form.setValue(`event`, {
                                        name: event.name,
                                        id: event.id,
                                      });
                                      setOpenPopover("");
                                    }}
                                  >
                                    {formattedDate && ` ${formattedDate} - `}
                                    {event.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        event.id === field.value?.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </div>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`location`}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="flex items-start justify-between">
                  Pickup/Dropoff Location
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
                        {field.value?.name ?? "Select pickup/dropoff location"}
                        <TbCaretUpDownFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandList>
                        <CommandInput
                          placeholder="Search locations..."
                          className="h-9"
                        />
                        <CommandEmpty>No location found.</CommandEmpty>
                        <ScrollArea className="h-[200px]">
                          <CommandGroup>
                            {locations?.map((location) => (
                              <CommandItem
                                value={location.name}
                                key={location.id}
                                onSelect={() => {
                                  form.setValue(`location`, {
                                    name: location.name,
                                    id: location.id,
                                  });
                                  setOpenPopover(false);
                                }}
                              >
                                {location.name}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    location.id === field.value?.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {itemFields.map((field, index) => (
            <div
              key={field.id}
              className="z-50 flex w-full flex-col flex-wrap space-y-5 bg-slate-100 p-3"
            >
              <FormField
                control={form.control}
                name={`items.${index}.categories`}
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
                            disabled={checkin}
                          >
                            {field.value?.title ?? "Select Category"}
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
                                {categories?.map((category) => (
                                  <CommandItem
                                    value={category.title}
                                    key={category.id}
                                    onSelect={() => {
                                      form.setValue(
                                        `items.${index}.categories`,
                                        {
                                          title: category.title,
                                          id: category.id,
                                        },
                                      );
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
              <div className="flex items-end justify-between">
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Checkout Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder={1}
                          disabled={
                            !form.watch(`items.${index}.categories`) || checkin
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {checkin && (
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Checkin Quantity</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder={1}
                            disabled={!form.watch(`items.${index}.categories`)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={checkin}
                    className="rounded-md bg-red-700 p-3 text-white shadow-md disabled:bg-slate-400"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          variant={"destructive"}
                          className="w-full"
                          type="submit"
                          onClick={() => onDelete(index)}
                        >
                          Delete
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {!checkin && (
            <Button
              className="self-end"
              type="button"
              onClick={() =>
                append({
                  quantity: {
                    checkout: 1,
                    checkin: 1,
                  },
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
