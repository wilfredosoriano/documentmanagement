import React from 'react';
import { LuFolderSymlink } from 'react-icons/lu';

const DocumentBox = ({ document, appointments, imageUrl, handleReserve }) => {


  const formattedImageUrl = `data:image/jpeg;base64,${imageUrl}`;

  return (
    <div className='flex flex-col border shadow-md bg-background w-full'>
        <img src={formattedImageUrl} alt={document} className='h-[240px] object-cover' />
        <div className='flex flex-row items-center justify-between p-5'>
            <div className='flex flex-col items-start'>
                <div className='font-bold text-lg'>{document}</div>
                <div><span className='text-muted-foreground'>Total Appointments:</span> {appointments}</div>
            </div>
            <div className='bg-slate-200 p-4 rounded-full cursor-pointer hover:bg-slate-100' onClick={handleReserve} ><LuFolderSymlink size={30}/></div>
        </div>
    </div>
  )
}

export default DocumentBox;