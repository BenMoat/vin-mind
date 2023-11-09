"use client";

import { useState } from "react";
import * as React from "react";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

import { useParams, useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  routeName: string;
  filterKey: string;
  modType?: any[];
  isObsolete?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  routeName,
  filterKey,
  modType,
  isObsolete,
}: DataTableProps<TData, TValue>) {
  const params = useParams();
  const router = useRouter();

  const [typeOpen, setTypeOpen] = useState(false);
  const [obosleteOpen, setObsoleteOpen] = useState(false);

  const [obsoleteText, setObsoleteText] = useState("Obsolete?");
  const [typeText, setTypeText] = useState("Mod Type");
  const [showResetButton, setShowResetButton] = useState(false);
  const [resetButtonPressed, setResetButtonPressed] = useState(false);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <>
      <div className="flex items-center pt-4">
        <Input
          className="max-w-sm"
          placeholder="Search"
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn(filterKey)?.setFilterValue(event.target.value);
            setShowResetButton(!!event.target.value);
          }}
        />
        {modType && (
          <Select
            onOpenChange={setTypeOpen}
            value={
              (table.getColumn("type")?.getFilterValue() || "all") as string
            }
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("type")?.setFilterValue("");
                setTypeText("Mod Type");
                setShowResetButton(false);
              } else {
                table.getColumn("type")?.setFilterValue(value || "");
                setTypeText(value || "Mod Type");
                setShowResetButton(true);
              }
            }}
            defaultValue="all"
          >
            <SelectTrigger
              open={typeOpen}
              className="w-[150px] ml-2"
              aria-label="Select a modification type"
            >
              <SelectValue
                placeholder={typeText}
                className="flex justify-between items-center"
              >
                {resetButtonPressed ? null : typeText}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {modType.map((modificationType) => (
                <SelectItem
                  key={modificationType.id}
                  value={modificationType.name}
                >
                  {modificationType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {isObsolete && (
          <Select
            onOpenChange={setObsoleteOpen}
            value={
              table.getColumn("isObsolete")?.getFilterValue() === true
                ? "true"
                : table.getColumn("isObsolete")?.getFilterValue() === false
                ? "false"
                : "all"
            }
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("isObsolete")?.setFilterValue("");
                setObsoleteText("Obsolete?");
                setShowResetButton(false);
              } else if (value === "true") {
                table.getColumn("isObsolete")?.setFilterValue(true ?? "");
                setObsoleteText("Yes");
                setShowResetButton(true);
              } else {
                table.getColumn("isObsolete")?.setFilterValue(false ?? "");
                setObsoleteText("No");
                setShowResetButton(true);
              }
            }}
            defaultValue="all"
          >
            <SelectTrigger
              open={obosleteOpen}
              className="w-[150px] ml-2"
              aria-label="Filter obsolete modifications"
            >
              <SelectValue placeholder={obsoleteText}>
                {resetButtonPressed ? null : obsoleteText}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        )}
        {showResetButton && (
          <Button
            className="ml-2"
            variant="outline"
            onClick={() => {
              setResetButtonPressed(true);
              table.getColumn("isObsolete")?.setFilterValue("");
              setObsoleteText("Obsolete?");
              table.getColumn("type")?.setFilterValue("");
              setTypeText("Mod Type");
              table.getColumn(filterKey)?.setFilterValue("");
              setTimeout(() => setResetButtonPressed(false), 0);
              setShowResetButton(false);
            }}
          >
            Reset
            <RotateCcw size={18} className="ml-2" />
          </Button>
        )}
      </div>
      <div className="rounded-md border !mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    router.push(
                      // @ts-ignore
                      `/${params.vehicleId}/${routeName}/${row.original.id}`
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-md text-muted-foreground">
          {table.getRowModel().rows.length} of {data.length} records
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
