import React, { useEffect } from 'react'
import { LuFolder, LuFolderCog, LuFolderSync } from 'react-icons/lu'; 
import { AiFillFolderOpen, AiOutlineFolderOpen } from "react-icons/ai";
import { RiFolderSettingsFill, RiFolderSettingsLine, RiFolderSharedFill, RiFolderSharedLine, RiUser3Fill, RiUser3Line } from "react-icons/ri";
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/components/Contexts/UserProvider';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function Navigation({ menuOpen, setMenuOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const { toast } = useToast();

    const goToDocuments = () => {
        navigate('/mobileDocuments');
    };

    const goToTransactions = () => {
        if(!user){
            toast({
                title: 'Access Denied',
                variant: 'destructive',
                description: 'Please login to proceed with transactions.',   
                action: (
                    <ToastAction altText="Goto login page" onClick={() => navigate('/login')}>Login</ToastAction>
                )
            })
            return;
        }   
        navigate('/mobileTransactions');
    };

    const goToProfile = () => {
        if(!user){
            toast({
                title: 'Access Denied',
                variant: 'destructive',
                description: 'Please login to proceed with transactions.',   
                action: (
                    <ToastAction altText="Goto login page" onClick={() => navigate('/login')}>Login</ToastAction>
                )
            })
            return;
        }   
        navigate('/mobileProfile');
    }

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [setMenuOpen]);

    useEffect(() => {
        localStorage.setItem('menuOpen', menuOpen);
    }, [menuOpen]);

  return (
    <ul className={`bg-background h-full fixed transition-transform sm:top-0 sm:mt-[64px] sm:right-0 max-sm:bottom-0 max-sm:h-auto max-sm:w-full max-sm:flex max-sm:flex-row max-sm:justify-between ${menuOpen ? 'w-[240px]' : 'w-[96px]'}`}>
        <li className={`p-3 w-full ${isActive('/mobileDocuments') ? 'bg-slate-300' : 'hover:bg-slate-200' } flex items-center cursor-pointer ${menuOpen ? 'flex-row gap-5 pl-6 text-sm ' : 'flex-col gap-2 text-xs'}`}
            onClick={goToDocuments}
        >
            {isActive('/mobileDocuments') ? <AiFillFolderOpen size={20}/> :  <AiOutlineFolderOpen size={20}/> }   Documents
        </li>
        <li className={`p-3 w-full ${isActive('/mobileTransactions') ? 'bg-slate-300' : 'hover:bg-slate-200' } flex items-center cursor-pointer ${menuOpen ? 'flex-row gap-5 pl-6 text-sm' : 'flex-col gap-2 text-xs'}`}
            onClick={goToTransactions}
        >
            {isActive('/mobileTransactions') ? <RiFolderSharedFill size={20}/> : <RiFolderSharedLine size={20}/> } Transactions
        </li>
        <li className={`p-3 w-full ${isActive('/mobileProfile') ? 'bg-slate-300' : 'hover:bg-slate-200' }  flex items-center cursor-pointer ${menuOpen ? 'flex-row gap-5 pl-6 text-sm' : 'flex-col gap-2 text-xs'}`}
            onClick={goToProfile}
        >
            {isActive('/mobileTransaction') ? <RiUser3Fill size={20}/> : <RiUser3Line size={20}/> } Profile
        </li>
     </ul>
  )
}
