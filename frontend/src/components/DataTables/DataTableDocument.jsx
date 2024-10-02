import React, { useState, useMemo, useEffect } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { LuEye, LuMoreHorizontal, LuTrash, LuFileEdit, LuTrash2 } from 'react-icons/lu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import DialogBoxEditDocument from '../DialogBoxes/DocumentDialogs/DialogBoxEditDocument';

const DataTableDocument = ({ data, handleDeleteAll, handleViewDocuments, handleOnClikEdit }) => {
    const [columnFilters, setColumnFilters] = useState([]);
    const [filtering, setFiltering] = useState('');
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentDocumentId, setCurrentDocumentId] = useState(null);

    const handleEditDocuments = (id) => {
        setCurrentDocumentId(id);
        setIsDialogOpen(true);
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setCurrentDocumentId(null);
    }


    const columns = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    table.getCoreRowModel().rows.length > 0 && (
                        <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => { table.toggleAllPageRowsSelected(!!value); setIsAllChecked(value)}}
                        aria-label="Select all"
                        />
                    )
                ),
                cell: ({ row }) => (
                    <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                id: 'title',
                header: 'Document Title',
                accessorKey: 'title',
            },
            {
                id: 'price',
                header: 'Price',
                accessorKey: 'price',
            },
            {
                id: 'count',
                header: 'Quantity',
                accessorKey: 'count',
            },
            {
            id: 'action',
            header: 'Action',
            cell: ({ row }) => {
    
              return (
                <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <LuMoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem 
                  onClick={() => handleEditDocuments(row.original._id)}
                  className="flex items-center gap-1">
                    <LuFileEdit />
                    Edit document details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                  onClick={() => handleViewDocuments(row.original.title)}
                  className="flex items-center gap-1">
                    <LuEye/>
                    View documents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )
              
            }
          },
        ],
        []
      );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
            globalFilter: filtering,
        }
      })

  return (
    <div>
        <div className="flex items-center py-4 justify-between gap-2">
            <Input 
                placeholder="Search..."
                className="max-w-xs"
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
            />
            {isAllChecked && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger 
                        onClick={handleDeleteAll} 
                        onMouseEnter={() => setIsHover(true)} 
                        onMouseLeave={() => setIsHover(false)}>
                            {isHover ? (
                               <LuTrash2 className='text-destructive h-5 w-5'/>
                            ) : ( 
                                <LuTrash className='text-destructive h-5 w-5'/>
                            )}
                        </TooltipTrigger>
                        <TooltipContent>
                            Delete all
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
        <div className="rounded-md border">
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
                    )
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
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
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

        <DialogBoxEditDocument 
            isOpen={isDialogOpen}
            onClose={setIsDialogOpen}
            documentId={currentDocumentId}
            onClick={handleOnClikEdit}
        />
        
    </div>
  )
}

export default DataTableDocument;