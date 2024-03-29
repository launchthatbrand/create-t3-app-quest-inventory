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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { type orderType } from "../order/page";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { InventoryFormData } from "./DefaultForm";

interface DefaultTableProps {
  data: orderType;
  handleDelete: (id: number) => void;
}

export function DefaultTable({ data, handleDelete }: DefaultTableProps) {
  const router = useRouter();

  const onDeleteClick = (id: number) => {
    handleDelete(id);
  };

  return (
    <div className="flex w-full flex-col gap-y-3 rounded-md bg-white p-3 text-black md:w-2/5">
      <div className="flex w-full items-center justify-between">
        Past Check-out Orders
        <Button
          className="self-end"
          onClick={() => router.push("/order/checkout")}
        >
          New Check-out Order
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your past orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Order #</TableHead>
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
                  {parsedData.event.name ?? "undefined"}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {totalCheckoutQuantity}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(
                            item.id as unknown as string,
                          )
                        }
                      >
                        Copy order ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push(`/order/${item.id}`)}
                      >
                        Check In Order
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            Delete Order
                            
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the order.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteClick(item.id)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
