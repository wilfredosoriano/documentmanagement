import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useUser } from './Contexts/UserProvider';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login'); 
  };

  return (
    <AlertDialog>
        <AlertDialogTrigger>
          {user ? (
          <div className='mr-20 max-sm:mr-0 border px-3 py-1 rounded-md cursor-pointer text-sm whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary'
          >Sign out</div>
          ) : (
            <div className='mr-20 max-sm:mr-0 border px-3 py-1 rounded-md cursor-pointer text-sm whitespace-nowrap hover:bg-primary hover:text-primary-foreground'
              onClick={navigateToLogin}
            >Sign in</div>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
                You are about to logout your account.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
};

export default LogOut;