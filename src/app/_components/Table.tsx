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
import { type orderType } from "../order/page";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface DefaultTableProps {
  data: orderType; // Using the orderType array here
}

export function DefaultTable({ data }: DefaultTableProps) {
  const router = useRouter();
  return (
    <div className="w-full rounded-md bg-slate-200 p-3 text-black">
      <Table>
        <TableCaption>A list of your past orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Order #</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Total Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell className="font-medium">{item.id}</TableCell>
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
                      Copy payment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => router.push(`/order/${item.id}`)}
                    >
                      Check In Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
