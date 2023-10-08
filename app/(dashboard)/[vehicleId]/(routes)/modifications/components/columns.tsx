"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, File } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ModificationColumn = {
  id: string;
  name: string;
  type: string;
  price: string;
  isObsolete: boolean;
  notes: string;
  createdAt: string;
  files: string[];
};

export const columns: ColumnDef<ModificationColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="inline-flex">
          {row.original.name}&nbsp;
          {row.original.files.length > 0 ? (
            <File color="green" size={20} />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.type}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "isObsolete",
    header: "Obsolete?",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.isObsolete ? "Yes" : "No"}
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.createdAt}</div>;
    },
  },
];
