import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogOut from './LogOut';
import wilfredo from '../assets/images/wilfredo.jpg'
import Notification from './Notification';

const PageHeader = () => {
    const location = useLocation();

    const getTitle = (pathname) => {
        switch(pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/document':
                return 'Document Management';
            case '/appointment':
                return 'Appointments';
            case '/user':
                return 'User Management';
            case '/setting':
                return 'Settings';
            case '/viewDocuments':
                return 'Documents';
            case '/claimableDocuments':
                return 'Claimable Documents';
            default:
                return ''
        }
    };

  return (
    <div className='flex items-center justify-between mb-8 w-full'>
        <div className='text-md sm:text-lg md:text-xl lg:text-2xl'>
            {getTitle(location.pathname)}
        </div>
        <div className='flex items-center gap-5'>
            <div className='relative'>
                <Notification />
            </div>
            <img src={wilfredo} className='w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 border-2 rounded-full border-primary' />
            <LogOut />
        </div>
    </div>
  )
}

export default PageHeader;