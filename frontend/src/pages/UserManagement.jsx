import React, { useState, useEffect } from 'react';
import DataTableUser from '@/components/DataTables/DataTableUser';
import DialogBoxAddUser from '@/components/DialogBoxes/UserDialogs/DialogBoxAddUser';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/components/Interceptors/axiosInstance';

const UserManagement = () => {
  const { toast } = useToast();
  const [data, setData] = useState([]);


  useEffect(() => {
    axiosInstance.get('/users')
    .then(response => {
      setData(response.data);
    }).catch(error => {
      console.error('Error fetching users: ', error);
    });
  },[]) 

  const handleAddUser = (userData) => {
    axiosInstance.post('/users', userData)
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
    axiosInstance.delete(`/users/${id}`)
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
    axiosInstance.delete('/documents')
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
    axiosInstance.put(`/users/${userData.id}`, userData)
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