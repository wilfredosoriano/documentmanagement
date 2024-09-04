import React from 'react';

const DashboardBox = ({ title, count, logo }) => {
  return (
    <div className='flex items-center md:flex-wrap justify-between border shadow-md bg-background p-4 rounded-xl w-full'>
        <div className='flex flex-col gap-4'>
            <h2 className='md:text-md font-bold'>{title}</h2>
            <p className='md:text-lg'>{count}</p>
        </div>
        <div>{logo}</div>
    </div>
  )
}

export default DashboardBox;