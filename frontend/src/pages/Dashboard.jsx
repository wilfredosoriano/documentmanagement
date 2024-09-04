import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import DashboardBox from '@/components/DashboardBox';
import axios from 'axios';
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LuFolder, LuUsers, LuCalendar, LuCoins } from 'react-icons/lu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChartContainer } from '@/components/ui/chart';

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
    axios.get('http://localhost:5000/api/titles')
      .then(response => {
        setTotalDocuments(response.data.length);
      }).catch(error => {
        console.error('Error fetching documents: ', error);
      });
  };

  const fetchDocumentsToday = () => {
    const today = new Date().toISOString().split('T')[0];

    axios.get(`http://localhost:5000/api/documents?date=${today}`)
      .then(response => {
        setTotalDocumentsToday(response.data.length);
      }).catch(error => {
        console.error('Error fetching documents: ', error);
      });
  };


  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        setTotalUsers(response.data.length);
      }).catch(error => {
        console.error('Error fetching users: ', error);
      });
  };

  const fetchAppointments = () => {
    axios.get('http://localhost:5000/api/appointments')
    .then(response => {
      setTotalAppointments(response.data.length);
    })
    .catch(error => {
      console.error('Error fetching appointments: ', error);
    })
  };

  const data = [
    {
      name: 'Jan',
      revenue: 10400,
      subscription: 240,
    },
    {
      name: 'Feb',
      revenue: 14405,
      subscription: 300,
    },
    {
      name: 'Mar',
      revenue: 9400,
      subscription: 200,
    },
    {
      name: 'Apr',
      revenue: 8200,
      subscription: 278,
    },
    {
      name: 'May',
      revenue: 7000,
      subscription: 189,
    },
    {
      name: 'Jun',
      revenue: 9600,
      subscription: 239,
    },
    {
      name: 'Jul',
      revenue: 11244,
      subscription: 278,
    },
    {
      name: 'Aug',
      revenue: 26475,
      subscription: 345,
    },
    {
      name: 'Sept',
      revenue: 9000,
      subscription: 653,
    },
    {
      name: 'Oct',
      revenue: 17500,
      subscription: 570,
    },
    {
      name: 'Nov',
      revenue: 18000,
      subscription: 300,
    },
    {
      name: 'Dec',
      revenue: 21750,
      subscription: 548,
    },
  ];

  const interactions = [
    {
      document: 'Copy of Grades',
      name: 'Wilfredo Soriano Jr.',
      date: 'June 16, 2024',
      time: ' 10:49 AM'
    },
    {
      document: 'Transcript of Records',
      name: 'John Doe',
      date: 'July 24, 2024',
      time: ' 2:03 PM'
    },
    {
      document: 'Certificate of Compeletion',
      name: 'Jimwel Soriano',
      date: 'June 16, 2024',
      time: '10:49 AM'
    },
    {
      document: 'Copy of Grades',
      name: 'Juan Dela Cruz',
      date: 'August 28, 2024',
      time: ' 9:06 AM',
    },
    {
      document: 'Copy of Grades',
      name: 'Juan Dela Cruz',
      date: 'August 28, 2024',
      time: ' 9:06 AM',
    },
    {
      document: 'Copy of Grades',
      name: 'Juan Dela Cruz',
      date: 'August 28, 2024',
      time: ' 9:06 AM',
    },
    {
      document: 'Copy of Grades',
      name: 'Juan Dela Cruz',
      date: 'August 28, 2024',
      time: ' 9:06 AM',
    },
    {
      document: 'Copy of Grades',
      name: 'Juan Dela Cruz',
      date: 'August 28, 2024',
      time: ' 9:06 AM',
    },
    {
      document: 'Copy of Grades',
      name: 'Juan Dela Cruz',
      date: 'August 28, 2024',
      time: ' 9:06 AM',
    },
    {
      document: 'Copy of Grades',
      name: 'Juan Dela Cruz',
      date: 'August 28, 2024',
      time: ' 9:06 AM',
    },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  }

  return (
    <div className='flex-1 w-full'>
      <PageHeader />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <DashboardBox title='Total Users' count={totalUsers} logo={<LuUsers size={20} />} />
        <DashboardBox title='Total Documents' count={totalDocuments} logo={<LuFolder size={20} />} />
        <DashboardBox title='Total Appointments' count={totalAppointments} logo={<LuCalendar size={20} />} />
        <DashboardBox title='Released Documents Today' count='20' logo={<LuCalendar size={20} />} />
        <DashboardBox title='Request Today' count={totalDocumentsToday} logo={<LuCalendar size={20} />} />
        <DashboardBox title='Total Earned' count='5789.00' logo={<LuCoins size={20} />} />

        <div className='lg:col-span-2 shadow-lg border rounded-lg p-5'>
          <div className=''>
            <h1 className='text-xl font-semibold '>Monthly Transaction</h1>
            <p>You will see the total of your transaction each month</p>
          </div>
          <div className='mt-5'>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>

            {/* <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <Bar dataKey="name" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer> */}
          </div>
        </div>

        <div className='flex flex-col col-span-1 border shadow-lg rounded-lg p-5 h-[50vh] min-h-[550px] max-h-[100vh]'>
          <div>
            <h1 className='text-xl font-semibold '>Recent Transactions</h1>
            <p>See all your recent transactions here </p>
          </div>
          <div className='overflow-y-auto mt-5 pr-3 flex-grow'>
            {interactions.map((interaction, i) => (
              <div key={i}>
              <div className='flex items-center lg:max-xl:flex-col lg:max-xl:items-start md:items-center max-sm:flex-col max-sm:items-start justify-between'>
                <div>
                  <h1 className='text-xs sm:text-xs md:text-sm lg:text-md font-bold'>{interaction.name}</h1>
                  <p className='text-xs sm:text-xs md:text-sm lg:text-md text-muted-foreground'>{interaction.document}</p>
                </div>
                <div>
                <div className='md:text-xs max-md:text-xs'>{interaction.date}</div>
                <div className='md:text-xs max-md:text-xs text-end max-sm:text-start lg:max-xl:text-start'>{interaction.time}</div>
                </div>
              </div>
              <Separator className="my-2"/>
              </div>
            ))}
          </div>
          {/* 
          <ScrollArea className="rounded-md">
            <div className="pr-4 mt-4">
              {interactions.map((interaction, i) => (
                <>
                  <div key={i} className='flex items-center justify-between'>
                    <div>
                      <h1 className='text-sm font-bold'>{interaction.name}</h1>
                      <p className='text-sm text-muted-foreground'>{interaction.document}</p>
                    </div>
                    <div className='md:text-xs max-md:text-xs'>{interaction.date}</div>
                  </div>
                </>
              ))}
            </div>
          </ScrollArea> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
