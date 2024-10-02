import React, { useContext, useEffect, useState } from 'react';
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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from './Contexts/NotificationContext';

export default function Notification() {

    const formatTime = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now - date;

        const seconds = Math.floor(diffInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        if(seconds < 60) return 'just now';
        if(minutes < 60) return `${minutes}m ago`;
        if(hours < 24) return `${hours}h ago`;
        if(days < 7) return `${days}d ago`;
        return `${weeks}w ago`;
    };

    const { notificationCount, setNotificationCount } = useContext(NotificationContext);
    const [notificationsData, setNotificationsData] = useState([]);
    const navigate = useNavigate();

    const handleClickNotification = (notificationId) => {
        axios.put(`http://localhost:5000/api/appointments/notifications/${notificationId}`)
        .then(response => {
            const { updatedNotification } = response.data;

            setNotificationsData(prevData =>
                prevData.map(notification =>
                    notification._id === updatedNotification._id ? updatedNotification : notification
                )
            );

            const unreadNotifications = notificationsData.filter(notification => notification.isRead === false);
            const newCount = unreadNotifications.length - 1;
            setNotificationCount(newCount);

            localStorage.setItem('notificationCount', newCount);

            navigate('/appointment');
        })
        .catch(error => {
            console.error('Error updating notifications: ', error);
        })
    };
    
    useEffect(() => {

        const storedCount = localStorage.getItem('notificationCount');
        if (storedCount) {
            setNotificationCount(parseInt(storedCount));
        }

        const fetchNotifications = () => {
            axios.get('http://localhost:5000/api/appointments')
            .then(response => {

                const newNotification = response.data.filter(notification => notification.reservedDate)
                .sort((a, b) => new Date(b.reservedDate) - new Date(a.reservedDate));
                setNotificationsData(newNotification);

                const unreadNotifications = response.data.filter(notification => !notification.isRead);
                setNotificationCount(unreadNotifications.length);

                localStorage.setItem('notificationCount', unreadNotifications.length);
            })
            .catch(error => {
                console.error('Error fetching notifications: ', error);
            });
        };
    
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 30000);
    
        return () => {
            clearInterval(intervalId);
        };
        
    }, []);    

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <LuBell className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7'/>
            {notificationCount > 0 && (
            <div 
                className={`flex items-center justify-center bg-destructive absolute bottom-5 left-3 text-background px-2 w-6 h-6 py-1 rounded-full ${notificationCount > 99 ? 'text-[9px]' : 'text-xs'}`}>
                {notificationCount > 99 ? '99+' : notificationCount}
            </div>
            )}
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        <DropdownMenuLabel>
            Notifications
            <div className='text-xs text-muted-foreground'>You have {notificationCount} unread messages.</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className='h-72 w-72 overflow-y-auto'>
        {notificationsData.length === 0 ? (
            <div className="flex items-center justify-center p-4">
                <p className='text-sm text-muted-foreground'>No notifications yet.</p>
            </div>
        ) : (
        notificationsData.map((notification, index) => (
        <DropdownMenuItem
            key={index}
            onClick={() => handleClickNotification(notification._id)}
            className="grid grid-cols-[25px_1fr] items-start p-4">
            <span className={`flex h-2 w-2 translate-y-1 rounded-full ${notification.isRead === false ? 'bg-sky-500' : '' }`}/>
            <div className='space-y-1'>
                <p className='text-sm leading-none'>
                    <b className='font-semibold'>{notification.name}</b> reserved a document <b className='font-semibold'>{notification.document}</b>
                </p>
                <p className='text-xs text-muted-foreground'>
                    {formatTime(notification.reservedDate)}
                </p>
            </div>
        </DropdownMenuItem>
        ))
        )}
        </div>
        </DropdownMenuContent>
    </DropdownMenu>
  )
};
