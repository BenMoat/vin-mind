"use client";

import { ColumnDef } from "@tanstack/react-table";

import { formatCurrency } from "@/lib/utils";

import { ArrowUpDown, File, Files } from "lucide-react";

import { Button } from "@/components/ui/button";

export type ModificationColumn = {
  id: string;
  name: string;
  type: string;
  price: number;
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
  },
  {
    accessorKey: "files",
    header: "Files",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.files.length === 1 ? (
            <File size={20} />
          ) : row.original.files.length > 1 ? (
            <Files size={20} />
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
      return (
        <div className="text-center font-medium">
          {formatCurrency.format(row.original.price)}
        </div>
      );
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
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px] whitespace-nowrap truncate">
          {row.original.notes.slice(0, 95)}
        </div>
      );
    },
  },
];
