import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { LuGraduationCap } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MobileDetect from 'mobile-detect';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '@/components/Contexts/UserProvider';
import { useToast } from '@/components/ui/use-toast';
import { LoaderCircle } from 'lucide-react';
import { z } from 'zod';

const getDeviceType = () => {
  const md = new MobileDetect(window.navigator.userAgent);

  if(md.mobile()) return 'Mobile';
  return 'Desktop';
};

const loginSchema = z.object({
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be atleast 6 characters long').nonempty('Password is required')
})

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const deviceType = getDeviceType();
    const { login } = useUser();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
            const newErrors = {};
            validation.error.errors.forEach(err => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, { email, password }, { withCredentials: true });
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
            await axios.post(`${import.meta.env.VITE_API_URL}/users/deviceCounts`, { deviceType, userId, currentDate });

            //redirect user or admin to their own components
            if (decodedToken.role === 'admin') {
                navigate('/dashboard');
            } else if (decodedToken.role === 'student') {
                navigate('/mobileDocuments');
            } else { 
                toast({
                  variant: 'destructive',
                  description: 'Please use a registered account',
              });
            }
          }
        } catch (error) {
          if (error.response) {
              if (error.response.status === 401) {
                setErrors({ [error.response.data.field]: error.response.data.message });
              } else {
                  console.error('Error logging in: ', error);
                  toast({
                      variant: 'destructive',
                      description: 'Network error. Please check your connection and try again.',
                  });
              }
          } else {
              console.error('Error logging in: ', error);
              toast({
                  variant: 'destructive',
                  description: 'An unexpected error occurred. Please try again.',
              });
          }
        } finally {
          setLoading(false);
        }
    };

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
        <h1 className='flex flex-row gap-2 items-center text-lg font-bold font-sans '><LuGraduationCap size={30}/> UniForms</h1>
       <form action="" onSubmit={handleLogin} className='flex flex-col gap-2 my-5 px-12 py-14 bg-white rounded-2xl shadow-xl mx-5 w-80 sm:w-80 md:w-96 lg:w-96 transition-all'>
       <Input placeholder="Email" type="email" value={email} onChange={(e) => {setEmail(e.target.value), setErrors('')}} />
        {errors.email && <p className="text-red-500 text-xs mb-1">{errors.email}</p>}
        <Input placeholder="Password" type="password" value={password} onChange={(e) => {setPassword(e.target.value), setErrors('')}} />
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          <Button type='submit' disabled={loading} className='mt-3'>
              {!loading ? (
                  <>
                      Login
                  </>
              ) : (
                  <>
                      <LoaderCircle className='animate-spin'/>
                  </>
              )}
          </Button>
       </form>
    </div>
  );
}

export default Login;
