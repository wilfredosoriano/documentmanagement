import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import SettingSidebar from '@/components/Settings/SettingSidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Profile from '@/components/Profile';

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const Setting = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const existingData = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'password123',
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: existingData,
  });

  const onSubmit = () => {
    console.log('updated');
  };

  return (
    <div className="flex flex-col max-h-screen">
      <PageHeader />
      <div className='mt-20 p-5'>
        <Profile/>
      </div>
    </div>
  );
};

export default Setting;
