import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LuBell, LuCheck } from 'react-icons/lu';
import { Button } from './ui/button'; 

export default function Notification() {

    const [notificationCount, setNotificationCount] = useState(105);

    const notifications = [
        {
            title: "Your call has been confirmed.",
            description: "1 hour ago",
        },
        {
            title: "You have a new message!",
            description: "1 hour ago",
        },
        {
            title: "Your subscription is expiring soon!",
            description: "2 hours ago",
        },
    ]

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <LuBell className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7'/>
            <div 
                className={`flex items-center justify-center bg-destructive absolute bottom-5 left-3 text-background px-2 w-6 h-6 py-1 rounded-full ${notificationCount > 99 ? 'text-[9px]' : 'text-xs'}`}>
                {notificationCount > 99 ? '99+' : notificationCount}
            </div>
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        <DropdownMenuLabel>
            Notifications
            <div className='text-xs text-muted-foreground'>You have 3 unread messages.</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.map((notification, index) => (
        <DropdownMenuItem
            key={index}
            className="grid grid-cols-[25px_1fr] items-start p-4">
            <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500'/>
            <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>
                    {notification.title}
                </p>
                <p className='text-xs text-muted-foreground'>
                    {notification.description}
                </p>
            </div>
        </DropdownMenuItem>
        ))}
        <DropdownMenuItem>
            <Button className="w-full"><LuCheck className='mr-2 w-4 h-4'/> Mark all as read</Button>
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
};
