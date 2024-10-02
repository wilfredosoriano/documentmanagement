import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import crush from '../assets/images/wilfredo.jpg'
import Notification from './Notification';
import { useUser } from './Contexts/UserProvider';
import ImageFormat from '@/mobile/mobileComponents/ImageFormat';
import { CircleUser } from 'lucide-react';

const PageHeader = () => {
    const location = useLocation();
    const { user, profile } = useUser();

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
    <div className='flex items-center justify-between mb-8 w-full border-b p-5 fixed bg-white'>
        <div className='text-md sm:text-lg md:text-xl lg:text-2xl'>
            {getTitle(location.pathname)}
        </div>
        <div className='flex items-center gap-5 fixed right-4'>
            <div className='relative'>
                <Notification />
            </div>
            {!profile ? (
                // <img src={crush} className='h-8 w-8 object-cover sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border-2 border-black'/>
                <CircleUser className='h-8 w-8'/>
            ) : (
                <ImageFormat src={profile} className='w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 border-2 rounded-full border-primary' />
            )}
            {user?.username}
        </div>

    </div>
  )
}

export default PageHeader;