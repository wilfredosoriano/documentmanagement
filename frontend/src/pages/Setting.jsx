import React from 'react';
import PageHeader from '@/components/PageHeader';
import Profile from '@/components/Profile';

const Setting = () => {

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
