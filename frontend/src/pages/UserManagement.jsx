import React, { useMemo, useState, useEffect } from 'react';
import DataTableUser from '@/components/DataTables/DataTableUser';
import DialogBoxAddUser from '@/components/DialogBoxes/UserDialogs/DialogBoxAddUser';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const UserManagement = () => {
  const { toast } = useToast();
  const [data, setData] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
    .then(response => {
      setData(response.data);
    }).catch(error => {
      console.error('Error fetching users: ', error);
    });
  },[])

  const handleAddUser = (userData) => {
    axios.post('http://localhost:5000/api/users', userData)
      .then(response => {
        const newUser = response.data;
        setData(prevData => [...prevData, newUser]);
        toast({
          description: "User added successfully.",
        });
      })
      .catch(error => {
        console.error('Error adding user:', error);
        toast({
          description: "Error adding user.",
        });
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/users/${id}`)
      .then(() => {
        setData(prevData => prevData.filter(user => user._id !== id));
        toast({
          variant: "destructive",
          description: "User has been deleted.",
        });
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleDeleteAll = () => {
    axios.delete('http://localhost:5000/api/documents')
      .then(() => {
        setData([]);
        toast({
          variant: "destructive",
          description: "Document has been deleted.",
        });
      })
      .catch(error => {
        console.error('Error deleting document:', error);
      });
  };

  const handleEditUsers = (userData) => {
    axios.put(`http://localhost:5000/api/users/${userData.id}`, userData)
      .then(response => {
        const updatedUser = response.data;
        console.log(updatedUser);
        setData(prevData => prevData.map(user => (user._id === updatedUser._id ? updatedUser : user)));
        toast({
          description: "User has been successfully edited.",
        });
      })
      .catch(error => {
        console.error('Error updating user: ', error);
        toast({
          description: "Error updating user.",
        });
      });
  };  

  return (
    <div className='flex flex-col max-h-screen'>
          <PageHeader/>
          <div className='mt-20 p-5'>
          <DialogBoxAddUser onClick={handleAddUser}/>
          <DataTableUser 
          data={data} 
          handleDelete={handleDelete} 
          handleDeleteAll={handleDeleteAll}
          handleOnClickEdit={handleEditUsers}
          />
          </div>
    </div>
  )
};

export default UserManagement;