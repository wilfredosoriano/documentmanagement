import React, { useState, useMemo } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { ArrowUpDown  } from 'lucide-react'
import { LuInfo, LuMoreHorizontal, LuTrash, LuUser } from 'react-icons/lu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CustomDialog from '../DialogBoxes/CustomDialog'
import axios from 'axios'
import DialogBoxEditUser from '../DialogBoxes/UserDialogs/DialogBoxEditUser'

const DataTableUser = ({ data, handleDelete, handleDeleteAll, handleOnClickEdit }) => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [filtering, setFiltering] = useState('');
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
    const [user, setUser] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);

    const handleViewUser = (id) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/info/${id}`)
        .then((response) => {
          const data = response.data;
          setUser(data);
          setIsDialogOpen(true);
        })
        .catch((error) => {
          console.error('Error fetching user details: ', error);
        });
    };

    const handleDialogClose = () => {
      setIsDialogOpen(false);
    };

    const handleEditUsers = (id) => {
      setCurrentUserId(id)
      setIsDialogEditOpen(true);
    };

    const columns = useMemo(
        () => [
          {
              id: "select",
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) => { table.toggleAllPageRowsSelected(!!value); setIsAllChecked(value)}}
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
            id: 'email',
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                )
            },
            accessorKey: 'email',
          },
          {
            id: 'firstname',
            header: 'Firstname',
            accessorKey: 'firstname',
          },
          {
            id: 'middlename',
            header: 'Middlename',
            accessorKey: 'lastname',
          },
          {
            id: 'address',
            header: 'Address',
            accessorKey: 'address'
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
                  onClick={() => handleEditUsers(row.original._id)}
                  className="flex items-center gap-1">
                    <LuUser />
                    Edit user details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                  className="flex items-center gap-1"
                  onClick={() => handleViewUser(row.original._id)}
                  >
                  <LuInfo />
                  View User Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDelete(row.original._id)}
                    className="flex items-center gap-1 text-destructive focus:text-destructive">
                    <LuTrash/>
                    Delete
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
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter: filtering,
        }
    })

  return (
    <div>
        <div className="flex items-center py-4 justify-between">
             <Input 
                placeholder="Search..."
                className="max-w-xs"
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
            />
            {isAllChecked && (
                <Button variant="destructive" className="flex items-center gap-1" onClick={handleDeleteAll}> <LuTrash/> Delete</Button>
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

        <CustomDialog 
        Details="Document Details"
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        Description="You can view all the details here."
        Content={
          user && (
            <div className='flex flex-col gap-2'>
                <div className='flex flex-row items-center gap-2'>
                  <span className='text-muted-foreground'>User ID: </span>
                    {user._id}
                </div>
                <div><span className='text-muted-foreground'>Name: </span>{user.firstname} {user.middlename} {user.lastname}</div>
                <div><span className='text-muted-foreground'>Address: </span>{user.address}</div>
                {(user.hasChangedPassword === false) && (
                    <div><span className='text-muted-foreground'>Password: </span>{user.password}</div>
                )}
            </div>
          )
        }
      />

      <DialogBoxEditUser
        isOpen={isDialogEditOpen}
        onClose={setIsDialogEditOpen}
        userId={currentUserId}
        onClick={handleOnClickEdit}
      />

    </div>
  )
}

export default DataTableUser;