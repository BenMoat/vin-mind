"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ModificationTypeColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<ModificationTypeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
];
