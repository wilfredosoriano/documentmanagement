import React from 'react';
import { LuGraduationCap, } from 'react-icons/lu';

const MobileRequestTicket = ({ randomNumber, documentName, documentPrice, finalPrice }) => {

  return (
    <div className='m-12 md:m-20 lg:m-32 transition-all'>
        <div className='flex flex-row justify-between items-center'>
            <div className=''>
                <div className='flex flex-row items-center gap-1 cursor-pointer mr-20 max-md:mr-10'>
                    <LuGraduationCap size={30} />
                    <span className='text-sm md:text-md lg:text-lg'>UniForms</span>
                </div>
            </div>
            <div className='flex flex-col items-start'>
                <h1 className='text-sm md:text-md lg:text-lg'>INVOICE</h1>
                <p className='text-sm md:text-md lg:text-lg'>Date: 01/05/2025</p>
                <p className='text-sm md:text-md lg:text-lg'>Invoice no. {randomNumber}</p>
            </div>
        </div>
        <div className='mt-20'>
            <h1 className='font-bold text-sm md:text-md lg:text-lg'>Bill To: </h1>
            <h3 className='text-sm md:text-md lg:text-lg'>Urdaneta City University</h3>
            <p className='text-sm md:text-md lg:text-lg'>San Vicente West, Urdaneta, Pangasinan</p>
        </div>
        <hr className='bg-primary h-1 my-4'/>
        <div>
            <h1 className='mb-8'>Document Name: </h1>
            <div className='flex flex-row justify-between'>
                <h1 className='font-bold text-sm md:text-md lg:text-lg'>{documentName}</h1>
                <h1 className='text-sm md:text-md lg:text-lg'>{documentPrice}</h1>
            </div>
        </div>
        <div className='my-16 flex flex-col items-end'>
            <p className='mb-5 text-sm md:text-md lg:text-lg'>Precessing fee: 20.00</p>
            <div className='flex items-end gap-1'>
                <p>Total:</p>
                <p className='font-bold text-sm md:text-md lg:text-lg'>{finalPrice}</p>
            </div>
        </div>
    </div>
  )
}

export default MobileRequestTicket;