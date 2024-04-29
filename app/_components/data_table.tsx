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
import { cn } from "@/lib/utils";

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
        columnResizeMode: "onChange",
    });

    // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
    // TASK : Make header columns resizable

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table
                    {...{
                        style: {
                            minWidth: table.getCenterTotalSize(),
                        },
                    }}
                >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        header.column.getCanResize() && (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className={cn(
                                                    `hover:bg-muted w-[${header.column.getSize()}px]`,
                                                    header.column.getIsPinned() &&
                                                        `bg-white sticky left-[${
                                                            header.column.getStart() / 5
                                                        }}]px w-[${header.column.getSize() / 5}px]`,
                                                )}
                                                style={{
                                                    transform: header.column.getIsResizing()
                                                        ? `translateX(${
                                                              table.getState().columnSizingInfo
                                                                  .deltaOffset
                                                          }px)`
                                                        : "",
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext(),
                                                      )}

                                                <div
                                                    className="w-1 h-full absolute top-0 right-0 select-none touch-none cursor-col-resize group-hover:bg-muted-foreground/20"
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                />
                                            </TableHead>
                                        )
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
                                            className={cn(
                                                `w-[${cell.column.getSize()}px]`,
                                                cell.column.getIsPinned() &&
                                                    `lg:z-10 max-lg:bg-white hover:bg-muted stikcy left-[${
                                                        cell.column.getStart() / 5
                                                    }px]`,
                                            )}
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
