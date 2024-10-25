import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { useUser } from './Contexts/UserProvider';
import ImageFormat from '@/mobile/mobileComponents/ImageFormat';
import { CircleUser, FileSearch } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import DocumentTracking from './DocumentTracking';

const PageHeader = () => {
    const location = useLocation();
    const { user, profile } = useUser();
    const [trackingId, setTrackingId] = useState('');
    const [IsTrackOpen, setIsTrackOpen] = useState(false);
    const [isDialogStatus, setIsDialogStatus] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const [claimedDate, setClaimedDate] = useState('');
    const [error, setError] = useState(false);

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

    const handleTrackDocument = () => {

        if (!trackingId) {
            setError('Please input the tracking ID');
            return;
        }

        axios
        .get(`${import.meta.env.VITE_API_URL}/documents/track/${trackingId}`)
        .then((response) => {
         const status = response.data.status;
         const claimedDate = response.data.claimedDate;
         setCurrentStatus(status);
         setClaimedDate(claimedDate);
         setIsTrackOpen(false);
         setIsDialogStatus(true);
        })
        .catch((error) => {
            if (error.response) {
                if(error.response.status === 404) {
                    setError(error.response.data.error);
                }
            }
          console.error('Error fetching document details: ', error);
        });
    };

  return (
    <div className='flex items-center justify-between mb-8 w-full p-5 fixed bg-white'>
        <div className='text-md sm:text-lg md:text-xl lg:text-2xl'>
            {getTitle(location.pathname)}
        </div>
        <div className='flex items-center gap-5 fixed right-4'>
            <Dialog open={IsTrackOpen} onOpenChange={setIsTrackOpen}>
                <DialogTrigger>
                    <FileSearch />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>
                        Track Document
                    </DialogTitle>
                    <DialogDescription>
                        This will let you track your document status
                    </DialogDescription>
                    </DialogHeader>   
                        <div className='flex flex-col gap-2'>
                            <Input placeholder="Enter Tracking ID" onChange={(e) => {setTrackingId(e.target.value), setError('')}}/>
                            <p className='text-xs text-red-700'>{error}</p>
                        </div>
                    <DialogFooter>
                    <Button onClick={handleTrackDocument}>Track my document</Button>
                    </DialogFooter>
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
            <div className='relative'>
                <Notification />
            </div>
            {!profile ? (
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