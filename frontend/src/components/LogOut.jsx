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
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai"

const LogOut = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login'); 
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AlertDialog>
        <AlertDialogTrigger className='w-full'>
          {user ? (
          <div className='max-sm:mr-0 border px-3 py-2 flex justify-center items-center gap-2 rounded-md cursor-pointer text-sm whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary'
          >Sign out <AiOutlineLogout size={18}/></div>
          ) : (
            <div className='max-sm:mr-0 border px-3 py-2 flex justify-center items-center gap-2 rounded-md cursor-pointer text-sm whitespace-nowrap hover:bg-primary hover:text-primary-foreground'
              onClick={navigateToLogin}
            >Sign in <AiOutlineLogin size={18}/></div>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="w-10/12">
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
                You are about to logout your account.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
};

export default LogOut;