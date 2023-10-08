"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ModificationTypeColumn = {
  id: string;
  name: string;
  noOfModifications: number;
  createdAt: string;
};

export const columns: ColumnDef<ModificationTypeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "noOfModifications",
    header: "No. of Modifications",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
];
