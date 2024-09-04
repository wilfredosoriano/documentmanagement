import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '../../ui/button';
import { LuPlus } from 'react-icons/lu';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
  

const DialogBoxAddUser = ({ onClick }) => {

  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();

    let randromPassword = (Math.random() + 1).toString(36).substring(7);
    console.log(randromPassword);

    const userData = {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      email: email,
      address: address,
      password: randromPassword,
      role: 'student'
    }

    onClick(userData);

    setFirstname('');
    setMiddlename('');
    setLastname('');
    setEmail('');
    setAddress('');

  }

  return (
    <Dialog>
      <DialogTrigger asChild className='gap-2'>
        <Button><LuPlus size={20}/>Add User</Button>
      </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
                This will add new user to the database.
            </DialogDescription>
            </DialogHeader>
            <div className='flex gap-4'>
            <Input type="text" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            <Input type="text" placeholder="Middlename" value={middlename} onChange={(e) => setMiddlename(e.target.value)} />
            <Input type="text" placeholder="Lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </div>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Textarea type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <DialogFooter>
                <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DialogBoxAddUser;