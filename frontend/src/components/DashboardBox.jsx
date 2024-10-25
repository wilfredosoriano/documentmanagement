import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

const DashboardBox = ({ title, count, logo, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="font-bold text-white">
        {title}
      </CardHeader>
      <CardContent className='flex items-center justify-between'>
          <p className='md:text-lg text-white'>{count}</p>
        <div className='bg-white p-2 rounded-full shadow-md'>
          <div>{logo}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardBox;