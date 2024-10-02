import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { LuGraduationCap } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const ChangePassword = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId;
    const [newPassword, setNewPassword] = useState('');
    const { toast } = useToast();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/users/changePassword`, { userId, newPassword });
          toast({
            description: 'Password changed successfully',
          });
          navigate('/login');
        } catch (error) {
          console.error('Error changing password: ', error);
          toast({
            variant: 'destructive',
            description: 'Network error. Please check your connection and try again.',
          });
        }
      };

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
        <h1 className='flex flex-row gap-2 items-center text-lg font-bold font-sans '><LuGraduationCap size={30}/> UniForms</h1>
       <form action="" onSubmit={handleChangePassword} className='flex flex-col gap-2 my-5 px-12 py-14 bg-white rounded-2xl shadow-xl mx-5 w-80 sm:w-80 md:w-96 lg:w-96 transition-all'>
        <Input placeholder="Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Button type="submit">Update Password</Button>
       </form>
    </div>
  );
}

export default ChangePassword;
