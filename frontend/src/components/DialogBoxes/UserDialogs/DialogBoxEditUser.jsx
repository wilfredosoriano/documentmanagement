import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import axios from 'axios';
  

const DialogBoxEditUser = ({ onClick, isOpen, onClose, userId }) => {
    const [firstname, setFirstname] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

  useEffect(() => {
    if(userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
      .then(response => {
        const user = response.data;
        setFirstname(user.firstname);
        setMiddlename(user.middlename);
        setLastname(user.lastname);
        setEmail(user.email);
        setAddress(user.address);
      })
      .catch(error => {
        console.error('Error fetching users: ', error);
      })
    }
  }, [userId])

  const handleEditUser = (e) => {
    e.preventDefault();

    const userData = {
      id: userId,
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      address: address
    };

    //console.log(documentData);

    onClick(userData); 

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
                This will edit the user details from the database.
            </DialogDescription>
            </DialogHeader>
            <div className='flex gap-4'>
            <Input type="text" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            <Input type="text" placeholder="Middlename" value={middlename} onChange={(e) => setMiddlename(e.target.value)} />
            <Input type="text" placeholder="Lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </div>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly disabled/>
            <Textarea type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <DialogFooter>
                <Button onClick={handleEditUser}>Edit Document</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DialogBoxEditUser;