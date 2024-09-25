import React, { useMemo, useEffect, useState} from 'react';
import DataTableAppointment from '@/components/DataTables/DataTableAppointment';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Appointment = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState([]);   

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
    .then(response => {
      setData(response.data);
    }).catch(error => {
      console.error('Error fetching documents: ', error);
    });
  },[])

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/appointments/${id}`)
      .then(() => {
        setData(prevData => prevData.filter(doc => doc._id !== id));
        toast({
          variant: "destructive",
          description: "Document has been deleted.",
        });
      })
      .catch(error => {
        console.error('Error deleting document:', error);
      });
  };

  const handleDeleteAll = () => {
    axios.delete('http://localhost:5000/api/titles')
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

  const handleApprove = (id) => {
    axios.post(`http://localhost:5000/api/appointments/${id}`)
    .then(response => {
      const { updatedAppointment } = response.data;

      setData(prevAppointments => prevAppointments.map(app => app._id === updatedAppointment._id ? updatedAppointment : app));

      toast({
        description: "Document has been approved.",
      });
    })
    .catch(error => {
      console.error('Error approving documents: ', error);
    })
  };

  return (
    <div className='flex flex-col max-h-screen'>
      <PageHeader />
      <div className='mt-20 p-5'>
      <DataTableAppointment
        data={data} 
        handleDelete={handleDelete} 
        handleDeleteAll={handleDeleteAll}
        handleApprove={handleApprove}
      />
      </div>
    </div>
  )
};

export default Appointment;