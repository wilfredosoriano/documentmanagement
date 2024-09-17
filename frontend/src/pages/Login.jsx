import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { LuGraduationCap } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@/components/Contexts/UserProvider';

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
          if (response.data.message === 'Change Password Required') {
            navigate('/changePassword', { state: { userId: response.data.userId } });
          } else {
            const { token, role, userId } = response.data;
            const userData = { email, role, userId };
            login(userData);
            localStorage.setItem('token', token);

            if (role === 'admin') {
                navigate('/dashboard');
            } else if (role === 'student') {
                navigate('/mobileDocuments');
            } else { 
                alert("Please use a registered account.");
            }
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            alert('Invalid credentials');
          } else {
            alert('An error occurred');
          }
        }
    };

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
        <h1 className='flex flex-row gap-2 items-center text-lg font-bold font-sans '><LuGraduationCap size={30}/> UniForms</h1>
       <form action="" onSubmit={handleLogin} className='flex flex-col gap-2 my-5 p-10 bg-white rounded-2xl shadow-xl w-64 sm:w-64 sm:p-10 md:w-72 md:p-12 lg:w-80 lg:p-14 xl:w-96 xl:p-16 2xl:w-1/4 2xl:p-20 transition-all'>
       <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className='text-xs text-end'>Forgot Password?</p>
        <Button type="submit">Login</Button>
       </form>
    </div>
  );
}

export default Login;
