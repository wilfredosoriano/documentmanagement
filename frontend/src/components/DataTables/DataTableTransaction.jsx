import React, { useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Input } from '../ui/input';
import { FolderCheck, LucideSearch, TicketCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { LuMoreHorizontal } from 'react-icons/lu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import axios from 'axios';
import DocumentTracking from '../DocumentTracking';
import { formatDate } from '@/utils/dateUtils';

const DataTableTransaction = ({ data }) => {

    const [filtering, setFiltering] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isDialogStatus, setIsDialogStatus] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [claimedDate, setClaimedDate] = useState('');

    const handleViewStatus = (id) => {
        setTrackingId(id);
        setIsDialogStatus(true);
        axios.get(`http://localhost:5000/api/transactions/status/${id}`)
        .then(response => {
          const status = response.data.status;
          const claimedDate = response.data.claimedDate;
          setCurrentStatus(status);
          setClaimedDate(claimedDate);
        })
        .catch(error => {
            console.error('Error fetching document status: ', error);
        });
    };

    const columns = useMemo(
        () => [
          {
            id: 'id',
            header: 'Tracking ID',
            accessorKey: 'uniqueId',
            meta: { className: "max-sm:hidden" },
          },
          {
            id: 'document',
            header: 'Document',
            accessorKey: 'document',
            meta: { className: 'max-sm:text-xs text-sm' }
          },
          {
            id: 'reservedDate',
            header: 'Reserved Date',
            accessorKey: 'reservedDate',
            meta: { className: 'max-sm:text-xs text-sm' },
            cell: ({ row }) => formatDate(row.original.reservedDate),
          },
          {
            id: 'action',
            header: 'Action',
            meta: { className: 'max-sm:text-xs text-sm' },
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
                    onClick={() => handleViewStatus(row.original._id)}
                    className="flex items-center gap-1">
                        <FolderCheck/>
                      View Status
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={() => handleViewTicket(row.original.title)}
                    className="flex items-center gap-1">
                        <TicketCheck />
                      View Ticket
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
        getFilteredRowModel: getFilteredRowModel(),
        state: {
          globalFilter: filtering,
        },
    });


  return (
    <div>
        <div className='mb-2'>
            {showSearchBar ? (
                <div className='flex flex-row items-center gap-2'>
                    <Input
                    placeholder="Search..."
                    className="md:max-w-sm"
                    value={filtering}
                    onChange={(e) => setFiltering(e.target.value)}
                    />
                    <X size={20} onClick={() => setShowSearchBar(false)}/>
                </div>
            ) : (
                <LucideSearch onClick={() => setShowSearchBar(true)} size={20}/>
            )}  
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}
                        className={cn(header.column.columnDef.meta?.className)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}
                        className={cn(cell.column.columnDef.meta?.className)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transaction history yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={isDialogStatus} onOpenChange={setIsDialogStatus}>
        <DialogContent className="w-10/12">
          <DialogHeader>
            <DialogTitle className="text-center max-sm:text-sm">Document Status</DialogTitle>
            <DialogDescription className="text-center max-sm:text-xs">
              Tracking ID: {trackingId} <br />
              You can track the status of the document here.
            </DialogDescription>
          </DialogHeader>
          <DocumentTracking status={currentStatus} claimedDate={claimedDate}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DataTableTransaction;