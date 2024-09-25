import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { LuGraduationCap } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MobileDetect from 'mobile-detect';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '@/components/Contexts/UserProvider';

const getDeviceType = () => {
  const md = new MobileDetect(window.navigator.userAgent);

  if(md.mobile()) return 'Mobile';
  return 'Desktop';
};

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const deviceType = getDeviceType();
    const { login } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/users/login', { email, password }, { withCredentials: true });
          if (response.data.message === 'Change Password Required') {
            navigate('/changePassword', { state: { userId: response.data.userId } });
          } else {

            const { accessToken  } = response.data;
            const decodedToken = jwtDecode(accessToken);
            const userData = { role: decodedToken.role, userId: decodedToken.userId, username: decodedToken.username };
            login(userData);

            sessionStorage.setItem('accessToken', accessToken);
            axios.defaults.headers.common['Authorization'] = accessToken;

            //insert the device type and count
            const currentDate = new Date();
            const userId = decodedToken.userId;
            await axios.post('http://localhost:5000/api/users/deviceCounts', { deviceType, userId, currentDate });

            //redirect user or admin to their own components
            if (decodedToken.role === 'admin') {
                navigate('/dashboard');
            } else if (decodedToken.role === 'student') {
                navigate('/mobileDocuments');
            } else { 
                alert("Please use a registered account.");
            }
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            alert('Invalid credentials');
          } else {
            console.error('Error logging in: ', error);
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
