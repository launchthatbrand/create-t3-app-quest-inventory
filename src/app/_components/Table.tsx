/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { type orderType } from "../order/page";
import { Button } from "./ui/button";
import {
  Calendar,
  CheckSquare2Icon,
  Clipboard,
  Copy,
  MoreHorizontal,
  Tags,
  Trash,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { InventoryFormData } from "./DefaultForm";
import React, { use, useState } from "react";
import { api } from "~/trpc/react";

interface DefaultTableProps {
  data: orderType;
  handleDelete: (id: number) => void;
  handleDuplicate: (id: number) => void;
}

export function DefaultTable({
  data,
  handleDelete,
  handleDuplicate,
}: DefaultTableProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const changeDocumentOwner = api.formResponse.changeDocumentOwner.useMutation({
    onSuccess: () => {
      setFormData(null);
      void utils.formResponse.getUsersOrders.invalidate();
    },
  });

  const [formData, setFormData] = useState<{
    id: number;
    userId: string;
    firstName: string | null;
    lastName: string | null;
  } | null>(null);
  const [userId, setUserId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = api.user.getAll.useQuery(undefined, {
    enabled: false, // Disable automatic query on mount
  });

  if (users) console.log("users", data);

  // Handler to open or close popovers
  const handleOpenChange = (popoverId: string) => {
    setIsDropdownOpen((current) => (current === popoverId ? null : popoverId));
  };

  // Define a submit handler.
  async function confirmAndSubmit() {
    console.log("confirmAndSubmit", formData);
    const result = await changeDocumentOwner.mutateAsync(formData!);
    console.log("confirmAndSubmitresult", result);
  }

  const fetchVolunteers = () => {
    void refetch(); // Manually trigger the query when the dropdown is clicked
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-y-3 rounded-md bg-white p-3 text-black">
      <div className="flex w-full items-center justify-between">
        Past Check-out Orders
        <Button
          className="self-end"
          onClick={() => router.push("/order/checkout")}
        >
          New Check-out Order
        </Button>
      </div>
      <Table className="md:whitespace-nowrap">
        <TableCaption>A list of your past orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Order #</TableHead>
            <TableHead className="">Volunteer</TableHead>
            <TableHead>Event</TableHead>
            <TableHead className="text-center">Total Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item, index) => {
            const parsedData = JSON.parse(item.data!) as InventoryFormData;
            const totalCheckoutQuantity = parsedData.items.reduce(
              (total: any, currentItem: any) =>
                total + currentItem.quantity.checkout,
              0,
            );

            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="font-medium">
                  {item.users.firstName} {item.users.lastName}
                </TableCell>
                <TableCell className="font-medium">
                  {parsedData.event.name ?? "undefined"}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {totalCheckoutQuantity}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <DropdownMenu
                    open={isDropdownOpen === `${item.id}`}
                    onOpenChange={() => handleOpenChange(`${item.id}`)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(
                              item.id as unknown as string,
                            )
                          }
                        >
                          <Clipboard className="mr-2 h-4 w-4" />
                          Copy order ID
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDuplicate(item.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate Order
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger
                            onMouseEnter={fetchVolunteers}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Assign to...
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="p-0">
                            <Command
                            // filter={(value, search) => {
                            //   if (value.includes(search)) return 1;
                            //   return 0;
                            // }}
                            >
                              <CommandInput
                                placeholder="Volunteer List..."
                                autoFocus={true}
                              />
                              <CommandList>
                                {isLoading && (
                                  <CommandEmpty>Loading...</CommandEmpty>
                                )}
                                {error && (
                                  <CommandEmpty>
                                    Error fetching users
                                  </CommandEmpty>
                                )}
                                {!isLoading && !error && users && (
                                  <CommandGroup>
                                    {users.map((user) => (
                                      <CommandItem
                                        key={user.id}
                                        value={`${user.firstName} ${user.lastName}`}
                                        onSelect={() => {
                                          setUserId(user.id);
                                          setFormData({
                                            id: item.id,
                                            userId: user.id,
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                          });
                                          setIsDropdownOpen(null);
                                          setIsModalOpen(true);
                                        }}
                                      >
                                        {user.firstName} {user.lastName}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => router.push(`/order/${item.id}`)}
                        >
                          <CheckSquare2Icon className="mr-2 h-4 w-4" />
                          Check In Order
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reassign this order to {formData?.firstName}{" "}
              {formData?.lastName}. Are you sure you wish to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAndSubmit}>
              Reassign Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
