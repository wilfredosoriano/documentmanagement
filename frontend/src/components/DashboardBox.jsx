import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

const DashboardBox = ({ title, count, logo }) => {
  return (
    // <div className='flex items-center md:flex-wrap justify-between border bg-background p-4 rounded-xl w-full'>
        // <div className='flex flex-col gap-4'>
        //     <h2 className='md:text-md font-bold'>{title}</h2>
        //     <p className='md:text-lg'>{count}</p>
        // </div>
    //     <div>{logo}</div>
    // </div>
    <Card>
      <CardHeader className="font-bold">
        {title}
      </CardHeader>
      <CardContent className='flex items-center justify-between'>
          <p className='md:text-lg'>{count}</p>
        <div>{logo}</div>
      </CardContent>
    </Card>
  )
}

export default DashboardBox;