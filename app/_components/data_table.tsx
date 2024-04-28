"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    ColumnPinningState,
    RowSelectionState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ["select", "id"],
        right: [],
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            rowSelection,
            columnPinning,
        },
        onRowSelectionChange: setRowSelection,
        onColumnPinningChange: setColumnPinning,
        enableMultiRowSelection: false,
    });

    // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
    // TASK : Make header columns resizable

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={`${
                                                header.column.getIsPinned() && "bg-white z-10"
                                            } hover:bg-muted`}
                                            style={{
                                                position: header.column.getIsPinned()
                                                    ? "sticky"
                                                    : undefined,
                                                border: "7px",
                                                left: header.column.getIsPinned()
                                                    ? `${header.column.getStart() / 6}px`
                                                    : undefined,
                                                width: header.column.getSize()
                                                    ? `${header.column.getSize() / 5}px`
                                                    : undefined,
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
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
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`${
                                                cell.column.getIsPinned() &&
                                                "lg:z-10 max-lg:bg-white hover:bg-muted"
                                            }`}
                                            style={{
                                                left: cell.column.getIsPinned()
                                                    ? `${cell.column.getStart() / 6}px`
                                                    : undefined,
                                                width: cell.column.getSize()
                                                    ? `${cell.column.getSize() / 5}px`
                                                    : undefined,
                                                position: cell.column.getIsPinned()
                                                    ? "sticky"
                                                    : undefined,
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
