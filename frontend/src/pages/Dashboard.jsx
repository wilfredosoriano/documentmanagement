import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import DashboardBox from '@/components/DashboardBox';
import axios from 'axios';
import { LuFolder, LuUsers, LuCalendar, } from 'react-icons/lu';
import DashboardChart from '@/components/Charts/DashboardChart';

const Dashboard = () => {
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDocumentsToday, setTotalDocumentsToday] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);

  useEffect(() => {
    fetchDocuments();
    fetchUsers();
    fetchDocumentsToday();
    fetchAppointments();
  }, []);

  const fetchDocuments = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/titles`)
      .then(response => {
        setTotalDocuments(response.data.length);
      }).catch(error => {
        console.error('Error fetching documents: ', error);
      });
  };

  const fetchDocumentsToday = () => {
    const today = new Date().toISOString().split('T')[0];

    axios.get(`${import.meta.env.VITE_API_URL}/documents?date=${today}`)
      .then(response => {
        setTotalDocumentsToday(response.data.length);
      }).catch(error => {
        console.error('Error fetching documents: ', error);
      });
  };

  const fetchUsers = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/users`)
      .then(response => {
        setTotalUsers(response.data.length);
      }).catch(error => {
        console.error('Error fetching users: ', error);
      });
  };

  const fetchAppointments = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/appointments`)
    .then(response => {
      setTotalAppointments(response.data.length);
    })
    .catch(error => {
      console.error('Error fetching appointments: ', error);
    })
  };

  return (
    <div className='flex flex-col max-h-screen'>
      <PageHeader />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 mt-20'>
        <DashboardBox title='Total Users' count={totalUsers} logo={<LuUsers size={20} />} />
        <DashboardBox title='Total Documents' count={totalDocuments} logo={<LuFolder size={20} />} />
        <DashboardBox title='Request Today' count={totalDocumentsToday} logo={<LuCalendar size={20} />} />

        <div className='col-span-3'>
          <DashboardChart />
        </div>

        <div className='col-span-3 text-center py-4'>
          <p>© 2024 Wilfredo. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
