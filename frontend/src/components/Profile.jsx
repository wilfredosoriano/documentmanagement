import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SettingSidebar from './Settings/SettingSidebar';
import { CircleUser, EditIcon } from 'lucide-react';
import { useUser } from './Contexts/UserProvider';
import axios from 'axios';
import { useToast } from './ui/use-toast';
import ImageFormat from '@/mobile/mobileComponents/ImageFormat';
import { LuCheckCircle } from 'react-icons/lu';
import crush from '../assets/images/crush.jpg'
import axiosInstance from './Interceptors/axiosInstance';

export default function Profile() {

    const { user, profile, setProfile } = useUser();
    const userId = user?.userId;
    const { toast } = useToast();
    const accessToken = sessionStorage.getItem('accessToken');

    const [activeSection, setActiveSection] = useState('profile');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [profilePreview, setProfilePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); 

    useEffect(() => {
        if(userId){

            axios.get(`http://localhost:5000/api/users/info/${userId}`)
            .then(response => {
                const { firstname, email, profile } = response.data;
                setFirstname(firstname || '');
                setEmail(email || '');
                setProfile(profile);
            })
            .catch(error => {
            console.error('Error fetching user data:', error);
            });
        }
    }, [userId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!currentPassword || !newPassword || !confirmNewPassword){
            toast({
                variant: 'destructive',
                description: 'Please fill the password to continue',
            });
            return;
        }

        if(newPassword !== confirmNewPassword){
            toast({
                variant: 'destructive',
                title: 'Password not matched',
                description: 'Please input the correct password to continue',
            });
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            axiosInstance.put('/users/updatePassword', { userId, currentPassword, newPassword }, { headers: { 'Authorization': accessToken } })
            .then(() => {
                toast({ 
                    description: 'Password has been updated.',
                    action: (
                        <LuCheckCircle size={20} color='green'/>
                    ),
                });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setIsLoading(false);
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 400) {
                        toast({
                            variant: 'destructive',
                            description: 'Please input your correct current password',
                        });
                    } else if (error.response.status === 401) {
                        toast({
                            variant: 'destructive',
                            description: 'Unauthorized. Please log in again.',
                        });
                    } else {
                        toast({
                            variant: 'destructive',
                            description: 'An unexpected error occurred. Please try again.',
                        });
                    }
                } else {
                    toast({
                        variant: 'destructive',
                        description: 'Network error. Please check your connection and try again.',
                    });
                }
                setIsLoading(false);
            });
        }, 3000);
    };

    const handleUploadProfile = () => {
        document.getElementById('fileInput').click();
    };

    const handleProfileOnchange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setProfilePreview(imageUrl);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('profile', selectedFile);
        formData.append('userId', userId);
        formData.append('firstname', firstname);

        setIsLoading(true);

        setTimeout(() => {
            axios.put('http://localhost:5000/api/users/updateProfile', formData)
            .then(response => {
                const { user } = response.data; 

                setProfile(user.profile); 
                setFirstname(user.firstname);

                toast({
                    description: 'Profile has been updated.',
                    action: (
                        <LuCheckCircle size={20} color='green'/>
                    ),
                })
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error updating profile: ', error);
                setIsLoading(false);
            });
        }, 3000);
    };

  return (
    <div className='flex max-md:flex-col'>
            <SettingSidebar activeSection={activeSection} onSectionClick={setActiveSection} />
        <div className='flex-1 p-5'>
        {activeSection === 'profile' && (
             <form onSubmit={handleUpdate}>
                <div className='flex flex-row gap-6 max-sm:flex-col'>
                    <div className='flex flex-col items-center gap-3'>
                        {profilePreview ? (
                            <img src={profilePreview} className='h-28 w-28 object-cover rounded-full border-2 border-black'/>
                        ) : profile ? (
                            <ImageFormat src={profile} className='h-28 w-28 object-cover rounded-full border-2 border-black'/>
                        ) : (
                            <CircleUser className='h-28 w-28'/>
                        )}
                        <input type='file' id='fileInput' accept='image/*' className='hidden' onChange={handleProfileOnchange}/>
                        <EditIcon 
                            onClick={handleUploadProfile}
                        />
                    </div>
                    <div className='flex-1'>
                        <div className='font-semibold text-xl'>Profile</div>
                        <p className='text-muted-foreground'>This is how others will see you</p>
                        <Separator className="my-4" />
                        <Label>Username</Label>
                            <Input value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                            <div className='text-sm text-muted-foreground mt-1 mb-5'>This is the name that will displayed on the system</div>
                        <Label>Email</Label>
                            <Input value={email} readOnly/>
                            <div className='text-sm text-muted-foreground mt-1 mb-5'>Your registered valid email address</div>

                            <Button type='submit' disabled={isLoading}>
                                {!isLoading ? (
                                    <>
                                        Update Profile
                                    </>
                                ) : (
                                    <>
                                        Updating...
                                    </>
                                )}
                            </Button>
                    </div>
                </div>
            </form>
        )}
        {activeSection === 'account' && (
            <form onSubmit={handleSubmit}>
                <div className='font-semibold text-xl'>Account</div>
                <p className='text-muted-foreground'>Manage your account settings</p>
                <Separator className="my-4" />
                    <Label className='mb-4'>Password</Label>
                    <Input type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    <div className='text-sm text-muted-foreground mt-1 mb-5'>Current password</div>
                    <Input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <div className='text-sm text-muted-foreground mt-1 mb-5'>New password</div>
                    <Input type='password' value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    <div className='text-sm text-muted-foreground mt-1 mb-5'>Confirm new password</div>
                    <Button type='submit' disabled={isLoading}>
                        {!isLoading ? (
                            <>
                                Update Account
                            </>
                        ) : (
                            <>
                                Updating...
                            </>
                        )}
                    </Button>
            </form>
        )}
        </div>
    </div>
  )
}
