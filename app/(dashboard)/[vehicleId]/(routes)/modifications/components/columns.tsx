"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ModificationColumn = {
  id: string;
  name: string;
  type: string;
  price: string;
  isObsolete: boolean;
  notes: string;
  createdAt: string;
};

export const columns: ColumnDef<ModificationColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isObsolete",
    header: "Obsolete",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
