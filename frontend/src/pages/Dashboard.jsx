import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import DashboardBox from '@/components/DashboardBox';
import { LuFolder, LuUsers, LuCalendar, } from 'react-icons/lu';
import DashboardChart from '@/components/Charts/DashboardChart';
import axiosInstance from '@/components/Interceptors/axiosInstance';

const Dashboard = () => {
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDocumentsToday, setTotalDocumentsToday] = useState(0);

  useEffect(() => {
    fetchDocuments();
    fetchUsers();
    fetchDocumentsToday();
  }, []);

  const fetchDocuments = () => {
    axiosInstance.get('/titles')
      .then(response => {
        setTotalDocuments(response.data.length);
      }).catch(error => {
        console.error('Error fetching documents: ', error);
      });
  };

  const fetchDocumentsToday = () => {
    const today = new Date().toISOString().split('T')[0];

    axiosInstance.get(`/documents?date=${today}`)
      .then(response => {
        setTotalDocumentsToday(response.data.length);
      }).catch(error => {
        console.error('Error fetching documents: ', error);
      });
  };

  const fetchUsers = () => {
    axiosInstance.get('/users')
      .then(response => {
        setTotalUsers(response.data.length);
      }).catch(error => {
        console.error('Error fetching users: ', error);
      });
  };

  return (
    <div className='flex flex-col max-h-screen'>
      <PageHeader />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 mt-20'>
        <DashboardBox title='Total Users' count={totalUsers} logo={<LuUsers size={20} color='#2A9D90'/>} className='bg-[#2A9D90]'/>
        <DashboardBox title='Total Documents' count={totalDocuments} logo={<LuFolder size={20} color='#2A9D90'/>} className='bg-[#E76E4F]' />
        <DashboardBox title='Request Today' count={totalDocumentsToday} logo={<LuCalendar size={20} color='#2A9D90'/>} className='bg-[#3366C2]'/>

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
