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
    <div className="flex-1">
      <PageHeader />
      <div className='flex'>
        <SettingSidebar activeSection={activeSection} onSectionClick={setActiveSection} />
        <div className='flex-1 p-5'>
          {activeSection === 'profile' && (
            <>
              <div className='font-semibold text-xl'>Profile</div>
              <p className='text-muted-foreground'>This is how others will see you</p>
              <Separator className="my-4" />
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              <div className='text-sm text-muted-foreground mt-1 mb-5'>This is the name that will displayed on the system</div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className='text-sm text-muted-foreground mt-1 mb-5'>Your registered valid email address</div>
              <Button onClick={onSubmit}>Update Profile</Button>
            </>
          )}
          {activeSection === 'account' && (
            <>
              <div className='font-semibold text-xl'>Account</div>
              <p className='text-muted-foreground'>Manage your account settings</p>
              <Separator className="my-4" />
              {/* Add account-related inputs and actions here */}
              <Label>Password</Label>
              <Input type='password' value={existingData.password} onChange={(e) => setEmail(e.target.value)} />
              <div className='text-sm text-muted-foreground mt-1 mb-5'>Your account password</div>
              <Input type='password' value={existingData.password} onChange={(e) => setEmail(e.target.value)} />
              <div className='text-sm text-muted-foreground mt-1 mb-5'>Confirm password</div>
              <Button onClick={onSubmit}>Update Account</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
