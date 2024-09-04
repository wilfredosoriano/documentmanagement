import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { LuGraduationCap } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId;
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
          await axios.post('http://localhost:5000/api/users/changePassword', { userId, newPassword });
          alert('Password changed successfully');
          navigate('/login');
        } catch (error) {
          alert('An error occurred');
        }
      };

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
        <h1 className='flex flex-row gap-2 items-center text-lg font-bold font-sans '><LuGraduationCap size={30}/> UniForms</h1>
       <form action="" onSubmit={handleChangePassword} className='flex flex-col gap-2 my-5 p-10 bg-white rounded-2xl shadow-xl w-64 sm:w-64 sm:p-10 md:w-72 md:p-12 lg:w-80 lg:p-14 xl:w-96 xl:p-16 2xl:w-1/4 2xl:p-20'>
        <Input placeholder="Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Button type="submit">Update Password</Button>
       </form>
    </div>
  );
}

export default ChangePassword;
