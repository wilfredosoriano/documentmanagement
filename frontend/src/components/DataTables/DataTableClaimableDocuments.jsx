import React, { useState, useMemo, useEffect } from 'react';
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
  LuEye,
  LuMoreHorizontal,
  LuTrash,
  LuInfo,
  LuCheckCircle,
  LuTrash2,
  LuCopy,
  LuCopyCheck,
} from 'react-icons/lu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useToast } from '../ui/use-toast';
import DocumentTracking from '../DocumentTracking';

const DataTableClaimableDocuments = ({ data, handleDelete, handleDeleteAll, handleClaimConfirm }) => {
  const { toast } = useToast();
  const [columnFilters, setColumnFilters] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [document, setDocument] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogClaim, setIsDialogClaim] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isDialogStatus, setIsDialogStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [claimedDate, setClaimedDate] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);

    return `${formattedDate} ${formattedTime}`;
  };

  const handleViewDocument = (id) => {
    axios
      .get(`http://localhost:5000/api/claimableDocuments/${id}`)
      .then((response) => {
        const data = response.data;
        setDocument(data);
        setIsDialogOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching document details: ', error);
      });
  };

  const handleCopy = (id) => {
    setIsCopied(true);
    navigator.clipboard.writeText(id).then(() => {
      toast({
        description: "Copied to Clipboard.",
      });
    }).catch(error => {
      console.error('Failed to copy: ', error);
    })
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsCopied(false);
  };

  const handleClaim = (id) => {
    axios
    .get(`http://localhost:5000/api/claimableDocuments/${id}`)
    .then((response) => {
      const data = response.data;
      setDocument(data);
      setTrackingId(data.uniqueId);
      setIsDialogClaim(true);
    })
    .catch((error) => {
      console.error('Error fetching document details: ', error);
    });
  }

  const handleDialogClaimClose = () => {
    setIsDialogClaim(false);
  };

  const handleDialogClaimConfirm = (id, userId, documentTitle) => {
    handleClaimConfirm(id, userId, documentTitle, trackingId);
    setIsDialogClaim(false);
  };

  const handleViewStatus = (id) => {
    setTrackingId(id);
    setIsDialogStatus(true);
    axios.get(`http://localhost:5000/api/claimableDocuments/${id}`)
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
        id: 'select',
        header: ({ table }) =>
          table.getCoreRowModel().rows.length > 0 && (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value);
                setIsAllChecked(value);
              }}
              aria-label="Select all"
            />
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
        id: 'id',
        header: 'Tracking ID',
        accessorKey: 'uniqueId',
      },
      {
        id: 'document',
        header: 'Document',
        accessorKey: 'document',
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
      {
        id: 'claimableDate',
        header: 'Date to be Claim',
        accessorKey: 'claimableDate',
      },
      {
        id: 'reservedDate',
        header: 'Reserved Date',
        accessorKey: 'reservedDate',
        cell: ({ row }) => formatDate(row.original.reservedDate),
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
                {row.original.status !== 'claimed' && (
                  <DropdownMenuItem className="flex items-center gap-1"
                    onClick={() => handleClaim(row.original._id)}
                  >
                    <LuCheckCircle /> 
                    Claimed
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="flex items-center gap-1"
                  onClick={() => handleViewDocument(row.original._id)}
                >
                  <LuInfo />
                  View Document Details
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-1"
                  onClick={() => handleViewStatus(row.original._id)}
                >
                  <LuEye />
                  View Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(row.original._id)}
                  className="flex items-center gap-1 text-destructive focus:text-destructive"
                >
                  <LuTrash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
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
    },
  });

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
                onMouseLeave={() => setIsHover(false)}
              >
                {isHover ? (
                  <LuTrash2 className="text-destructive h-5 w-5" />
                ) : (
                  <LuTrash className="text-destructive h-5 w-5" />
                )}
              </TooltipTrigger>
              <TooltipContent>Delete all</TooltipContent>
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
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
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

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Document Details</DialogTitle>
            <DialogDescription className="text-center">
              You can view all the details here.
            </DialogDescription>
          </DialogHeader>
          {document && (
            <div className='flex flex-col gap-2'>
                <div className='flex flex-row items-center gap-2'>
                  <span className='text-muted-foreground'>Tracking ID: </span>
                    {document._id}
                    {isCopied ? (
                      <LuCopyCheck />
                    ) : (
                      <LuCopy className='cursor-pointer' onClick={() => handleCopy(document._id)}/>
                    )} 
                </div>
                <div><span className='text-muted-foreground'>Document: </span>{document.document}</div>
                <div><span className='text-muted-foreground'>Name: </span>{document.name}</div>
                <div><span className='text-muted-foreground'>Address: </span>{document.address}</div>
                <div><span className='text-muted-foreground'>Reserved Date: </span>{formatDate(document.reservedDate)}</div>
                <div><span className='text-muted-foreground'>Date Approved: </span>{formatDate(document.createdDate)}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogStatus} onOpenChange={setIsDialogStatus}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Document Status</DialogTitle>
            <DialogDescription className="text-center">
              Tracking ID: {trackingId} <br />
              You can track the status of the document here.
            </DialogDescription>
          </DialogHeader>
          <DocumentTracking status={currentStatus} claimedDate={claimedDate}/>
        </DialogContent>
      </Dialog>
    
      <Dialog open={isDialogClaim} onOpenChange={handleDialogClaimClose}>
        <DialogContent>
          <DialogHeader>
              <DialogTitle>Are you sure you want to set this Tracking ID: {trackingId} as claimed?</DialogTitle>
            <DialogDescription>
              You are about to set the document as claimed. You can't undo the changes.
            </DialogDescription>
          </DialogHeader>
          {document && (
            <div>
                <div>
                    <span className='text-muted-foreground'>Document: </span> 
                    {document.document}
                </div>
                <div>
                    <span className='text-muted-foreground'>Name: </span> 
                    {document.name}
                </div>
            </div>
          )}
            <DialogFooter>
              <Button variant='outline' onClick={handleDialogClaimClose}>Cancel</Button>
              <Button onClick={() => handleDialogClaimConfirm(document._id, document.userId, document.document)}>Confirm</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default DataTableClaimableDocuments;
